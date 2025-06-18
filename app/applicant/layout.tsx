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
  ClipboardList,
  Timer,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

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
    name: "Job Preferences",
    href: "/applicant/job-preferences",
    icon: Settings,
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

// Sample exam questions - expanded for multiple pages
const examQuestions = [
  {
    id: 1,
    type: "multiple-choice",
    question: "Which of the following is a key principle of effective communication in a professional environment?",
    options: [
      "Using complex terminology to demonstrate expertise",
      "Clarity and conciseness in messaging",
      "Avoiding written communication whenever possible",
      "Communicating only when absolutely necessary",
    ],
    correctAnswer: 1,
  },
  {
    id: 2,
    type: "short-answer",
    question:
      "Describe a situation where you had to resolve a conflict in a team setting. What approach did you take and what was the outcome?",
    maxLength: 500,
  },
  {
    id: 3,
    type: "multiple-choice",
    question: "What is the most effective way to prioritize tasks when facing multiple deadlines?",
    options: [
      "Complete tasks in the order they were assigned",
      "Work on the easiest tasks first to build momentum",
      "Assess urgency and importance to determine priority",
      "Delegate all tasks to team members",
    ],
    correctAnswer: 2,
  },
  {
    id: 4,
    type: "short-answer",
    question: "Explain how you stay updated with industry trends and developments relevant to your field.",
    maxLength: 300,
  },
  {
    id: 5,
    type: "multiple-choice",
    question: "Which approach is most effective when receiving constructive criticism?",
    options: [
      "Defending your actions and explaining your reasoning",
      "Listening actively and asking clarifying questions",
      "Immediately implementing all suggested changes",
      "Seeking a second opinion before responding",
    ],
    correctAnswer: 1,
  },
  {
    id: 6,
    type: "short-answer",
    question: "Describe your experience with project management. What tools and methodologies have you used?",
    maxLength: 400,
  },
  {
    id: 7,
    type: "multiple-choice",
    question: "What is the best approach when working with a diverse team?",
    options: [
      "Treat everyone exactly the same way",
      "Adapt communication styles to individual preferences",
      "Focus only on work-related interactions",
      "Avoid discussing cultural differences",
    ],
    correctAnswer: 1,
  },
  {
    id: 8,
    type: "short-answer",
    question: "How do you handle stress and pressure in high-stakes situations? Provide a specific example.",
    maxLength: 350,
  },
  {
    id: 9,
    type: "multiple-choice",
    question: "Which quality is most important for effective leadership?",
    options: [
      "Making all decisions independently",
      "Being the most technically skilled person",
      "Being the most technically skilled person",
      "Inspiring and motivating others",
      "Maintaining strict control over all processes",
    ],
    correctAnswer: 2,
  },
  {
    id: 10,
    type: "short-answer",
    question: "What are your long-term career goals and how does this position align with them?",
    maxLength: 400,
  },
]

const QUESTIONS_PER_PAGE = 2

