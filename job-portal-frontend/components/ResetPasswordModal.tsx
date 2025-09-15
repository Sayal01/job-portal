// components/ResetPasswordModal.tsx
"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Modal from "./modal";
import { API_URL } from "@/lib/config";

export default function ResetPasswordModal() {
    const [isOpen, setIsOpen] = useState(true);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    useEffect(() => {
        if (!token || !email) {
            toast.error("Invalid reset link");
            setIsOpen(false);
        }
    }, [token, email]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            await axios.post(`${API_URL}/reset-password`, {
                email,
                token,
                password,
                password_confirmation: confirmPassword,
            });
            toast.success("Password reset successfully!");
            setIsOpen(false);
            setTimeout(() => router.push("/auth/login"), 2000); // redirect after 2s
        } catch (err) {
            toast.error("Failed to reset password" + err);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-lg font-semibold">Reset Password</h2>

                <input
                    type="password"
                    required
                    placeholder="New password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                />
                <input
                    type="password"
                    required
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                />
                <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                    Reset Password
                </button>
            </form>
        </Modal>
    );
}
