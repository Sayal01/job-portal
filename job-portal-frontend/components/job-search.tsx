"use client"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Briefcase } from "lucide-react"

interface Department {
    id: string;
    name: string;
}
interface JobSearchProps {
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    locationFilter: string;
    setLocationFilter: (value: string) => void;
    typeFilter: string;
    setTypeFilter: (value: string) => void;
    departmentFilter: string;
    setDepartmentFilter: (value: string) => void;
    departments: Department[];
};

export function JobSearch({
    searchQuery,
    setSearchQuery,
    locationFilter,
    setLocationFilter,
    typeFilter,
    setTypeFilter,
    departmentFilter,
    setDepartmentFilter,
    departments,
}: JobSearchProps) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Job title, keywords..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Location"
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <div className="relative">
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-full">
                            <div className="flex items-center gap-2">
                                <Briefcase className="h-4 w-4 text-gray-400" />
                                <SelectValue placeholder="Job Type" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="full-time">Full Time</SelectItem>
                            <SelectItem value="part-time">Part Time</SelectItem>
                            <SelectItem value="contract">Contract</SelectItem>
                            <SelectItem value="remote">Remote</SelectItem>
                            <SelectItem value="internship">Internship</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="relative border-black">
                    <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Department" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Departments</SelectItem>
                            {departments.map((dep) => (
                                <SelectItem key={dep.id} value={dep.id}>
                                    {dep.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                {/* Optional: remove button or keep for manual search */}

            </div>
        </div>
    );
}
