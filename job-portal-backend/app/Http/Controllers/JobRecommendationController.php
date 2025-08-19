<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Profiles;
use App\Models\Job;
use Carbon\Carbon;

class JobRecommendationController extends Controller
{
    // Calculate total experience in years from work history
    function calculateTotalExperience(array $workExperiences): float
    {
        $totalMonths = 0;

        foreach ($workExperiences as $exp) {
            // Skip if start date missing
            if (empty($exp['start_date'])) {
                continue;
            }

            // Parse start and end dates safely
            try {
                $start = Carbon::createFromFormat('Y-m-d', $exp['start_date']);
            } catch (\Exception $e) {
                continue; // skip invalid start date
            }

            if (!empty($exp['end_date'])) {
                try {
                    $end = Carbon::createFromFormat('Y-m-d', $exp['end_date']);
                } catch (\Exception $e) {
                    $end = Carbon::now(); // fallback if invalid end date
                }
            } else {
                $end = Carbon::now();
            }

            // Skip if end is before start
            if ($end < $start) {
                continue;
            }

            // Calculate months difference
            $months = $end->diffInMonths($start, false); // false allows negative
            $months = abs($months); // ensure positive
            $totalMonths += $months;
        }

        // Convert to years with 2 decimals
        return round($totalMonths / 12, 2);
    }


    // Calculate content-based score
    private function contentBasedScore(array $candidate, array $job): array
    {
        // Skills
        $candidateSkills = array_map('strtolower', $candidate['skills'] ?? []);
        $jobSkills = array_map('strtolower', $job['skills'] ?? []);
        $allSkills = array_unique(array_merge($candidateSkills, $jobSkills));

        $vecA = $vecB = [];
        $matchVector = [];
        $missingSkills = [];

        foreach ($allSkills as $skill) {
            $inCandidate = in_array($skill, $candidateSkills) ? 1 : 0;
            $inJob = in_array($skill, $jobSkills) ? 1 : 0;

            $vecA[] = $inCandidate;
            $vecB[] = $inJob;
            $matchVector[$skill] = $inCandidate && $inJob ? 1 : 0;

            if ($inJob && !$inCandidate) $missingSkills[] = $skill;
        }

        // Cosine similarity for skills
        $dot = $normA = $normB = 0;
        for ($i = 0; $i < count($allSkills); $i++) {
            $dot += $vecA[$i] * $vecB[$i];
            $normA += $vecA[$i] * $vecA[$i];
            $normB += $vecB[$i] * $vecB[$i];
        }
        $skillScore = ($normA && $normB) ? $dot / (sqrt($normA) * sqrt($normB)) : 0;

        // Experience score
        $candidateExp = $this->calculateTotalExperience($candidate['work_experiences'] ?? []);

        error_log('Candidate total experience: ' . $candidateExp);

        $minExp = $job['min_experience'] ?? 0;
        $maxExp = $job['max_experience'] ?? 0;
        // Ensure maxExpForCalc is at least 1 to avoid division by zero
        $maxExpForCalc = max($maxExp, 1);

        if ($candidateExp < $minExp) {
            // Below minimum: proportional score
            $experienceScore = max(0, $candidateExp / $minExp);
            $experienceReason = "Candidate experience (" . round($candidateExp, 2) . " yrs) below job minimum ({$minExp} yrs)";
        } elseif ($candidateExp >= $minExp && $candidateExp <= $maxExp) {
            // Within range: score increases linearly towards maxExpForCalc
            $experienceScore = 0.7 + 0.3 * (($candidateExp - $minExp) / max($maxExp - $minExp, 1));
            $experienceReason = null;
        } else {
            // Above max: full score (or slightly bonus capped at 1.1 if you want)
            $experienceScore = 1; // or min(1.1, 1 + ($candidateExp - $maxExp)/$maxExp)
            $experienceReason = "Candidate experience (" . round($candidateExp, 2) . " yrs) above job maximum ({$maxExp} yrs)";
        }

        // Role score
        $roleScore = 0;
        $roleReason = null;

        $preferredRole = strtolower(trim($candidate['preferred_role'] ?? ''));
        $jobTitle = strtolower(trim($job['title'] ?? ''));

        if ($preferredRole && $jobTitle) {
            // Split preferred role and job title into words
            $preferredWords = preg_split('/\s+/', $preferredRole);
            $jobWords = preg_split('/\s+/', $jobTitle);

            $totalScore = 0;

            foreach ($preferredWords as $pWord) {
                $bestMatch = 0;
                foreach ($jobWords as $jWord) {
                    similar_text($pWord, $jWord, $percent);
                    $bestMatch = max($bestMatch, $percent); // take best similarity for each preferred word
                }
                $totalScore += $bestMatch / 100; // convert percentage to 0–1
            }

            $roleScore = $totalScore / max(count($preferredWords), 1); // average over all preferred words

            if ($roleScore < 0.5) {
                $roleReason = "Preferred role '{$candidate['preferred_role']}' not closely matching job title '{$job['title']}' (score: " . round($roleScore, 2) . ")";
            }
        }

        $finalScore = 0.5 * $skillScore + 0.3 * $experienceScore + 0.2 * $roleScore;

        $reason = [];
        if (!empty($missingSkills)) $reason[] = "Missing skills: " . implode(', ', $missingSkills);
        if ($experienceReason) $reason[] = $experienceReason;
        if ($roleReason) $reason[] = $roleReason;

        return [
            'score' => $finalScore,
            'skill_score' => $skillScore,
            'experience_score' => $experienceScore,
            'role_score' => $roleScore,
            'match_vector' => $matchVector,
            'reason' => $reason
        ];
    }

