"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Briefcase, Eye, EyeOff, Mail, Lock } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { myAppHook } from "@/context/AppProvider"
import { API_URL } from "@/lib/config"


export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const { login } = myAppHook();
    const [showForgotModal, setShowForgotModal] = useState(false);




    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false,
    })


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            await login({ email: formData.email, password: formData.password })
        }
        catch (error) {
            console.log("authentication error", error)
        }
        finally {
            setIsLoading(false)
        }
        console.log("Login attempt:", formData)

    }

    return (

        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2">
                        <Briefcase className="h-8 w-8 text-blue-600" />
                        <span className="text-2xl font-bold text-gray-900">JobPortal</span>
                    </Link>
                </div>

                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Welcome back</CardTitle>
                        <p className="text-gray-600">Sign in to your account to continue</p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="pl-10 pr-10"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Remember me & Forgot password */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="remember"
                                        checked={formData.rememberMe}
                                        onCheckedChange={(checked) => setFormData({ ...formData, rememberMe: checked as boolean })}
                                    />
                                    <Label htmlFor="remember" className="text-sm">
                                        Remember me
                                    </Label>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowForgotModal(true)}
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    Forgot password?
                                </button>
                            </div>

                            {/* Submit button */}
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Signing in..." : "Sign in"}
                            </Button>
                        </form>

                        {/* Divider */}
                        <div className="my-6">
                            <Separator />
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                                </div>
                            </div>
                        </div>

                        {/* Sign up link */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Don&apos;t have an account?{" "}
                                <Link href="/auth/register" className="text-blue-600 hover:underline font-medium">
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
                {showForgotModal && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold">Reset Password</h2>
                                <button onClick={() => setShowForgotModal(false)} className="text-gray-500 hover:text-gray-700">
                                    ✕
                                </button>
                            </div>
                            <form
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    const email = (e.currentTarget.email as HTMLInputElement).value;
                                    try {
                                        await fetch(`${API_URL}/forgot-password`, {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ email }),
                                        });
                                        alert("Password reset link sent to your email.");
                                        setShowForgotModal(false);
                                    } catch (err) {
                                        alert("Error sending reset link." + err);
                                    }
                                }}
                                className="space-y-4"
                            >
                                <div>
                                    <Label htmlFor="forgot-email">Email</Label>
                                    <Input
                                        id="forgot-email"
                                        name="email"
                                        type="email"
                                        required
                                        placeholder="Enter your email"
                                        className="mt-1"
                                    />
                                </div>
                                <Button type="submit" className="w-full">
                                    Send Reset Link
                                </Button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>
                        By signing in, you agree to our{" "}
                        <Link href="/terms" className="hover:underline">
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="hover:underline">
                            Privacy Policy
                        </Link>
                    </p>
                </div>
            </div>
        </div>

    )

}
