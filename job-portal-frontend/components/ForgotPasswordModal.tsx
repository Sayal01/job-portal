// components/ForgotPasswordModal.tsx
"use client";

import { useState } from "react";
import Modal from "./modal";
import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "@/lib/config";

export default function ForgotPasswordModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await axios.post(`${API_URL}/forgot-password`, { email });
            toast.success("Reset link sent to your email.");
            setIsOpen(false);
            setEmail("");
        } catch (err) {
            toast.error("Failed to send reset link." + err);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="text-sm text-blue-600 underline"
            >
                Forgot Password?
            </button>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h2 className="text-lg font-semibold">Forgot Password</h2>
                    <input
                        type="email"
                        required
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                        Send Reset Link
                    </button>
                </form>
            </Modal>
        </>
    );
}
