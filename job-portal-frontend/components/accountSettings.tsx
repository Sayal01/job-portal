"use client";

import { useState } from "react";
import axios from "axios";

interface User {
    first_name?: string;
    last_name?: string;
    email: string;
    image?: string | null;
}

interface AccountSettingsProps {
    user: User;
}

export default function AccountSettings({ user }: AccountSettingsProps) {
    const [formData, setFormData] = useState({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email,
        password: "",
        password_confirmation: "",
        image: null as File | null,
    });

    const [preview, setPreview] = useState(user.image || null);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;
        if (name === "image" && files && files[0]) {
            setFormData((prev) => ({ ...prev, image: files[0] }));
            setPreview(URL.createObjectURL(files[0]));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage("");

        try {
            const form = new FormData();
            form.append("first_name", formData.first_name);
            form.append("last_name", formData.last_name);
            form.append("email", formData.email);
            if (formData.password) {
                form.append("password", formData.password);
                form.append("password_confirmation", formData.password_confirmation);
            }
            if (formData.image) {
                form.append("image", formData.image);
            }

            const res = await axios.post("/api/account/update", form, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setMessage(res.data.message || "Account updated successfully!");
        } catch (err: any) {
            setMessage(err.response?.data?.message || "Something went wrong!");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <section className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Account Settings</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* First Name */}
                <div>
                    <label className="block mb-1 text-gray-700 font-medium">First Name</label>
                    <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Last Name */}
                <div>
                    <label className="block mb-1 text-gray-700 font-medium">Last Name</label>
                    <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="block mb-1 text-gray-700 font-medium">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Password */}
                <div>
                    <label className="block mb-1 text-gray-700 font-medium">New Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Password Confirmation */}
                <div>
                    <label className="block mb-1 text-gray-700 font-medium">Confirm Password</label>
                    <input
                        type="password"
                        name="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Profile Image */}
                <div>
                    <label className="block mb-1 text-gray-700 font-medium">Profile Image</label>
                    {preview && (
                        <img
                            src={preview}
                            alt="Profile Preview"
                            className="w-20 h-20 object-cover rounded-full mb-2"
                        />
                    )}
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleChange}
                        className="block"
                    />
                </div>

                {/* Submit */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className={`px-6 py-2 rounded-md text-white font-medium ${isSaving ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                            }`}
                    >
                        {isSaving ? "Updating..." : "Save Changes"}
                    </button>
                </div>

                {/* Message */}
                {message && (
                    <p className="mt-4 text-sm text-green-600">{message}</p>
                )}
            </form>
        </section>
    );
}
