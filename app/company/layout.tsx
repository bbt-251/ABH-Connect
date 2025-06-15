"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  LayoutDashboard,
  FileText,
  ClipboardCheck,
  Users,
  MessageSquare,
  GraduationCap,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Crown,
  Building,
  FileCheck,
  FileCheckIcon as FileCheckCheck,
  UserPlus,
  Mail,
  Plus,
  Trash2,
} from "lucide-react"

const navigationItems = [
  {
    name: "Dashboard",
    href: "/company",
    icon: LayoutDashboard,
    premium: false,
  },
  {
    name: "Job Posting",
    href: "/company/jobs",
    icon: FileText,
    premium: false,
  },
  {
    name: "Applicant Evaluation",
    href: "/company/prescreening",
    icon: ClipboardCheck,
    premium: false,
  },
  {
    name: "Exam Management",
    href: "/company/exams",
    icon: ClipboardCheck,
    premium: false,
  },
  {
    name: "Evaluation Metrics",
    href: "/company/evaluation",
    icon: BarChart3,
    premium: false,
  },
  {
    name: "Interview Management",
    href: "/company/interviews",
    icon: Users,
    premium: false,
  },
  {
    name: "Evaluation Form",
    href: "/company/evaluation-form",
    icon: FileCheck,
    premium: false,
  },
  {
    name: "Filled Evaluation Form",
    href: "/company/filled-evaluation-form",
    icon: FileCheckCheck,
    premium: false,
  },
  {
    name: "Custom Criteria Form",
    href: "/company/custom-criteria",
    icon: FileText,
    premium: false,
  },
  {
    name: "Invite Evaluators",
    href: "#",
    icon: UserPlus,
    premium: false,
    isModal: true,
  },
  {
    name: "Candidate Pool",
    href: "/company/candidates",
    icon: Users,
    premium: false,
  },
  {
    name: "Messaging",
    href: "/company/messaging",
    icon: MessageSquare,
    premium: true,
  },
  {
    name: "Coaching",
    href: "/company/coaching",
    icon: GraduationCap,
    premium: true,
  },
  {
    name: "Analytics",
    href: "/company/analytics",
    icon: BarChart3,
    premium: true,
  },
]

