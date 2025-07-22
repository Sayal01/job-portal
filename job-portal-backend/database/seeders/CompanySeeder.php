<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Company;

class CompanySeeder extends Seeder
{
    public function run()
    {
        // Fetch all users with role 'company' who don't have a company record yet
        $companyUsers = User::where('role', 'company')
            ->whereDoesntHave('company')
            ->get();

        foreach ($companyUsers as $user) {
            Company::create([
                'user_id' => $user->id,
                'company_name' => $user->name . "'s Company", // Default name, you can customize
                'description' => null,
                'website' => null,
            ]);
        }
    }
}
