"use client";

import { Button } from "@/components/ui/button";
import { Briefcase, User, Plus, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { myAppHook } from "@/context/AppProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import { API_URL, API_IMG } from "@/lib/config";

interface LocalUser {
    first_name: string;
    last_name: string;
    email: string;
    image?: string | null;
    role: string;
}

export function Header() {
    const { logout, authToken } = myAppHook();
    const [localUser, setLocalUser] = useState<LocalUser | null>(null);
    const router = useRouter();

    useEffect(() => {
        async function fetchUser() {
            if (!authToken) return;

            try {
                const res = await axios.get(`${API_URL}/me`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });

                const user = res.data.user;
                setLocalUser({
                    first_name: user.first_name || "",
                    last_name: user.last_name || "",
                    email: user.email || "",
                    role: user.role || "",
                    image: user.image || null,
                });
            } catch (error) {
                console.error("Failed to fetch user:", error);
            }
        }

        fetchUser();
    }, [authToken]);

    return (
        <header className="bg-blue-400 shadow-sm border-b">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <Briefcase className="h-8 w-8 text-blue-600" />
                        <span className="text-xl font-bold text-gray-900">JobFinder</span>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-6">

                        <Link href="/" className="text-gray-600 hover:text-gray-900">
                            Find Jobs
                        </Link>
                        <Link href="/companies" className="text-gray-600 hover:text-gray-900">
                            Companies
                        </Link>
                        <Link href="/about" className="text-gray-600 hover:text-gray-900">
                            About
                        </Link>

                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        {!authToken ? (
                            <Button asChild variant="ghost" size="sm">
                                <a href="/auth/login">
                                    <User className="h-4 w-4 mr-2" />
                                    Sign In
                                </a>
                            </Button>
                        ) : (
                            <>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-blue-300" >
                                            <Avatar className="h-12 w-12">
                                                <AvatarImage
                                                    src={localUser?.image ? `${API_IMG}/${localUser.image}` : "/placeholder.svg"}
                                                    alt={localUser?.first_name}
                                                />
                                                <AvatarFallback>
                                                    {localUser?.first_name?.[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56" align="end" forceMount>
                                        <DropdownMenuLabel className="font-normal">
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium leading-none">
                                                    {localUser?.first_name}
                                                </p>
                                                <p className="text-xs leading-none text-muted-foreground">
                                                    {localUser?.email}
                                                </p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Profile</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => router.push(`/account`)}>
                                            <Settings className="mr-2 h-4 w-4" />
                                            <span>Settings</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => router.push(`/${localUser?.role}/dashboard`)}>
                                            <Settings className="mr-2 h-4 w-4" />
                                            <span>Dashboard</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={logout}>
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Log out</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                {/* ✅ Post Job only for employer after auth */}
                                {localUser?.role === "employer" && (
                                    <Button size="sm" onClick={() => router.push("/employer/jobs/create")}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Post Job
                                    </Button>
                                )}
                            </>
                        )}

                    </div>
                </div>
            </div>
        </header>
    );
}