interface Evaluator {
  id: string
  email: string
  name: string
  status: "draft" | "evaluated"
  invitedDate: string
  role: string
}

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showPremiumModal, setShowPremiumModal] = useState(false)
  const [isNavCollapsed, setIsNavCollapsed] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [newEvaluatorEmail, setNewEvaluatorEmail] = useState("")
  const [invitedEvaluators, setInvitedEvaluators] = useState<Evaluator[]>([
    {
      id: "1",
      email: "john.smith@techcorp.com",
      name: "John Smith",
      status: "evaluated",
      invitedDate: "2024-01-15",
      role: "Senior Technical Lead",
    },
    {
      id: "2",
      email: "sarah.wilson@techcorp.com",
      name: "Sarah Wilson",
      status: "draft",
      invitedDate: "2024-01-18",
      role: "HR Manager",
    },
    {
      id: "3",
      email: "mike.johnson@techcorp.com",
      name: "Mike Johnson",
      status: "evaluated",
      invitedDate: "2024-01-10",
      role: "Product Manager",
    },
    {
      id: "4",
      email: "lisa.brown@techcorp.com",
      name: "Lisa Brown",
      status: "draft",
      invitedDate: "2024-01-12",
      role: "Team Lead",
    },
  ])

  const handleInviteEvaluator = () => {
    if (newEvaluatorEmail && newEvaluatorEmail.includes("@")) {
      const newEvaluator: Evaluator = {
        id: Date.now().toString(),
        email: newEvaluatorEmail,
        name: newEvaluatorEmail
          .split("@")[0]
          .replace(".", " ")
          .replace(/\b\w/g, (l) => l.toUpperCase()),
        status: "draft",
        invitedDate: new Date().toISOString().split("T")[0],
        role: "Evaluator",
      }
      setInvitedEvaluators([...invitedEvaluators, newEvaluator])
      setNewEvaluatorEmail("")
    }
  }

  const handleRemoveEvaluator = (id: string) => {
    setInvitedEvaluators(invitedEvaluators.filter((evaluator) => evaluator.id !== id))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "evaluated":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 ${isNavCollapsed ? "w-16" : "w-64"} bg-white shadow-lg transform transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
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
              <span
                className={`text-lg font-bold text-[#0a3141] transition-all duration-200 ${isNavCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}
              >
                ABH Connect
              </span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 rounded-md hover:bg-gray-100">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3
                className={`text-sm font-medium text-gray-500 uppercase tracking-wide ${isNavCollapsed ? "hidden" : "block"}`}
              >
                Navigation
              </h3>
              <button
                onClick={() => setIsNavCollapsed(!isNavCollapsed)}
                className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                title={isNavCollapsed ? "Expand navigation" : "Collapse navigation"}
              >
                {isNavCollapsed ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                )}
              </button>
            </div>

            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              const handleClick = (e: React.MouseEvent) => {
                if (item.premium) {
                  e.preventDefault()
                  setShowPremiumModal(true)
                  return
                }
                if (item.isModal) {
                  e.preventDefault()
                  setShowInviteModal(true)
                  setSidebarOpen(false)
                  return
                }
                setSidebarOpen(false)
              }

              return (
                <div key={item.name} className="relative">
                  {item.premium ? (
                    <button
                      onClick={handleClick}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border border-amber-200"
                          : "text-gray-400 hover:bg-gray-50 hover:text-gray-500 cursor-not-allowed"
                      }`}
                      title={isNavCollapsed ? item.name : ""}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span
                        className={`flex-1 text-left transition-all duration-200 ${isNavCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}
                      >
                        {item.name}
                      </span>
                      <Crown
                        className={`w-4 h-4 text-amber-500 transition-all duration-200 ${isNavCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}
                      />
                    </button>
                  ) : item.isModal ? (
                    <button
                      onClick={handleClick}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-600 hover:bg-gray-100 hover:text-gray-900`}
                      title={isNavCollapsed ? item.name : ""}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span
                        className={`transition-all duration-200 ${isNavCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}
                      >
                        {item.name}
                      </span>
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive ? "bg-[#0a3141] text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                      onClick={() => setSidebarOpen(false)}
                      title={isNavCollapsed ? item.name : ""}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span
                        className={`transition-all duration-200 ${isNavCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}
                      >
                        {item.name}
                      </span>
                    </Link>
                  )}
                </div>
              )
            })}
          </nav>

          {/* Company Profile Section */}
          <div className="p-4 border-t border-gray-200 flex-shrink-0">
            <Link
              href="/company/profile"
              className={`flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors ${isNavCollapsed ? "justify-center" : ""}`}
              title="View and edit company profile"
            >
              <Avatar className="w-10 h-10 flex-shrink-0">
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback>
                  <Building className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
              <div
                className={`flex-1 min-w-0 transition-all duration-200 ${isNavCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}
              >
                <p className="text-sm font-medium text-gray-900 truncate">TechCorp Inc.</p>
                <p className="text-xs text-gray-500 truncate">Premium Plan</p>
              </div>
              {!isNavCollapsed && <Settings className="w-4 h-4 text-gray-400 hover:text-gray-600" />}
            </Link>
          </div>
        </div>
      </div>

      {/* Main content area */}
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
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback>HR</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">HR Manager</p>
                      <p className="text-xs leading-none text-muted-foreground">hr@techcorp.com</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Building className="mr-2 h-4 w-4" />
                    <span>Company Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
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

      {/* Invite Evaluators Modal */}
      <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Invite Evaluators
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Invite New Evaluator Section */}
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">Invite New Evaluator</h3>
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    type="email"
                    placeholder="Enter evaluator email address"
                    value={newEvaluatorEmail}
                    onChange={(e) => setNewEvaluatorEmail(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleInviteEvaluator()}
                  />
                </div>
                <Button
                  onClick={handleInviteEvaluator}
                  disabled={!newEvaluatorEmail || !newEvaluatorEmail.includes("@")}
                  className="bg-[#0a3141] hover:bg-[#0a3141]/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Send Invite
                </Button>
              </div>
            </div>

            {/* Invited Evaluators List */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Invited Evaluators</h3>
                <Badge variant="secondary" className="text-sm">
                  {invitedEvaluators.length} Total
                </Badge>
              </div>

              {invitedEvaluators.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Mail className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No evaluators invited yet</p>
                  <p className="text-sm">Start by adding an email address above</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {invitedEvaluators.map((evaluator) => (
                    <div
                      key={evaluator.id}
                      className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                          <AvatarFallback>
                            {evaluator.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{evaluator.name}</p>
                          <p className="text-sm text-gray-600">{evaluator.email}</p>
                          <p className="text-xs text-gray-500">{evaluator.role}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <Badge className={getStatusColor(evaluator.status)}>
                            {evaluator.status.charAt(0).toUpperCase() + evaluator.status.slice(1)}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">
                            Invited: {new Date(evaluator.invitedDate).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveEvaluator(evaluator.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {invitedEvaluators.filter((e) => e.status === "evaluated").length}
                </div>
                <div className="text-sm text-green-700">Evaluated</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {invitedEvaluators.filter((e) => e.status === "draft").length}
                </div>
                <div className="text-sm text-yellow-700">Draft</div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Premium Modal */}
      {showPremiumModal && (
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
                This feature is available with our Premium plan. Upgrade now to unlock advanced recruitment tools and
                enhance your hiring process.
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
                <p>📊 Advanced analytics and reporting</p>
                <p>💬 Direct messaging with candidates</p>
                <p>🎯 AI-powered candidate matching</p>
                <p>👥 Professional recruitment coaching</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
