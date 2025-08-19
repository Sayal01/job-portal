
"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { API_URL } from "@/lib/config";
export default function CreateAdmin() {
    const [form, setForm] = useState({ name: "", email: "", password: "", password_confirmation: "" });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const token = Cookies.get("AuthToken");
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/admin/user/create`, form, { headers: { Authorization: `Bearer ${token}` } });
            toast.success(res.data.message);
            setForm({ name: "", email: "", password: "", password_confirmation: "" });
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Error creating admin");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
            <h2 className="text-2xl font-bold mb-6">Create New Admin</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange}
                    className="w-full p-2 border rounded" required />
                <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange}
                    className="w-full p-2 border rounded" required />
                <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange}
                    className="w-full p-2 border rounded" required />
                <input type="password" name="password_confirmation" placeholder="Confirm Password" value={form.password_confirmation} onChange={handleChange}
                    className="w-full p-2 border rounded" required />
                <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                    {loading ? "Creating..." : "Create Admin"}
                </button>
            </form>
        </div>
    );
}
