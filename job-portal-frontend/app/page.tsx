"use client"
import { JobSearch } from "@/components/job-search"
import { JobListings } from "@/components/job-listings"

import { useState, useEffect } from "react";
import { API_URL } from "@/lib/config";
import axios from "axios";
interface Department {
  id: string;
  name: string;
}

export default function HomePage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");

  useEffect(() => {
    // Fetch departments once
    axios.get(`${API_URL}/departments`)
      .then(res => setDepartments(res.data.departments || []))
      .catch(err => console.error(err));
  }, []);
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Dream Job</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover thousands of job opportunities from top companies
          </p>
        </div>
        <div className="max-h-[70vh] overflow-auto">
          <JobSearch
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            locationFilter={locationFilter}
            setLocationFilter={setLocationFilter}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            departmentFilter={departmentFilter}
            setDepartmentFilter={(value) => setDepartmentFilter(value === "all" ? "" : value)}
            departments={departments}
          />
        </div>
        <JobListings
          searchQuery={searchQuery}
          locationFilter={locationFilter}
          typeFilter={typeFilter}
          selectedDepartment={departmentFilter}
        />
      </div>
    </div>
  )
}