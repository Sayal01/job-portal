'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Loader from '@/components/Loader';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Application {
    id: number;
    status: string;
    cover_letter: string;
    created_at: string;
    updated_at: string;
    user: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        role: string;
        image: string | null;
        created_at: string;
        updated_at: string;
    };
    job: {
        id: number;
        title: string;
        description: string;
        location: string;
        type: string;
        experience_level: string;
        salary_min: string;
        salary_max: string;
        responsibilities: string[];
        requirements: string[];
        qualifications: string[];
        skills: string[];
        application_deadline: string;
        start_date: string;
        created_at: string;
        updated_at: string;
        company_id: number;
        department_id: number;
    };
}

export default function ManageApplicationsPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const token = Cookies.get("AuthToken");

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await axios.get('http://127.0.0.1:8000/api/admin/applications', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });
                setApplications(res.data.applications);
            } catch (error) {
                console.error('Failed to fetch applications', error);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    if (loading) return <Loader />;

    return (
        <div className="p-6 space-y-4 w-full ">
            <h1 className="text-2xl font-bold">Applications list</h1>
            {applications.length === 0 ? (
                <p>No applications found.</p>
            ) : (
                <div className=" grid md:grid-cols-2 gap-3 md:gap-6">
                    {applications.map((app) => (
                        <Card key={app.id}>
                            <CardHeader className="flex justify-between">
                                <CardTitle>{app.job?.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className='flex flex-col gap-1'>
                                    <p>
                                        <span className="font-semibold">Applicant:</span> {app.user?.first_name} {app.user?.last_name}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Email:</span> {app.user?.email}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Status:</span>{' '}
                                        <Badge variant="outline">{app.status}</Badge>
                                    </p>
                                </div>

                                <div className="flex gap-2 mt-4">
                                    <Link href={`/admin/dashboard/applicant/${app.user?.id}`}>
                                        <Button variant="secondary">View Applicant</Button>
                                    </Link>

                                    {app.job?.company_id && (
                                        <Link href={`/companies/${app.job.company_id}`}>
                                            <Button variant="outline">View Company</Button>
                                        </Link>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