    // API: recommend jobs
    public function recommendJobs(Request $request, $profile_id = null)
    {
        $user = $request->user();

        // Get profile
        if ($user->role === 'job_seeker') {
            $profile = Profiles::where('user_id', $user->id)->firstOrFail();
        } elseif ($user->role === 'admin' && $profile_id) {
            $profile = Profiles::findOrFail($profile_id);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized or profile_id missing for admin'
            ], 403);
        }

        // Decode work_experience only if it's a string
        $workExperiences = is_string($profile->work_experience)
            ? json_decode($profile->work_experience, true)
            : ($profile->work_experience ?? []);
        foreach ($workExperiences as $exp) {
            $start = Carbon::parse($exp['start_date']);
            $end = !empty($exp['end_date']) ? Carbon::parse($exp['end_date']) : Carbon::now();
            $months = $end->diffInMonths($start);
            error_log("Experience for {$exp['company']}: {$months} months");
        }

        // Candidate object
        $candidate = [
            'skills' => $profile->skills ?? [],
            'preferred_role' => $profile->preferred_role ?? '',
            'work_experiences' => $workExperiences
        ];

        // Active jobs
        $today = Carbon::today()->toDateString();
        $jobsQuery = Job::where('application_deadline', '>=', $today);
        if ($request->has('type')) $jobsQuery->where('type', $request->input('type'));
        $jobs = $jobsQuery->get();

        $results = [];

        foreach ($jobs as $job) {
            $jobSkills = $job->skills ?? [];

            $scoreData = $this->contentBasedScore($candidate, [
                'id' => $job->id,
                'skills' => $jobSkills,
                'min_experience' => $job['min_experience'],
                'max_experience' => $job['max_experience'],
                'title' => $job->title
            ]);

            $results[] = [
                'job' => $job,
                'score' => round($scoreData['score'], 3),
                'skill_score' => round($scoreData['skill_score'], 3),
                'experience_score' => round($scoreData['experience_score'], 3),
                'role_score' => round($scoreData['role_score'], 3),
                'match_vector' => $scoreData['match_vector'],
                'reason' => $scoreData['reason'],
                'work_experience' => $candidate['work_experiences']
            ];
        }

        usort($results, fn($a, $b) => $b['score'] <=> $a['score']);

        return response()->json([
            'status' => true,
            'recommendations' => $results
        ]);
    }
}
