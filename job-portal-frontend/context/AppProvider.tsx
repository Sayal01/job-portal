"use client"
import Loader from "@/components/Loader";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { fetchNotifications } from "@/lib/notification";



interface registerData {
    role: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    password_confirmation: string;
    company_name?: string;
}
interface loginData {
    email: string;
    password: string;
}
interface AppProviderType {
    authToken: string | null,
    isLoading: boolean,
    login: (data: loginData) => Promise<void>,
    register: (data: registerData) => Promise<void>,
    user: User | null,
    logout: () => void,
    notifications: any[];
    setNotifications: React.Dispatch<React.SetStateAction<any[]>>;
}

interface User {
    first_name: string;
    last_name: string;
    email: string;
    role: string;
}
const AppContext = createContext<AppProviderType | undefined>(undefined);
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`

export const AppProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [authToken, setAuthToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [notifications, setNotifications] = useState<any[]>([]);

    const router = useRouter();

    useEffect(() => {

        const token = Cookies.get("AuthToken");
        const userData = Cookies.get("user")
        if (token) {
            setAuthToken(token);
            if (userData) {
                setUser(JSON.parse(userData))
            }
        }
        else {
            if (
                window.location.pathname.startsWith("/job_seeker") ||
                window.location.pathname.startsWith("/employer") ||
                window.location.pathname.startsWith("/admin")
            ) {
                router.push("/auth/login");
            }

        }
        setIsLoading(false);
    }, []);


    const login = async (data: loginData) => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_URL}/login`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (response.data.status === true) {
                Cookies.set("AuthToken", response.data.token, { expires: 7 })
                Cookies.set("user", JSON.stringify(response.data.user), { expires: 7 })
                Cookies.set("Role", response.data.user.role, { expires: 7 });
                toast.success("login Sucessfull");
                setAuthToken(response.data.token);
                setUser(response.data.user);

                const notifData = await fetchNotifications();
                setNotifications(notifData);
                const role = response.data.user.role;
                if (role === "job_seeker") {
                    router.push("/");
                } else if (role === "company") {
                    router.push("/company/dashboard");
                } else if (role === "admin") {
                    router.push("/admin/dashboard");
                } else {
                    router.push("/");  // fallback
                }
                console.log("Login response:", response.data);
                console.log("Status type:", typeof response.data.status, "Value:", response.data.status);
            }
            else {
                console.log("Login response:", response.data);
                console.log("Status type:", typeof response.data.status, "Value:", response.data.status);
                toast.error(response.data.message || "Invalid login details");
            }

            console.log("Login ", response.data);
        }
        catch (error: any) {
            if (error.response) {
                // Backend returned an error response
                toast.error(error.response.data.message || "Invalid credentials");
            } else {
                // Network or other error
                toast.error("Something went wrong. Please try again.");
            }
            console.log("Login error:", error);
        }
        finally {

            setIsLoading(false);
        }
    }
    const register = async (data: registerData) => {

        setIsLoading(true);
        try {
            const response = await axios.post(`${API_URL}/register`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            console.log("register", response.data);
            if (response.data.status) {

                toast.success("register Sucessfull")

                router.push("/auth/login");
            }
            else {
                toast.success("invalid login details")
            }
        }
        catch (error) {
            console.log(`authentication error: ${error}`);
        }
        finally {
            setIsLoading(false);
        }
    }
    const logout = () => {
        setAuthToken(null);
        setUser(null);
        Cookies.remove("AuthToken");
        Cookies.remove("user")
        Cookies.remove("Role")
        setNotifications([]);
        setIsLoading(false);
        toast.success("Logout Successful");
        router.push("/");
    }
    return (
        <AppContext.Provider value={{ login, register, isLoading, authToken, user, logout, notifications, setNotifications }}>
            {isLoading ? <Loader /> : children}
        </AppContext.Provider>

    )
}
export const myAppHook = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("Context will be wrapped inside AppProvider ")
    }
    return context;
}