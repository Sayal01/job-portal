"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "@/lib/config";

import Cookies from "js-cookie";
type Department = {
    id: number;
    name: string;
};

export default function DepartmentManagement() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [name, setName] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const authToken = Cookies.get("AuthToken")
    // Fetch departments from API
    const fetchDepartments = async () => {
        try {
            const res = await axios.get(`${API_URL}/departments`

            ); // Adjust URL as needed
            setDepartments(res.data.departments);
        } catch (error) {
            toast.error("Failed to load departments");
            console.error(error);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    // Add or update department
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("Please enter name ");
            return;
        }
        setLoading(true);
        try {
            if (editingId) {
                // Update existing
                await axios.put(`${API_URL}/departments/${editingId}`, { name }, {
                    headers: {
                        Authorization: `Bearer ${authToken}`, // <-- add token here
                        "Content-Type": "application/json",
                    },
                });
                toast.success("Department updated");
            } else {
                // Add new
                await axios.post(`${API_URL}/departments/add`, { name },
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`, // <-- add token here
                            "Content-Type": "application/json",
                        },
                    }
                );
                toast.success("Department added");
            }
            setName("");
            setEditingId(null);
            fetchDepartments();
        } catch (error) {
            toast.error("Failed to save department");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Delete department
    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this department?")) return;

        setLoading(true);
        try {
            await axios.delete(`${API_URL}/departments/${id}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
            });
            toast.success("Department deleted");
            fetchDepartments();
        } catch (error) {
            toast.error("Failed to delete department");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Start editing a department
    const handleEdit = (dept: Department) => {
        setName(dept.name);

        setEditingId(dept.id);
    };

    // Cancel editing
    const handleCancelEdit = () => {
        setName("");

        setEditingId(null);
    };

    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">{editingId ? "Edit Department" : "Add Department"}</h1>
            <form onSubmit={handleSubmit} className="mb-6 space-y-4">
                <div>
                    <label className="block mb-1 font-medium">Name</label>
                    <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={loading}
                        placeholder="Department Name"
                    />
                </div>
                <div className="flex gap-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        {editingId ? "Update" : "Add"}
                    </button>
                    {editingId && (
                        <button
                            type="button"
                            onClick={handleCancelEdit}
                            disabled={loading}
                            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <h2 className="text-xl font-semibold mb-3">Departments List</h2>
            {departments.length === 0 ? (
                <p>No departments found.</p>
            ) : (
                <ul className="space-y-3">
                    {departments.map((dept) => (
                        <li
                            key={dept.id}
                            className="flex justify-between items-center border rounded p-3"
                        >
                            <div>
                                <p className="font-medium">{dept.name}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(dept)}
                                    className="text-blue-600 hover:underline"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(dept.id)}
                                    className="text-red-600 hover:underline"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
