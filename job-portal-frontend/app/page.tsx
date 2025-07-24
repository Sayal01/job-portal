"use client"
import { JobSearch } from "@/components/job-search"
import { JobListings } from "@/components/job-listings"
import Loader from "@/components/Loader"
import { DashboardHeader } from "@/components/dashboard-header";
import { use } from "react"
import { myAppHook } from "@/context/AppProvider"
import RecommendedJobs from "@/components/RecommendedJobs";

export default function HomePage() {
  const { user } = myAppHook();
  console.log(user)
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Dream Job</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover thousands of job opportunities from top companies
          </p>
        </div>
        <JobSearch />
        <JobListings />
      </div>
    </div>
  )
}