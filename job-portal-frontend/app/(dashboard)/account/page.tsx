"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { myAppHook } from "@/context/AppProvider";
import axios from "axios";
import { API_URL, API_IMG } from "@/lib/config";
import { User, Lock, Eye, EyeOff } from "lucide-react";

interface UserData {
    first_name: string;
    last_name: string;
    email: string;
    image?: string | null;
}

export default function AccountPage() {
    const { authToken } = myAppHook();
    const [formData, setFormData] = useState<UserData>({
        first_name: "",
        last_name: "",
        email: "",
        image: null,
    });

    const [isEditing, setIsEditing] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);

    // Password fields for changing password - start empty, no autofill
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
    const [showNewPasswordConfirm, setShowNewPasswordConfirm] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        async function fetchUser() {
            if (!authToken) return;

            try {
                const res = await axios.get(`${API_URL}/me`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });

                const user = res.data.user;
                setFormData({
                    first_name: user.first_name || "",
                    last_name: user.last_name || "",
                    email: user.email || "",
                    image: user.image || null,
                });
            } catch (error) {
                console.error("Failed to fetch user:", error);
            }
        }

        fetchUser();
    }, [authToken]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setImageFile(e.target.files[0]);
            setPreviewImage(URL.createObjectURL(e.target.files[0]));
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const form = new FormData();
            form.append("first_name", formData.first_name);
            form.append("last_name", formData.last_name);
            form.append("email", formData.email);
            if (imageFile) form.append("image", imageFile);

            if (currentPassword && newPassword) {
                if (newPassword !== newPasswordConfirm) {
                    alert("New password and confirmation do not match.");
                    return;
                }
                form.append("current_password", currentPassword);
                form.append("password", newPassword);
                form.append("password_confirmation", newPasswordConfirm);
            }

            // Capture response
            const response = await axios.post(`${API_URL}/update-account`, form, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            alert("Account updated successfully");

            // Update image in state
            setFormData(prev => ({
                ...prev,
                image: response.data.user.image || null,
            }));

            setIsEditing(false);
            setCurrentPassword("");
            setNewPassword("");
            setNewPasswordConfirm("");
            setImageFile(null); // Reset file input if you have any preview logic
        } catch (error) {
            console.error("Failed to update account:", error);
            alert("Update failed, please try again.");
        }
    };


    return (
        <div className="max-w-3xl mx-auto p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Account Details</CardTitle>
                </CardHeader>
                <CardContent>
                    {!isEditing ? (
                        <>
                            <div className="flex items-center space-x-4 mb-6">
                                {formData.image ? (
                                    <img
                                        src={`${API_IMG}/${formData.image}`}
                                        alt="Profile"
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                ) : (
                                    <User className="w-24 h-24 text-gray-400" />
                                )}
                                <div>
                                    <p>
                                        <strong>First Name:</strong> {formData.first_name}
                                    </p>
                                    <p>
                                        <strong>Last Name:</strong> {formData.last_name}
                                    </p>
                                    <p>
                                        <strong>Email:</strong> {formData.email}
                                    </p>
                                </div>
                            </div>

                            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                        </>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
                            <div>
                                <Label htmlFor="first_name">First Name</Label>
                                <Input
                                    id="first_name"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="last_name">Last Name</Label>
                                <Input
                                    id="last_name"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div>
                                <Label>Current Image</Label>
                                {previewImage ? (
                                    <img
                                        src={previewImage}
                                        alt="New Preview"
                                        className="w-24 h-24 rounded-full object-cover mb-2"
                                    />
                                ) : formData.image ? (
                                    <img
                                        src={`${API_IMG}/${formData.image}`}
                                        alt="Profile"
                                        className="w-24 h-24 rounded-full object-cover mb-2"
                                    />
                                ) : (
                                    <User className="w-24 h-24 text-gray-400 mb-2" />
                                )}

                                <label htmlFor="image" className="block mb-1">
                                    Upload New Image
                                </label>
                                <input
                                    id="image"
                                    name="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="border p-2 rounded w-full"
                                />
                            </div>



                            <Separator />

                            <div>
                                <Label htmlFor="currentPassword">Current Password</Label>
                                <div className="relative">
                                    <Input
                                        id="currentPassword"
                                        name="currentPassword"
                                        type={showCurrentPassword ? "text" : "password"}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="Enter current password to change"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    >
                                        {showCurrentPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="newPassword">New Password</Label>
                                <div className="relative">
                                    <Input
                                        id="newPassword"
                                        name="newPassword"
                                        type={showNewPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Enter new password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                    >
                                        {showNewPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="newPasswordConfirm">Confirm New Password</Label>
                                <div className="relative">
                                    <Input
                                        id="newPasswordConfirm"
                                        name="newPasswordConfirm"
                                        type={showNewPasswordConfirm ? "text" : "password"}
                                        value={newPasswordConfirm}
                                        onChange={(e) => setNewPasswordConfirm(e.target.value)}
                                        placeholder="Confirm new password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
                                        onClick={() => setShowNewPasswordConfirm(!showNewPasswordConfirm)}
                                    >
                                        {showNewPasswordConfirm ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="flex space-x-4">
                                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">Save Changes</Button>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
