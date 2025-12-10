<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class JobFactory extends Factory
{
    protected $model = \App\Models\Job::class;

    public function definition()
    {
        // Predefined job templates per category
        $categories = [
            'Tech' => [
                'title' => 'Frontend Developer (React.js)',
                'description' => "We are seeking a Frontend Developer with strong experience in React.js to build responsive, high-performance user interfaces. The role involves converting UI/UX designs into functional components, integrating REST APIs, optimizing page speed, and collaborating closely with the backend and design teams.",
                'skills' => ['React.js', 'JavaScript', 'Tailwind CSS', 'REST API', 'Git'],
                'responsibilities' => [
                    'Develop responsive UI using React.js and Tailwind CSS',
                    'Integrate REST API endpoints with frontend components',
                    'Optimize application performance and loading speed',
                    'Work closely with UI/UX designers to implement clean interfaces',
                    'Write reusable and maintainable frontend code',
                ],
                'requirements' => [
                    'Strong knowledge of React.js and JavaScript ES6+',
                    'Hands-on experience with REST APIs and component-based architecture',
                    'Good understanding of state management (Redux or Context API)',
                    'Familiarity with Git and version control',
                ],
                'qualifications' => [
                    'Bachelor’s degree in Computer Science or related field',
                    'Experience in frontend frameworks or UI component libraries',
                ],
                'min_experience' => 1,
                'max_experience' => 3,
                'salary_min' => '40000',
                'salary_max' => '70000',
            ],
            'Marketing' => [
                'title' => 'Digital Marketing Specialist',
                'description' => "We are looking for a Digital Marketing Specialist to plan, execute, and optimize marketing campaigns. The role includes SEO, social media, email marketing, and analytics to drive growth.",
                'skills' => ['SEO', 'Content Writing', 'Google Ads', 'Social Media', 'Analytics', 'Email Marketing'],
                'responsibilities' => [
                    'Develop marketing strategies',
                    'Manage social media campaigns',
                    'Conduct market research',
                    'Create engaging content',
                    'Analyze campaign performance',
                ],
                'requirements' => [
                    'Experience with digital marketing tools',
                    'Strong communication and writing skills',
                    'Ability to analyze data and trends',
                ],
                'qualifications' => [
                    'Bachelor’s degree in Marketing or related field',
                    'Certification in Google Ads or SEO is a plus',
                ],
                'min_experience' => 1,
                'max_experience' => 3,
                'salary_min' => '35000',
                'salary_max' => '60000',
            ],
            'HR' => [
                'title' => 'HR Executive',
                'description' => "We are hiring an HR Executive to manage employee relations, recruitment, and HR processes. The role includes conducting training sessions, maintaining employee records, and ensuring HR compliance.",
                'skills' => ['Recruitment', 'Payroll', 'Employee Relations', 'HR Policies', 'Training'],
                'responsibilities' => [
                    'Manage recruitment process',
                    'Maintain employee records',
                    'Conduct training sessions',
                    'Handle employee grievances',
                    'Ensure HR policy compliance',
                ],
                'requirements' => [
                    '2+ years of HR experience',
                    'Knowledge of labor laws',
                    'Good interpersonal skills',
                ],
                'qualifications' => [
                    'Bachelor’s degree in Human Resources or related field',
                ],
                'min_experience' => 1,
                'max_experience' => 3,
                'salary_min' => '30000',
                'salary_max' => '50000',
            ],
            'Finance' => [
                'title' => 'Financial Analyst',
                'description' => "We are looking for a Financial Analyst to prepare financial reports, monitor budgets, and analyze financial data to support business decisions.",
                'skills' => ['Accounting', 'Excel', 'Financial Analysis', 'Budgeting', 'Reporting'],
                'responsibilities' => [
                    'Prepare financial reports',
                    'Monitor budgets',
                    'Perform financial analysis',
                    'Ensure compliance with tax laws',
                ],
                'requirements' => [
                    'Knowledge of accounting software',
                    'Attention to detail',
                    'Analytical mindset',
                ],
                'qualifications' => [
                    'Bachelor’s degree in Finance or Accounting',
                    'CPA is a plus',
                ],
                'min_experience' => 2,
                'max_experience' => 5,
                'salary_min' => '40000',
                'salary_max' => '80000',
            ],
            'Design' => [
                'title' => 'UI/UX Designer',
                'description' => "We are hiring a UI/UX Designer to design interfaces, create visual assets, and collaborate with the product team to deliver user-friendly applications.",
                'skills' => ['Photoshop', 'Illustrator', 'Figma', 'UI/UX Design', 'Branding'],
                'responsibilities' => [
                    'Create visual designs',
                    'Design user interfaces',
                    'Work on branding and marketing materials',
                    'Collaborate with product teams',
                ],
                'requirements' => [
                    'Portfolio of design projects',
                    'Experience with design tools',
                    'Creativity and attention to detail',
                ],
                'qualifications' => [
                    'Bachelor’s degree in Design or related field',
                ],
                'min_experience' => 1,
                'max_experience' => 3,
                'salary_min' => '35000',
                'salary_max' => '60000',
            ],
            'Sales' => [
                'title' => 'Sales Executive',
                'description' => "We are looking for a Sales Executive to identify potential clients, negotiate contracts, and close deals to drive revenue growth.",
                'skills' => ['Lead Generation', 'Negotiation', 'CRM', 'Customer Acquisition', 'Closing Deals'],
                'responsibilities' => [
                    'Identify and reach out to potential clients',
                    'Manage and maintain CRM database',
                    'Negotiate contracts and close deals',
                    'Build relationships with clients',
                ],
                'requirements' => [
                    '2+ years experience in sales',
                    'Strong negotiation skills',
                    'Excellent communication abilities',
                ],
                'qualifications' => [
                    'Bachelor’s degree in Business or related field',
                ],
                'min_experience' => 1,
                'max_experience' => 4,
                'salary_min' => '35000',
                'salary_max' => '65000',
            ],
            'Customer Support' => [
                'title' => 'Customer Support Executive',
                'description' => "We are hiring a Customer Support Executive to respond to customer queries, provide assistance, and ensure high customer satisfaction levels.",
                'skills' => ['Communication', 'Problem Solving', 'CRM', 'Technical Support', 'Empathy'],
                'responsibilities' => [
                    'Respond to customer queries promptly',
                    'Provide technical support when needed',
                    'Document and resolve customer complaints',
                    'Maintain customer satisfaction',
                ],
                'requirements' => [
                    'Prior experience in customer service',
                    'Good problem-solving skills',
                    'Strong communication skills',
                ],
                'qualifications' => [
                    'Bachelor’s degree preferred',
                ],
                'min_experience' => 0,
                'max_experience' => 3,
                'salary_min' => '25000',
                'salary_max' => '45000',
            ],
            'Operations' => [
                'title' => 'Operations Coordinator',
                'description' => "We are seeking an Operations Coordinator to manage daily operations, coordinate teams, optimize workflows, and prepare operational reports.",
                'skills' => ['Process Management', 'Logistics', 'Inventory', 'Reporting', 'Team Coordination'],
                'responsibilities' => [
                    'Manage daily operations',
                    'Coordinate with various teams',
                    'Optimize operational workflows',
                    'Prepare operational reports',
                ],
                'requirements' => [
                    'Experience in operations management',
                    'Strong organizational skills',
                    'Ability to manage teams',
                ],
                'qualifications' => [
                    'Bachelor’s degree in Business or Operations',
                ],
                'min_experience' => 1,
                'max_experience' => 4,
                'salary_min' => '30000',
                'salary_max' => '60000',
            ],
            'Analytics' => [
                'title' => 'Data Analyst',
                'description' => "We are looking for a Data Analyst to analyze datasets, create dashboards, generate insights, and support data-driven decision making.",
                'skills' => ['Excel', 'SQL', 'Data Visualization', 'Statistics', 'Python/R'],
                'responsibilities' => [
                    'Analyze datasets to generate insights',
                    'Create dashboards and visualizations',
                    'Prepare reports for management',
                    'Assist in decision-making using data',
                ],
                'requirements' => [
                    'Experience with analytics tools',
                    'Strong analytical and problem-solving skills',
                    'Attention to detail',
                ],
                'qualifications' => [
                    'Bachelor’s degree in Statistics, Math, or related field',
                ],
                'min_experience' => 1,
                'max_experience' => 3,
                'salary_min' => '35000',
                'salary_max' => '60000',
            ],
        ];

        // Pick a random category
        $category = $this->faker->randomElement(array_keys($categories));
        $data = $categories[$category];

        // Get department ID matching the category
        $department = \App\Models\Department::where('name', $category)->first();
        $departmentId = $department ? $department->id : null;

        // Fixed dates for consistency
        $startDate = now()->addDays(3)->format('Y-m-d');
        $applicationDeadline = now()->addWeeks(3)->format('Y-m-d');

        return [
            'company_id' => \App\Models\Company::inRandomOrder()->first()->id ?? 1,
            'department_id' => $departmentId,
            'title' => $data['title'],
            'description' => $data['description'],
            'location' => 'Kathmandu',
            'type' => 'full-time',
            'min_experience' => $data['min_experience'],
            'max_experience' => $data['max_experience'],
            'salary_min' => $data['salary_min'],
            'salary_max' => $data['salary_max'],
            'responsibilities' => $data['responsibilities'],
            'requirements' => $data['requirements'],
            'qualifications' => $data['qualifications'],
            'skills' => $data['skills'],
            'start_date' => $startDate,
            'application_deadline' => $applicationDeadline,
            'interview_stages' => [
                [
                    'name' => 'HR Interview',
                    'description' => 'Initial HR round to assess general fit and communication skills.'
                ],
                [
                    'name' => 'Technical/Skill Interview',
                    'description' => 'Assessment relevant to the role.'
                ],
                [
                    'name' => 'Final Interview',
                    'description' => 'Final discussion with the management team.'
                ]
            ],
        ];
    }
}