export default function ApplicantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showPremiumModal, setShowPremiumModal] = useState(false)
  const [showInstructionsModal, setShowInstructionsModal] = useState(false)
  const [showExamModal, setShowExamModal] = useState(false)
  const [examTimeRemaining, setExamTimeRemaining] = useState(30 * 60) // 30 minutes in seconds
  const [examAnswers, setExamAnswers] = useState({})
  const [currentPage, setCurrentPage] = useState(0)

  const totalPages = Math.ceil(examQuestions.length / QUESTIONS_PER_PAGE)
  const currentQuestions = examQuestions.slice(currentPage * QUESTIONS_PER_PAGE, (currentPage + 1) * QUESTIONS_PER_PAGE)

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Handle exam timer
  const startExam = () => {
    setShowInstructionsModal(false)
    setShowExamModal(true)
    setCurrentPage(0)

    // Start the timer
    const timer = setInterval(() => {
      setExamTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          // Auto-submit when time expires
          submitExam()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Clean up timer on unmount
    return () => clearInterval(timer)
  }

  // Handle exam submission
  const submitExam = () => {
    // Here you would normally send the answers to the server
    console.log("Exam submitted:", examAnswers)
    setShowExamModal(false)
    // Reset for next time
    setExamTimeRemaining(30 * 60)
    setExamAnswers({})
    setCurrentPage(0)
  }

  // Handle answer changes
  const handleAnswerChange = (questionId, answer) => {
    setExamAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  // Navigation functions
  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToPage = (pageIndex) => {
    setCurrentPage(pageIndex)
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
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
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
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
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive ? "bg-[#0a3141] text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
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

            {/* Application Tab */}
            <div className="relative">
              <button
                onClick={() => setShowInstructionsModal(true)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              >
                <ClipboardList className="w-5 h-5" />
                <span className="flex-1 text-left">Application</span>
              </button>
            </div>
          </nav>

          {/* User Profile Section */}
          <div className="p-4 border-t border-gray-200 flex-shrink-0">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
              <Avatar className="w-10 h-10">
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">John Doe</p>
                <p className="text-xs text-gray-500 truncate">Software Developer</p>
              </div>
            </div>
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
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">John Doe</p>
                      <p className="text-xs leading-none text-muted-foreground">john.doe@example.com</p>
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
      )}

      {/* Instructions Modal */}
      <Dialog open={showInstructionsModal} onOpenChange={setShowInstructionsModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Important Application Instructions</DialogTitle>
            <DialogDescription>Please read carefully before proceeding.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-4 text-sm">
            <p>
              You are about to access the application form. Please note the following key information crucial to your
              application.
            </p>

            <ul className="list-disc pl-5 space-y-2">
              <li>
                Once you initiate the application, you must finish the entire process in one go. Returning to your
                application at a later time is not permitted.
              </li>
              <li>
                Each applicant is limited to submitting one application form. Therefore, any attempt to reapply will
                result in the rejection of the subsequent application.
              </li>
              <li>
                Ensure that you possess all necessary resources to avoid disruptions during your application process,
                including access to uninterrupted power and internet connectivity.
              </li>
              <li>
                The application process may include an screening questions/exam designed to evaluate your suitability
                for the position. This screening questions/exam is timed, meaning once the allocated time has elapsed,
                your application will be automatically submitted, regardless of whether you have completed the screening
                questions/exam or not.
              </li>
              <li>
                As part of the screening questions/exam procedure, for proctoring and security purposes, random
                snapshots are captured to detect unauthorized activities. To do, so make sure that your built-in camera
                or external camera is functioning and you are well visible. Do not continue, if your built-in camera or
                external camera is not operational, to not get disqualified. Please grant your browser access to the
                camera, when you start the screening questions/exam.
              </li>
            </ul>
          </div>

          <DialogFooter>
            <Button onClick={() => startExam()} className="w-full bg-[#0a3141] hover:bg-[#1a4a5c] text-white">
              I understand, let me proceed to the exam page
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Exam Modal - Much Wider */}
      <Dialog
        open={showExamModal}
        onOpenChange={(open) => {
          if (!open) {
            // Confirm before closing
            if (confirm("Are you sure you want to exit? Your progress will be lost.")) {
              setShowExamModal(false)
            }
          }
        }}
      >
        <DialogContent className="max-w-6xl w-[95vw] max-h-[95vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center justify-between">
              <span>Application Screening Questions</span>
              <div className="bg-[#0a3141] text-white px-4 py-2 rounded-md flex items-center gap-2">
                <Timer className="w-4 h-4" />
                <span className="font-mono">{formatTime(examTimeRemaining)}</span>
              </div>
            </DialogTitle>
            <DialogDescription>Please answer all questions to the best of your ability.</DialogDescription>
          </DialogHeader>

          {/* Page Indicator */}
          <div className="flex items-center justify-center gap-2 py-4 border-b flex-shrink-0">
            <span className="text-sm text-gray-600">
              Page {currentPage + 1} of {totalPages}
            </span>
            <div className="flex gap-1 ml-4">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    i === currentPage ? "bg-[#0a3141]" : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Questions Content */}
          <div className="flex-1 overflow-y-auto py-6">
            <div className="space-y-8 px-2">
              {currentQuestions.map((question) => (
                <div key={question.id} className="p-6 border rounded-lg bg-gray-50">
                  <h3 className="font-medium mb-4 text-lg">{question.question}</h3>

                  {question.type === "multiple-choice" ? (
                    <RadioGroup
                      onValueChange={(value) => handleAnswerChange(question.id, Number.parseInt(value))}
                      value={examAnswers[question.id]?.toString()}
                    >
                      <div className="space-y-3">
                        {question.options.map((option, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-md border">
                            <RadioGroupItem
                              value={index.toString()}
                              id={`q${question.id}-option${index}`}
                              className="mt-1"
                            />
                            <Label htmlFor={`q${question.id}-option${index}`} className="flex-1 cursor-pointer">
                              {option}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  ) : (
                    <div className="bg-white rounded-md border p-4">
                      <Textarea
                        placeholder="Type your answer here..."
                        className="min-h-[200px] border-0 resize-none focus:ring-0 text-base"
                        maxLength={question.maxLength}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        value={examAnswers[question.id] || ""}
                      />
                      <div className="text-xs text-gray-500 mt-2 text-right border-t pt-2">
                        {examAnswers[question.id]?.length || 0}/{question.maxLength} characters
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Footer */}
          <DialogFooter className="flex-shrink-0 border-t pt-4">
            <div className="flex items-center justify-between w-full">
              <Button
                variant="outline"
                onClick={goToPreviousPage}
                disabled={currentPage === 0}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              <div className="flex items-center gap-4">
                {currentPage === totalPages - 1 ? (
                  <Button onClick={submitExam} className="bg-[#0a3141] hover:bg-[#1a4a5c] text-white px-8">
                    Submit Application
                  </Button>
                ) : (
                  <Button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages - 1}
                    className="bg-[#0a3141] hover:bg-[#1a4a5c] text-white flex items-center gap-2"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
