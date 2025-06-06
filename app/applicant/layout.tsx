"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
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
import {
    LayoutDashboard,
    FileText,
    User,
    MessageSquare,
    FileCheck,
    GraduationCap,
    Users,
    Bell,
    Settings,
    LogOut,
    Menu,
    X,
    Crown,
    Loader,
} from "lucide-react"
import { useAuth } from "@/context/authContext"
import LoadingComponent from "@/components/loading"
import Unauthorized from "@/components/unauthorized"
import { useToast } from "@/context/toastContext"

const navigationItems = [
    {
        name: "Dashboard",
        href: "/applicant",
        icon: LayoutDashboard,
        premium: false,
    },
    {
        name: "My Applications",
        href: "/applicant/applications",
        icon: FileText,
        premium: false,
    },
    {
        name: "Profile Management",
        href: "/applicant/profile",
        icon: User,
        premium: false,
    },
    {
        name: "Messaging",
        href: "/applicant/messaging",
        icon: MessageSquare,
        premium: true,
    },
    {
        name: "CV Builder & Analysis",
        href: "/applicant/cv-builder",
        icon: FileCheck,
        premium: true,
    },
    {
        name: "Training Development",
        href: "/applicant/training",
        icon: GraduationCap,
        premium: true,
    },
    {
        name: "Coaching",
        href: "/applicant/coaching",
        icon: Users,
        premium: true,
    },
]

export default function ApplicantLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [showPremiumModal, setShowPremiumModal] = useState(false)
    const { authLoading, userData, signout } = useAuth();
    const { showToast } = useToast();

    if (authLoading) {
        return <LoadingComponent />
    }

    // Check if the logged-in user is an applicant
    if (!userData || !userData.applicant) {
        return <Unauthorized />;
    }

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 flex-shrink-0">
                        <Link href="/" className="flex items-center gap-3">
                            <Image
                                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-9xNdd6tEqppxZ2JNyyzzlibUNBOJ99.png"
                                alt="ABH Connect Logo"
                                width={32}
                                height={32}
                            />
                            <span className="text-lg font-bold text-[#0a3141]">ABH Connect</span>
                        </Link>
                        <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 rounded-md hover:bg-gray-100">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                        {navigationItems.map((item) => {
                            const Icon = item.icon
                            const isActive = pathname === item.href

                            const handleClick = (e: React.MouseEvent) => {
                                if (item.premium) {
                                    e.preventDefault()
                                    setShowPremiumModal(true)
                                    return
                                }
                                setSidebarOpen(false)
                            }

                            return (
                                <div key={item.name} className="relative">
                                    {item.premium ? (
                                        <button
                                            onClick={handleClick}
                                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                                ? "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border border-amber-200"
                                                : "text-gray-400 hover:bg-gray-50 hover:text-gray-500 cursor-not-allowed"
                                                }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                            <span className="flex-1 text-left">{item.name}</span>
                                            <Crown className="w-4 h-4 text-amber-500" />
                                        </button>
                                    ) : (
                                        <Link
                                            href={item.href}
                                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-[#0a3141] text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                                }`}
                                            onClick={() => setSidebarOpen(false)}
                                        >
                                            <Icon className="w-5 h-5" />
                                            {item.name}
                                        </Link>
                                    )}
                                </div>
                            )
                        })}
                    </nav>

                    {/* User Profile Section */}
                    <div className="p-4 border-t border-gray-200 flex-shrink-0">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                            <Avatar className="w-10 h-10">
                                <AvatarImage src={`${userData?.applicant?.photo}`} />
                                <AvatarFallback>
                                    {userData?.applicant?.firstName
                                        ? userData.applicant.firstName.charAt(0).toUpperCase()
                                        : ""}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium leading-none">{userData?.applicant?.firstName} {userData?.applicant?.surname}</p>
                                <p className="text-xs leading-none text-muted-foreground mt-1">{userData?.applicant?.email}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content area */}

            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Top header */}
                    <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
                        <div className="flex items-center justify-between h-16 px-6">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-md hover:bg-gray-100">
                                    <Menu className="w-5 h-5" />
                                </button>
                                <h1 className="text-xl font-semibold text-gray-900">
                                    {navigationItems.find((item) => item.href === pathname)?.name || "Dashboard"}
                                </h1>
                            </div>

                            <div className="flex items-center gap-4">
                                {/* Notifications */}
                                <Button variant="ghost" size="sm" className="relative">
                                    <Bell className="w-5 h-5" />
                                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
                                </Button>

                                {/* User menu */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={`${userData?.applicant?.photo}`} />
                                                <AvatarFallback>
                                                    {userData?.applicant?.firstName
                                                        ? userData.applicant.firstName.charAt(0).toUpperCase()
                                                        : ""}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-60 py-5 px-2" align="end" forceMount>
                                        <DropdownMenuLabel className="font-normal">
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium leading-none">{userData?.applicant?.firstName} {userData?.applicant?.surname}</p>
                                                <p className="text-xs leading-none text-muted-foreground mt-1">{userData?.applicant?.email}</p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Profile</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Settings className="mr-2 h-4 w-4" />
                                            <span>Settings</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={async () => {
                                            showToast("Logging out...", "👋🏽");
                                            await signout();
                                        }}>
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Log out</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </header>

                    {/* Page content */}
                    <main className="flex-1 overflow-y-auto p-6">{children}</main>
                </div>
            </div>

            {/* Premium Modal */}
            {
                showPremiumModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
                            <button
                                onClick={() => setShowPremiumModal(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Crown className="w-8 h-8 text-white" />
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Feature</h3>
                                <p className="text-gray-600 mb-6">
                                    This feature is available with our Premium plan. Upgrade now to unlock advanced tools and accelerate
                                    your job search.
                                </p>

                                <div className="space-y-3">
                                    <Button className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white">
                                        Upgrade to Premium
                                    </Button>
                                    <Button variant="outline" className="w-full" onClick={() => setShowPremiumModal(false)}>
                                        Maybe Later
                                    </Button>
                                </div>

                                <div className="mt-4 text-xs text-gray-500">
                                    <p>✨ AI-powered CV analysis</p>
                                    <p>💬 Direct messaging with recruiters</p>
                                    <p>🎓 Personalized training programs</p>
                                    <p>👥 1-on-1 career coaching sessions</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    )
}
