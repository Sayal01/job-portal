"use client"
import { JobCard } from "@/components/job-card"
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "@/lib/config";
const jobs = [
    {
        id: "1",
        title: "Senior Frontend Developer",
        company: "TechCorp Inc.",
        location: "San Francisco, CA",
        type: "Full Time",
        salary: "$120,000 - $150,000",
        description:
            "We're looking for a senior frontend developer to join our team and help build the next generation of web applications.",
        requirements: ["5+ years React experience", "TypeScript proficiency", "Next.js knowledge"],
        postedDate: "2 days ago",
        logo: "/placeholder.svg?height=40&width=40",
    },
    {
        id: "2",
        title: "Product Manager",
        company: "StartupXYZ",
        location: "New York, NY",
        type: "Full Time",
        salary: "$100,000 - $130,000",
        description: "Join our product team to drive strategy and execution for our flagship products.",
        requirements: ["3+ years PM experience", "Agile methodology", "Data-driven mindset"],
        postedDate: "1 day ago",
        logo: "/placeholder.svg?height=40&width=40",
    },
    {
        id: "3",
        title: "UX/UI Designer",
        company: "DesignStudio",
        location: "Remote",
        type: "Contract",
        salary: "$80,000 - $100,000",
        description: "Create beautiful and intuitive user experiences for our clients' digital products.",
        requirements: ["Figma expertise", "User research skills", "Portfolio required"],
        postedDate: "3 days ago",
        logo: "/placeholder.svg?height=40&width=40",
    },
    {
        id: "4",
        title: "Data Scientist",
        company: "DataTech Solutions",
        location: "Austin, TX",
        type: "Full Time",
        salary: "$110,000 - $140,000",
        description: "Analyze complex datasets and build machine learning models to drive business insights.",
        requirements: ["Python/R proficiency", "ML experience", "Statistics background"],
        postedDate: "1 week ago",
        logo: "/placeholder.svg?height=40&width=40",
    },
    {
        id: "5",
        title: "DevOps Engineer",
        company: "CloudFirst",
        location: "Seattle, WA",
        type: "Full Time",
        salary: "$95,000 - $125,000",
        description: "Build and maintain scalable infrastructure and deployment pipelines.",
        requirements: ["AWS/Azure experience", "Docker/Kubernetes", "CI/CD pipelines"],
        postedDate: "4 days ago",
        logo: "/placeholder.svg?height=40&width=40",
    },
    {
        id: "6",
        title: "Marketing Specialist",
        company: "GrowthCo",
        location: "Chicago, IL",
        type: "Part Time",
        salary: "$50,000 - $65,000",
        description: "Drive marketing campaigns and growth initiatives for our B2B SaaS platform.",
        requirements: ["Digital marketing experience", "Analytics tools", "Content creation"],
        postedDate: "5 days ago",
        logo: "/placeholder.svg?height=40&width=40",
    },
]
interface fetchJobType {
    jobs: Job[];
    status: string;
}
interface Company {
    id: string;
    user_id: string;
    company_name: string;
    description: string;
    website: string;
    created_at: string;
    updated_at: string;
}

interface Job {
    id: string;
    title: string;
    company: Company; // <-- not string!
    location: string;
    type: string;
    salary_min: string;
    salary_max: string;
    description: string;
    requirements: string[] | null;
    postedDate: string;
    logo: string;
}

export function JobListings() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axios.get(`${API_URL}/jobs`); // ✅ Replace with your real API endpoint
                setJobs(response.data.jobs);
            } catch (error) {
                toast.error("Failed to load jobs");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    if (loading) {
        return <div>Loading jobs...</div>;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Latest Job Opportunities</h2>
                <span className="text-gray-600">{jobs.length} jobs found</span>
            </div>

            <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                {jobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                ))}
            </div>
        </div>
    )
}
