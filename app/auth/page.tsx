"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/authContext";
import { useToast } from "@/context/toastContext";
import { LoggedInUser, useLogin } from "@/hooks/auth/useLogin";
import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function AuthPage() {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userType, setUserType] = useState("applicant");
    const { error, login } = useLogin();
    const { showToast } = useToast();
    const { userData, authLoading } = useAuth();

    useEffect(() => {
        if (userData && !authLoading) {
            const { applicant, company } = userData;
            let name = "";
            if (company) name = company.fullName;
            if (applicant) name = `${applicant.firstName} ${applicant.surname}`;

            showToast(`${name}!`, "Welcome Back, ", "success");
        }
    }, [userData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const loggedInUser: LoggedInUser = await login({ email, password });
            console.log("loggedInUser: ", loggedInUser);

            if (loggedInUser) {
                const { applicant, company } = loggedInUser;
                let name = "";
                if (company) name = company.fullName;
                if (applicant) name = applicant.firstName;

                showToast(`Welcome back, ${name}!`, "Logged In!", "success");
                // router.push("/dashboard"); // Redirect to dashboard or another page
            } else if (error) {
                showToast(error, "Error", "error");
            }
        } catch (err) {
            console.error("Login error:", err);
            showToast("An error occurred. Please try again.", "Error", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (userType) {
            router.push(`/auth/register?type=${userType}`);
        } else {
            showToast("Please select a user type to register.", "Warning");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#f5f7fa] to-white flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <Link href="/" className="inline-block">
                        <div className="flex items-center justify-center gap-3">
                            <Image
                                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-9xNdd6tEqppxZ2JNyyzzlibUNBOJ99.png"
                                alt="ABH Connect Logo"
                                width={50}
                                height={50}
                            />
                            <span className="text-2xl font-bold text-[#0a3141]">ABH Connect</span>
                        </div>
                    </Link>
                </div>
                {
                    authLoading ?
                        <>
                            <div className="max-w max-h flex flex-col items-center">
                                <Loader className="animate-spin w-12 h-12 text-[#0a3141]" />
                            </div>
                        </>
                        :
                        <div className="bg-white rounded-xl shadow-lg p-8">
                            <div className="text-center mb-6">
                                <h1 className="text-2xl font-bold text-[#0a3141]">Welcome</h1>
                                <p className="text-gray-500 mt-2">Welcome back, please login to your account.</p>
                            </div>

                            <Tabs defaultValue="signin" className="w-full">
                                <TabsList className="grid w-full grid-cols-2 mb-6">
                                    <TabsTrigger value="signin" className="data-[state=active]:bg-[#d2f277] data-[state=active]:text-black">
                                        Sign In
                                    </TabsTrigger>
                                    <TabsTrigger value="register" className="data-[state=active]:bg-[#d2f277] data-[state=active]:text-black">
                                        Registration
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="signin">
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                                Email/Phone *
                                            </label>
                                            <Input
                                                id="email"
                                                type="text"
                                                placeholder="Enter your email or phone"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                className="h-12"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                                Password *
                                            </label>
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="••••••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                className="h-12"
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            className="w-full h-12 bg-[#0a3141] hover:bg-[#0a3141]/90 text-white"
                                            disabled={loading}
                                        >
                                            {loading ? "Logging in..." : "Login"}
                                        </Button>
                                    </form>
                                </TabsContent>
                                <TabsContent value="register">
                                    <form onSubmit={handleRegisterSubmit} className="space-y-4">
                                        <div>
                                            <label htmlFor="user-type" className="block text-sm font-medium text-gray-700 mb-1">
                                                Register as *
                                            </label>
                                            <Select value={userType} onValueChange={setUserType} required>
                                                <SelectTrigger id="user-type" className="h-12">
                                                    <SelectValue placeholder="Select account type" />
                                                </SelectTrigger>
                                                <SelectContent className="z-50">
                                                    <SelectItem value="applicant">Applicant</SelectItem>
                                                    <SelectItem value="company">Company</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <Button type="submit" className="w-full h-12 bg-[#0a3141] hover:bg-[#0a3141]/90 text-white">
                                            Continue
                                        </Button>
                                    </form>
                                </TabsContent>
                            </Tabs>
                        </div>
                }
            </div>
        </div>
    );
}
