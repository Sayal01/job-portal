<?php

namespace App\Services;

use App\Models\Job;

class JobRecommenderService
{
    function extractFeatures(Job $job): array
    {
        $titleTokens = preg_split('/\W+/', strtolower($job->title), -1, PREG_SPLIT_NO_EMPTY);

        $skills = array_map('strtolower', $job->skills ?? []); // Access JSON decoded skills

        $category = [strtolower($job->department->name ?? '')]; // Or use another field for category

        // Remove empty category if any
        $category = array_filter($category);

        return array_unique(array_merge($titleTokens, $skills, $category));
    }


    public function jaccardSimilarity(array $setA, array $setB): float
    {
        $intersection = array_intersect($setA, $setB);
        $union = array_unique(array_merge($setA, $setB));

        if (count($union) === 0) {
            return 0.0;
        }

        return count($intersection) / count($union);
    }
}
