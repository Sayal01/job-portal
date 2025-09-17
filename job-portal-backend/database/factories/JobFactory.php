<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Arr;

class JobFactory extends Factory
{
    protected $model = \App\Models\Job::class;

    public function definition()
    {
        $skillsPool = ['Laravel', 'React', 'MySQL', 'Vue', 'Tailwind', 'Docker', 'Node.js', 'Redis', 'PHP', 'AWS'];
        $responsibilitiesPool = [
            'Write clean, maintainable code',
            'Collaborate with frontend team',
            'Optimize applications for speed',
            'Participate in code reviews',
            'Maintain CI/CD pipelines',
            'Design RESTful APIs',
        ];
        $requirementsPool = [
            '3+ years experience in software development',
            'Knowledge of database design',
            'Strong problem-solving skills',
            'Familiarity with Agile methodologies',
            'Excellent communication skills',
        ];
        $qualificationsPool = [
            'Bachelor’s degree in Computer Science or related field',
            'Certification in relevant technologies is a plus',
            'Experience working in startups or tech companies',
        ];
        $startDate = $this->faker->dateTimeBetween('now', '+1 week');
        $applicationDeadline = $this->faker->dateTimeBetween($startDate->format('Y-m-d'), '+1 month');
        return [
            'company_id' => \App\Models\Company::inRandomOrder()->first()->id ?? 1,
            'department_id' => \App\Models\Department::inRandomOrder()->first()->id ?? null,
            'title' => $this->faker->jobTitle(),
            'description' => $this->faker->paragraph(),
            'location' => $this->faker->city(),
            'type' => $this->faker->randomElement(['full-time', 'part-time', 'internship']),
            'min_experience' => $this->faker->numberBetween(0, 5),
            'max_experience' => $this->faker->numberBetween(6, 10),
            'salary_min' => (string) $this->faker->numberBetween(20000, 50000),
            'salary_max' => (string) $this->faker->numberBetween(60000, 100000),
            'responsibilities' => $this->faker->randomElements($responsibilitiesPool, rand(2, 4)),
            'requirements' => $this->faker->randomElements($requirementsPool, rand(2, 4)),
            'qualifications' => $this->faker->randomElements($qualificationsPool, rand(1, 3)),
            'skills' => $this->faker->randomElements($skillsPool, rand(2, 5)),
            'start_date' => $startDate->format('Y-m-d'),
            'application_deadline' => $applicationDeadline->format('Y-m-d'),
        ];
    }
}
