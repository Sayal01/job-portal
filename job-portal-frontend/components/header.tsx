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
import NotificationsDropdown from "./notification";
import { fetchNotifications } from "@/lib/notification";


interface LocalUser {
    first_name: string;
    last_name: string;
    email: string;
    image?: string | null;
    role: string;
}

export function Header() {
    const { logout, authToken, notifications, setNotifications } = myAppHook();
    // const [notifications, setNotifications] = useState<any[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [localUser, setLocalUser] = useState<LocalUser | null>(null);
    const router = useRouter();

    useEffect(() => {
        async function fetchUser() {
            if (!authToken) return;
            const loadNotifications = async () => {
                const data = await fetchNotifications();
                setNotifications(data);
            };
            loadNotifications();
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
    const unreadCount = notifications.filter(n => !n.read).length;
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
                        {/* Notifications Dropdown */}
                        {authToken && (
                            <div className="relative">
                                {/* Notification Icon */}
                                <button onClick={() => setShowDropdown(prev => !prev)} className="relative">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    {unreadCount > 0 && (
                                        <span className="absolute top-0 right-0 bg-red-500 text-xs w-4 h-4 rounded-full flex items-center justify-center">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>

                                {/* Dropdown */}
                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white text-black shadow-lg rounded z-50">
                                        <NotificationsDropdown
                                            notifications={notifications}
                                            setNotifications={setNotifications}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
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
                                        {/* <DropdownMenuItem>
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Profile</span>
                                        </DropdownMenuItem> */}
                                        {/* <DropdownMenuItem onClick={() => router.push(`/account`)}>
                                            <Settings className="mr-2 h-4 w-4" />
                                            <span>Settings</span>
                                        </DropdownMenuItem> */}
                                        {/* <DropdownMenuSeparator /> */}
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
