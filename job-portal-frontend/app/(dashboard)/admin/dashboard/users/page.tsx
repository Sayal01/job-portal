"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { API_URL } from "@/lib/config";
import Cookies from "js-cookie";

interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
}

const roles = [
    { value: "", label: "All Roles" },
    { value: "admin", label: "Admin" },
    { value: "job_seeker", label: "Job Seeker" },
    { value: "employer", label: "Employer" },
];

export default function ManageUsersPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const currentRole = searchParams.get("role") || "";
    const token = Cookies.get("AuthToken");

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUsers() {
            setLoading(true);
            try {
                const res = await fetch(
                    `${API_URL}/admin/users${currentRole ? `?role=${currentRole}` : ""}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
                );
                const data = await res.json();
                setUsers(data.users || []);
            } catch (err) {
                console.error("Failed to fetch users", err);
            } finally {
                setLoading(false);
            }
        }

        fetchUsers();
    }, [currentRole]);

    function handleRoleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const newRole = e.target.value;
        const query = newRole ? `?role=${newRole}` : "";
        router.push(`/admin/dashboard/users/${query}`);
    }

    async function deleteUser(id: number) {
        if (!confirm("Are you sure you want to delete this user?")) return;
        await fetch(`${API_URL}/admin/users/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setUsers((prev) => prev.filter((u) => u.id !== id));
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Manage Users</h1>
                <select
                    value={currentRole}
                    onChange={handleRoleChange}
                    className="border px-3 py-2 rounded"
                >
                    {roles.map((role) => (
                        <option key={role.value} value={role.value}>
                            {role.label}
                        </option>
                    ))}
                </select>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="w-full border">
                    <thead>
                        <tr>
                            <th className="p-2 border">S.N</th>
                            <th className="p-2 border">Name</th>
                            <th className="p-2 border">Email</th>
                            <th className="p-2 border">Role</th>
                            <th className="p-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u, index) => (
                            <tr key={u.id}>
                                <td className="p-2 border">{index + 1}</td>
                                <td className="p-2 border">{u.first_name} {u.last_name}</td>
                                <td className="p-2 border">{u.email}</td>
                                <td className="p-2 border capitalize">{u.role}</td>
                                <td className="p-2 border">
                                    <button
                                        className="text-red-600 hover:underline"
                                        onClick={() => deleteUser(u.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center p-4">
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
}
