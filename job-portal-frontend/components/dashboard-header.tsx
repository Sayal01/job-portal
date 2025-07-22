"use client"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { Briefcase, Bell, Settings, LogOut, User } from "lucide-react"
import Link from "next/link"
// import { useAuth } from "@/components/auth/auth-provider"
import { myAppHook } from "@/context/AppProvider"
import axios from "axios";
import { API_URL, API_IMG } from "@/lib/config";

interface DashboardHeaderProps {
    userType: "admin" | "job_seeker" | "employer"
}
interface LocalUser {
    first_name: string;
    last_name: string;
    email: string;
    image?: string | null;
    role: string;
}


export function DashboardHeader({ userType }: DashboardHeaderProps) {
    const { logout, authToken, user, } = myAppHook();
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
    const getTitle = () => {
        switch (userType) {
            case "admin":
                return "JobPortal Admin"
            case "employer":
                return "JobPortal Employer"
            default:
                return "JobPortal"
        }
    }

    return (
        <header className="bg-white shadow-sm border-b">
            <div className="px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <Briefcase className="h-8 w-8 text-blue-600" />
                        <span className="text-xl font-bold text-gray-900">{getTitle()}</span>
                    </Link>

                    {/* Right side */}
                    <div className="flex items-center gap-4">
                        {/* Notifications */}
                        <Button variant="ghost" size="sm">
                            <Bell className="h-5 w-5" />
                        </Button>

                        {/* User Menu */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={localUser?.image ? `${API_IMG}/${localUser.image}` : "/placeholder.svg"} alt={user?.first_name} />
                                        <AvatarFallback>
                                            {user?.first_name?.[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {user?.first_name}
                                        </p>
                                        <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
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
                                <DropdownMenuItem onClick={logout}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </header>
    )
}
