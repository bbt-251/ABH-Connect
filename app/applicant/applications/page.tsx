"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  Calendar,
  MapPin,
  Eye,
  MessageSquare,
  FileText,
  Star,
  Award,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  Paperclip,
  CalendarClock,
  Users,
  FileQuestion,
  MessageCircle,
  Trash2,
  RefreshCw,
  Bell,
  ArrowUpDown,
} from "lucide-react"
import Link from "next/link"

// Mock data for applications
const applications = [
  {
    id: 1,
    company: "Google",
    position: "Senior Software Engineer",
    status: "Interview",
    appliedDate: "2024-01-15",
    salary: "$150k - $200k",
    location: "Mountain View, CA",
    type: "Full-time",
    logo: "/placeholder.svg?height=40&width=40",
    interviewDate: "2024-01-20",
    interviewTime: "10:00 AM - 11:30 AM",
    interviewType: "Technical Interview",
    interviewLocation: "Google HQ, Building 40",
    interviewNotes:
      "Prepare for system design and coding questions. Interview will be conducted by the engineering team.",
    notes: "Technical interview scheduled with the engineering team",
    description:
      "We are looking for a Senior Software Engineer to join our team. You will be responsible for designing, developing, and maintaining software systems. You will work closely with product managers, designers, and other engineers to build high-quality products.",
    timeline: [
      { stage: "Applied", date: "2024-01-15", completed: true },
      { stage: "Resume Screened", date: "2024-01-16", completed: true },
      { stage: "Technical Assessment", date: "2024-01-17", completed: true },
      { stage: "Interview", date: "2024-01-20", completed: false },
      { stage: "Final Decision", date: "", completed: false },
    ],
    documents: [
      { name: "Resume.pdf", size: "1.2 MB", uploadDate: "2024-01-15", type: "application/pdf" },
      { name: "Cover Letter.pdf", size: "0.8 MB", uploadDate: "2024-01-15", type: "application/pdf" },
      { name: "Portfolio.pdf", size: "5.4 MB", uploadDate: "2024-01-15", type: "application/pdf" },
    ],
    screeningQuestions: [
      {
        question: "How many years of experience do you have with React?",
        answer: "5 years of professional experience building React applications.",
      },
      {
        question: "Describe a challenging project you worked on.",
        answer:
          "I led the development of a real-time collaboration tool that supported 10,000 concurrent users. The main challenge was ensuring data consistency across all clients while maintaining performance.",
      },
      {
        question: "What is your experience with system design?",
        answer:
          "I have designed and implemented several large-scale distributed systems, focusing on scalability, reliability, and performance.",
      },
    ],
    evaluationForms: [
      {
        id: 1,
        name: "Technical Skills Assessment",
        passingScore: 75,
        totalScore: 85,
        status: "Completed",
        completedDate: "2024-01-09",
        metrics: [
          { name: "Problem Solving", score: 4, threshold: 3, weight: 30, maxScore: 5 },
          { name: "Code Quality", score: 4, threshold: 3, weight: 25, maxScore: 5 },
          { name: "System Design", score: 5, threshold: 4, weight: 25, maxScore: 5 },
          { name: "Communication", score: 3, threshold: 3, weight: 20, maxScore: 5 },
        ],
      },
      {
        id: 2,
        name: "Cultural Fit Assessment",
        passingScore: 70,
        totalScore: 78,
        status: "Completed",
        completedDate: "2024-01-09",
        metrics: [
          { name: "Team Collaboration", score: 4, threshold: 3, weight: 40, maxScore: 5 },
          { name: "Leadership Potential", score: 4, threshold: 3, weight: 30, maxScore: 5 },
          { name: "Adaptability", score: 3, threshold: 3, weight: 30, maxScore: 5 },
        ],
      },
    ],
    feedback:
      "Strong technical skills demonstrated in the assessment. Good cultural fit with our team values. Moving forward with the interview process.",
    notifications: [
      { id: 1, message: "Interview scheduled for January 20", date: "2024-01-16", read: true },
      { id: 2, message: "Please complete the technical assessment", date: "2024-01-16", read: true },
      { id: 3, message: "Your resume has been reviewed", date: "2024-01-16", read: false },
    ],
  },
  {
    id: 2,
    company: "Microsoft",
    position: "Product Manager",
    status: "Applied",
    appliedDate: "2024-01-12",
    salary: "$120k - $160k",
    location: "Seattle, WA",
    type: "Full-time",
    logo: "/placeholder.svg?height=40&width=40",
    notes: "Application submitted through company website",
    description:
      "As a Product Manager at Microsoft, you will be responsible for defining product vision, strategy, and roadmap. You will work closely with engineering, design, and marketing teams to deliver products that delight our customers.",
    timeline: [
      { stage: "Applied", date: "2024-01-12", completed: true },
      { stage: "Resume Screening", date: "", completed: false },
      { stage: "Phone Interview", date: "", completed: false },
      { stage: "Onsite Interview", date: "", completed: false },
      { stage: "Final Decision", date: "", completed: false },
    ],
    documents: [
      { name: "Resume.pdf", size: "1.2 MB", uploadDate: "2024-01-12", type: "application/pdf" },
      { name: "Cover Letter.pdf", size: "0.8 MB", uploadDate: "2024-01-12", type: "application/pdf" },
    ],
    screeningQuestions: [
      {
        question: "Describe your experience with product management.",
        answer:
          "I have 3 years of experience as a product manager, leading cross-functional teams to deliver user-centered products.",
      },
      {
        question: "How do you prioritize features?",
        answer:
          "I use a combination of user research, business impact, and technical feasibility to prioritize features.",
      },
    ],
    notifications: [{ id: 1, message: "Application received", date: "2024-01-12", read: true }],
  },
  {
    id: 3,
    company: "Apple",
    position: "UX Designer",
    status: "Offer",
    appliedDate: "2024-01-10",
    salary: "$110k - $140k",
    location: "Cupertino, CA",
    type: "Full-time",
    logo: "/placeholder.svg?height=40&width=40",
    notes: "Offer received - considering terms",
    offerDate: "2024-01-18",
    offerDetails: {
      salary: "$135,000",
      bonus: "$15,000 signing bonus",
      equity: "100 RSUs vesting over 4 years",
      benefits: "Health, dental, vision insurance, 401k matching, unlimited PTO",
      startDate: "2024-02-15",
      deadline: "2024-01-25",
    },
    description:
      "As a UX Designer at Apple, you will be responsible for creating intuitive and elegant user experiences for our products. You will work closely with product managers, engineers, and other designers to create designs that are both beautiful and functional.",
    timeline: [
      { stage: "Applied", date: "2024-01-10", completed: true },
      { stage: "Portfolio Review", date: "2024-01-12", completed: true },
      { stage: "Phone Screen", date: "2024-01-14", completed: true },
      { stage: "Design Challenge", date: "2024-01-15", completed: true },
      { stage: "Onsite Interview", date: "2024-01-17", completed: true },
      { stage: "Offer", date: "2024-01-18", completed: true },
    ],
    documents: [
      { name: "Resume.pdf", size: "1.1 MB", uploadDate: "2024-01-10", type: "application/pdf" },
      { name: "Portfolio.pdf", size: "8.5 MB", uploadDate: "2024-01-10", type: "application/pdf" },
      { name: "Design Challenge.pdf", size: "4.2 MB", uploadDate: "2024-01-15", type: "application/pdf" },
    ],
    screeningQuestions: [
      {
        question: "Describe your design process.",
        answer:
          "My design process involves research, ideation, prototyping, testing, and iteration. I focus on understanding user needs and business goals to create effective solutions.",
      },
      {
        question: "What design tools do you use?",
        answer:
          "I primarily use Figma, Sketch, and Adobe Creative Suite. I'm also proficient with prototyping tools like Principle and Framer.",
      },
    ],
    feedback:
      "Excellent portfolio and design skills. Strong performance in the design challenge. Team was impressed with your communication and problem-solving approach.",
    notifications: [
      { id: 1, message: "Offer letter sent", date: "2024-01-18", read: false },
      { id: 2, message: "Design challenge feedback available", date: "2024-01-16", read: true },
      { id: 3, message: "Interview scheduled", date: "2024-01-14", read: true },
    ],
  },
  {
    id: 4,
    company: "Netflix",
    position: "Data Scientist",
    status: "Rejected",
    appliedDate: "2024-01-05",
    salary: "$130k - $170k",
    location: "Los Gatos, CA",
    type: "Full-time",
    logo: "/placeholder.svg?height=40&width=40",
    notes: "Position filled internally",
    rejectionDate: "2024-01-15",
    rejectionReason:
      "While your qualifications are impressive, we have decided to move forward with candidates whose experience more closely aligns with our current needs.",
    description:
      "As a Data Scientist at Netflix, you will be responsible for analyzing data to help drive business decisions. You will work with large datasets to extract insights and build models that help us understand user behavior and improve our product.",
    timeline: [
      { stage: "Applied", date: "2024-01-05", completed: true },
      { stage: "Resume Screening", date: "2024-01-07", completed: true },
      { stage: "Technical Assessment", date: "2024-01-10", completed: true },
      { stage: "Rejected", date: "2024-01-15", completed: true },
    ],
    documents: [
      { name: "Resume.pdf", size: "1.3 MB", uploadDate: "2024-01-05", type: "application/pdf" },
      { name: "Cover Letter.pdf", size: "0.7 MB", uploadDate: "2024-01-05", type: "application/pdf" },
    ],
    screeningQuestions: [
      {
        question: "Describe your experience with machine learning.",
        answer:
          "I have 4 years of experience building and deploying machine learning models, primarily in recommendation systems and natural language processing.",
      },
      {
        question: "What programming languages are you proficient in?",
        answer: "I'm proficient in Python, R, and SQL. I also have experience with Spark for big data processing.",
      },
    ],
    feedback: "Strong technical skills but looking for more experience in recommendation systems specifically.",
    notifications: [
      { id: 1, message: "Application status updated", date: "2024-01-15", read: true },
      { id: 2, message: "Technical assessment received", date: "2024-01-10", read: true },
    ],
  },
  {
    id: 5,
    company: "Amazon",
    position: "Software Development Engineer",
    status: "Interview",
    appliedDate: "2024-01-08",
    salary: "$140k - $180k",
    location: "Seattle, WA",
    type: "Full-time",
    logo: "/placeholder.svg?height=40&width=40",
    interviewDate: "2024-01-22",
    interviewTime: "2:00 PM - 5:00 PM",
    interviewType: "Onsite Interview",
    interviewLocation: "Amazon HQ, Day 1 Building",
    interviewNotes:
      "You will have 4 interviews, each 45 minutes long. Focus on algorithms, system design, and leadership principles.",
    notes: "Interview in progress",
    description:
      "As a Software Development Engineer at Amazon, you will be responsible for designing, developing, and maintaining software systems. You will work in a fast-paced environment to build scalable solutions that impact millions of customers.",
    timeline: [
      { stage: "Applied", date: "2024-01-08", completed: true },
      { stage: "Online Assessment", date: "2024-01-10", completed: true },
      { stage: "Phone Screen", date: "2024-01-15", completed: true },
      { stage: "Onsite Interview", date: "2024-01-22", completed: false },
      { stage: "Final Decision", date: "", completed: false },
    ],
    documents: [
      { name: "Resume.pdf", size: "1.2 MB", uploadDate: "2024-01-08", type: "application/pdf" },
      { name: "Cover Letter.pdf", size: "0.9 MB", uploadDate: "2024-01-08", type: "application/pdf" },
    ],
    screeningQuestions: [
      {
        question: "Describe a time when you had to solve a complex technical problem.",
        answer:
          "I had to optimize a database query that was taking over 30 seconds to execute. By analyzing the query plan and adding appropriate indexes, I reduced the execution time to under 100ms.",
      },
      {
        question: "How do you approach testing your code?",
        answer:
          "I believe in a comprehensive testing approach that includes unit tests, integration tests, and end-to-end tests. I aim for high test coverage and use TDD when appropriate.",
      },
    ],
    evaluationForms: [
      {
        id: 1,
        name: "Technical Assessment",
        passingScore: 80,
        totalScore: 88,
        status: "Completed",
        completedDate: "2024-01-10",
        metrics: [
          { name: "Algorithms", score: 5, threshold: 4, weight: 40, maxScore: 5 },
          { name: "System Architecture", score: 4, threshold: 3, weight: 35, maxScore: 5 },
          { name: "Problem Solving", score: 4, threshold: 3, weight: 25, maxScore: 5 },
        ],
      },
    ],
    feedback: "Strong performance on the online assessment and phone screen. Looking forward to the onsite interview.",
    notifications: [
      { id: 1, message: "Onsite interview scheduled", date: "2024-01-16", read: false },
      { id: 2, message: "Phone screen feedback available", date: "2024-01-15", read: true },
      { id: 3, message: "Online assessment completed", date: "2024-01-10", read: true },
    ],
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Applied":
      return "bg-gray-100 text-gray-800"
    case "Interview":
      return "bg-blue-100 text-blue-800"
    case "Rejected":
      return "bg-red-100 text-red-800"
    case "Offer":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Applied":
      return <Clock className="w-4 h-4 text-gray-600" />
    case "Interview":
      return <Users className="w-4 h-4 text-blue-600" />
    case "Rejected":
      return <XCircle className="w-4 h-4 text-red-600" />
    case "Offer":
      return <CheckCircle className="w-4 h-4 text-green-600" />
    default:
      return <Clock className="w-4 h-4 text-gray-600" />
  }
}

const getScoreColor = (score: number, threshold: number) => {
  if (score >= threshold) {
    return "text-green-600"
  } else {
    return "text-red-600"
  }
}

const renderStars = (score: number, maxScore: number) => {
  return Array.from({ length: maxScore }, (_, i) => (
    <Star key={i} className={`w-4 h-4 ${i < score ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
  ))
}

const getTimelineProgress = (timeline: any[]) => {
  const completed = timeline.filter((item) => item.completed).length
  return (completed / timeline.length) * 100
}

export default function ApplicationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")
  const [selectedApplication, setSelectedApplication] = useState<(typeof applications)[0] | null>(null)
  const [activeTab, setActiveTab] = useState("details")
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false)
  const [withdrawReason, setWithdrawReason] = useState("")
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<{ id: number; message: string; date: string; read: boolean }[]>([
    { id: 1, message: "Interview scheduled for Google position", date: "2024-01-16", read: false },
    { id: 2, message: "Offer received from Apple", date: "2024-01-18", read: false },
    { id: 3, message: "Application status updated for Netflix", date: "2024-01-15", read: true },
  ])

  const sortApplications = (apps: typeof applications) => {
    return [...apps].sort((a, b) => {
      if (sortBy === "date") {
        const dateA = new Date(a.appliedDate).getTime()
        const dateB = new Date(b.appliedDate).getTime()
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA
      } else if (sortBy === "company") {
        return sortOrder === "asc" ? a.company.localeCompare(b.company) : b.company.localeCompare(a.company)
      } else if (sortBy === "position") {
        return sortOrder === "asc" ? a.position.localeCompare(b.position) : b.position.localeCompare(a.position)
      }
      return 0
    })
  }

  const filteredApplications = sortApplications(
    applications.filter((app) => {
      const matchesSearch =
        app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.position.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || app.status === statusFilter
      return matchesSearch && matchesStatus
    }),
  )

  const statusCounts = {
    all: applications.length,
    applied: applications.filter((app) => app.status === "Applied").length,
    interview: applications.filter((app) => app.status === "Interview").length,
    rejected: applications.filter((app) => app.status === "Rejected").length,
    offer: applications.filter((app) => app.status === "Offer").length,
  }

  const unreadNotifications = notifications.filter((n) => !n.read).length

  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const handleWithdrawApplication = () => {
    // In a real app, this would send a request to the server
    setShowWithdrawDialog(false)
    // Show success message or update UI
  }

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-500">Track and manage your job applications</p>
        </div>
        <div className="flex items-center gap-3">
          <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {unreadNotifications}
                  </span>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex justify-between items-center">
                  <span>Notifications</span>
                  <Button variant="ghost" size="sm" onClick={markAllNotificationsAsRead}>
                    Mark all as read
                  </Button>
                </DialogTitle>
              </DialogHeader>
              <div className="max-h-[60vh] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No notifications</div>
                ) : (
                  <div className="space-y-2">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 rounded-lg ${notification.read ? "bg-gray-50" : "bg-blue-50"}`}
                      >
                        <div className="flex justify-between items-start">
                          <p className={`text-sm ${notification.read ? "text-gray-700" : "text-gray-900 font-medium"}`}>
                            {notification.message}
                          </p>
                          {!notification.read && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{notification.date}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
          <Link href="/all-jobs">
            <Button className="bg-[#d2f277] text-black hover:bg-[#c2e267]">Apply to New Jobs</Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card
          className={`cursor-pointer hover:shadow-md transition-shadow ${statusFilter === "all" ? "ring-2 ring-[#0a3141]" : ""}`}
          onClick={() => setStatusFilter("all")}
        >
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-[#0a3141]">{statusCounts.all}</div>
            <div className="text-sm text-gray-500">Total</div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer hover:shadow-md transition-shadow ${statusFilter === "Applied" ? "ring-2 ring-[#0a3141]" : ""}`}
          onClick={() => setStatusFilter("Applied")}
        >
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">{statusCounts.applied}</div>
            <div className="text-sm text-gray-500">Applied</div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer hover:shadow-md transition-shadow ${statusFilter === "Interview" ? "ring-2 ring-[#0a3141]" : ""}`}
          onClick={() => setStatusFilter("Interview")}
        >
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{statusCounts.interview}</div>
            <div className="text-sm text-gray-500">Interview</div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer hover:shadow-md transition-shadow ${statusFilter === "Rejected" ? "ring-2 ring-[#0a3141]" : ""}`}
          onClick={() => setStatusFilter("Rejected")}
        >
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{statusCounts.rejected}</div>
            <div className="text-sm text-gray-500">Rejected</div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer hover:shadow-md transition-shadow ${statusFilter === "Offer" ? "ring-2 ring-[#0a3141]" : ""}`}
          onClick={() => setStatusFilter("Offer")}
        >
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{statusCounts.offer}</div>
            <div className="text-sm text-gray-500">Offer</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search companies or positions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Applications</SelectItem>
                  <SelectItem value="Applied">Applied</SelectItem>
                  <SelectItem value="Interview">Interview</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                  <SelectItem value="Offer">Offer</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date Applied</SelectItem>
                  <SelectItem value="company">Company</SelectItem>
                  <SelectItem value="position">Position</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={toggleSortOrder}>
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {filteredApplications.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <FileText className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
                <Link href="/all-jobs">
                  <Button>Browse Jobs</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            filteredApplications.map((application) => (
              <Card
                key={application.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedApplication?.id === application.id ? "ring-2 ring-[#0a3141]" : ""
                }`}
                onClick={() => setSelectedApplication(application)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                      <img
                        src={application.logo || "/placeholder.svg"}
                        alt={`${application.company} logo`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg?height=40&width=40"
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{application.position}</h3>
                          <p className="text-gray-600">{application.company}</p>
                        </div>
                        <Badge className={getStatusColor(application.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(application.status)}
                            {application.status}
                          </span>
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{application.location}</span>
                          <span>•</span>
                          <span>{application.type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Applied on {application.appliedDate}</span>
                        </div>
                        {application.interviewDate && (
                          <div className="flex items-center gap-2">
                            <CalendarClock className="w-4 h-4 text-blue-600" />
                            <span className="text-blue-600 font-medium">Interview on {application.interviewDate}</span>
                          </div>
                        )}
                        {application.offerDate && (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-green-600 font-medium">
                              Offer received on {application.offerDate}
                            </span>
                          </div>
                        )}
                        <div className="font-medium text-gray-900">{application.salary}</div>
                      </div>

                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-1 text-xs">
                          <span className="text-gray-500">Application Progress</span>
                          <span className="font-medium">{Math.round(getTimelineProgress(application.timeline))}%</span>
                        </div>
                        <Progress value={getTimelineProgress(application.timeline)} className="h-1.5" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Application Details */}
        <div className="lg:sticky lg:top-6">
          {selectedApplication ? (
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>Application Details</CardTitle>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Export Application</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Checkbox id="export-pdf" />
                              <label htmlFor="export-pdf" className="text-sm font-medium">
                                Export as PDF
                              </label>
                            </div>
                            <div className="flex items-center gap-2">
                              <Checkbox id="export-timeline" defaultChecked />
                              <label htmlFor="export-timeline" className="text-sm font-medium">
                                Include timeline
                              </label>
                            </div>
                            <div className="flex items-center gap-2">
                              <Checkbox id="export-feedback" defaultChecked />
                              <label htmlFor="export-feedback" className="text-sm font-medium">
                                Include feedback
                              </label>
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button>Download</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Dialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Withdraw
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Withdraw Application</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to withdraw your application for {selectedApplication.position} at{" "}
                            {selectedApplication.company}? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Reason for withdrawal (optional)</label>
                            <Textarea
                              placeholder="Please provide a reason for withdrawing your application..."
                              value={withdrawReason}
                              onChange={(e) => setWithdrawReason(e.target.value)}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowWithdrawDialog(false)}>
                            Cancel
                          </Button>
                          <Button variant="destructive" onClick={handleWithdrawApplication}>
                            Withdraw Application
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="px-6">
                  <TabsList className="grid grid-cols-5 w-full">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                    <TabsTrigger value="screening">Screening</TabsTrigger>
                    <TabsTrigger value="feedback">Feedback</TabsTrigger>
                  </TabsList>
                </div>

                <CardContent className="pt-4 pb-6">
                  <TabsContent value="details" className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                        <img
                          src={selectedApplication.logo || "/placeholder.svg"}
                          alt={`${selectedApplication.company} logo`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/placeholder.svg?height=40&width=40"
                          }}
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{selectedApplication.position}</h3>
                        <p className="text-gray-600">{selectedApplication.company}</p>
                        <Badge className={getStatusColor(selectedApplication.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(selectedApplication.status)}
                            {selectedApplication.status}
                          </span>
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Job Description</h4>
                        <p className="text-sm text-gray-600">{selectedApplication.description}</p>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-medium mb-2">Job Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Location:</span>
                            <span>{selectedApplication.location}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Type:</span>
                            <span>{selectedApplication.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Salary:</span>
                            <span>{selectedApplication.salary}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Applied:</span>
                            <span>{selectedApplication.appliedDate}</span>
                          </div>
                          {selectedApplication.interviewDate && (
                            <div className="flex justify-between">
                              <span className="text-gray-500">Interview:</span>
                              <span>{selectedApplication.interviewDate}</span>
                            </div>
                          )}
                          {selectedApplication.offerDate && (
                            <div className="flex justify-between">
                              <span className="text-gray-500">Offer Date:</span>
                              <span>{selectedApplication.offerDate}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {selectedApplication.interviewDate && (
                        <>
                          <Separator />
                          <div>
                            <h4 className="font-medium mb-2">Interview Details</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-500">Date:</span>
                                <span>{selectedApplication.interviewDate}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Time:</span>
                                <span>{selectedApplication.interviewTime}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Type:</span>
                                <span>{selectedApplication.interviewType}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Location:</span>
                                <span>{selectedApplication.interviewLocation}</span>
                              </div>
                              <div className="mt-2">
                                <span className="text-gray-500 block mb-1">Notes:</span>
                                <p className="text-gray-700">{selectedApplication.interviewNotes}</p>
                              </div>
                              <div className="flex gap-2 mt-2">
                                <Button size="sm" variant="outline" className="flex-1">
                                  <Calendar className="w-4 h-4 mr-2" />
                                  Add to Calendar
                                </Button>
                                <Button size="sm" variant="outline" className="flex-1">
                                  <RefreshCw className="w-4 h-4 mr-2" />
                                  Request Reschedule
                                </Button>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {selectedApplication.offerDetails && (
                        <>
                          <Separator />
                          <div>
                            <h4 className="font-medium mb-2">Offer Details</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-500">Salary:</span>
                                <span className="font-medium">{selectedApplication.offerDetails.salary}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Bonus:</span>
                                <span>{selectedApplication.offerDetails.bonus}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Equity:</span>
                                <span>{selectedApplication.offerDetails.equity}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Benefits:</span>
                                <span className="text-right">{selectedApplication.offerDetails.benefits}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Start Date:</span>
                                <span>{selectedApplication.offerDetails.startDate}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Decision Deadline:</span>
                                <span className="font-medium text-red-600">
                                  {selectedApplication.offerDetails.deadline}
                                </span>
                              </div>
                              <div className="flex gap-2 mt-2">
                                <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                                  Accept Offer
                                </Button>
                                <Button size="sm" variant="outline" className="flex-1">
                                  Negotiate
                                </Button>
                                <Button size="sm" variant="outline" className="flex-1 text-red-600 hover:text-red-700">
                                  Decline
                                </Button>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      <Separator />

                      <div>
                        <h4 className="font-medium mb-2">Notes</h4>
                        <p className="text-sm text-gray-600">{selectedApplication.notes}</p>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="w-4 h-4 mr-2" />
                          View Job
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                        {selectedApplication.status === "Interview" && selectedApplication.evaluationForms && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="flex-1">
                                <Award className="w-4 h-4 mr-2" />
                                View Evaluation
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Interview Evaluation Results</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-6">
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                  <h3 className="text-lg font-semibold">{selectedApplication.position}</h3>
                                  <p className="text-gray-600">{selectedApplication.company}</p>
                                  <p className="text-sm text-gray-500 mt-1">Interview in progress</p>
                                </div>

                                {selectedApplication.evaluationForms.map((form) => (
                                  <Card key={form.id}>
                                    <CardHeader>
                                      <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg">{form.name}</CardTitle>
                                        <div className="flex items-center gap-2">
                                          <Badge
                                            variant={form.totalScore >= form.passingScore ? "default" : "destructive"}
                                          >
                                            {form.totalScore >= form.passingScore ? "Passed" : "Not Passed"}
                                          </Badge>
                                          <span className="text-sm text-gray-500">
                                            Score: {form.totalScore}% (Required: {form.passingScore}%)
                                          </span>
                                        </div>
                                      </div>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-4">
                                        <div className="text-sm text-gray-600">Completed on {form.completedDate}</div>

                                        <div className="space-y-3">
                                          <h4 className="font-medium">Evaluation Metrics</h4>
                                          {form.metrics.map((metric, index) => (
                                            <div key={index} className="border rounded-lg p-4">
                                              <div className="flex items-center justify-between mb-2">
                                                <span className="font-medium">{metric.name}</span>
                                                <div className="flex items-center gap-2">
                                                  <div className="flex items-center">
                                                    {renderStars(metric.score, metric.maxScore)}
                                                  </div>
                                                  <span
                                                    className={`text-sm font-medium ${getScoreColor(metric.score, metric.threshold)}`}
                                                  >
                                                    {metric.score}/{metric.maxScore}
                                                  </span>
                                                </div>
                                              </div>
                                              <div className="flex justify-between text-sm text-gray-600">
                                                <span>Weight: {metric.weight}%</span>
                                                <span>
                                                  Threshold: {metric.threshold}/{metric.maxScore}
                                                  {metric.score >= metric.threshold ? " ✓" : " ✗"}
                                                </span>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="timeline" className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-4">Application Timeline</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between mb-1 text-xs">
                          <span className="text-gray-500">Progress</span>
                          <span className="font-medium">
                            {Math.round(getTimelineProgress(selectedApplication.timeline))}%
                          </span>
                        </div>
                        <Progress value={getTimelineProgress(selectedApplication.timeline)} className="h-2" />

                        <div className="space-y-6 mt-6">
                          {selectedApplication.timeline.map((item, index) => (
                            <div key={index} className="relative">
                              {/* Vertical line */}
                              {index < selectedApplication.timeline.length - 1 && (
                                <div
                                  className={`absolute left-3.5 top-6 w-0.5 h-full ${item.completed ? "bg-green-500" : "bg-gray-200"}`}
                                ></div>
                              )}

                              <div className="flex gap-4">
                                <div
                                  className={`w-7 h-7 rounded-full flex items-center justify-center ${
                                    item.completed
                                      ? "bg-green-100 text-green-600 border-2 border-green-500"
                                      : "bg-gray-100 text-gray-400 border-2 border-gray-300"
                                  }`}
                                >
                                  {item.completed ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-center">
                                    <h5 className={`font-medium ${item.completed ? "text-gray-900" : "text-gray-500"}`}>
                                      {item.stage}
                                    </h5>
                                    {item.date && <span className="text-sm text-gray-500">{item.date}</span>}
                                  </div>
                                  {item.stage === "Interview" && selectedApplication.interviewDate && (
                                    <div className="mt-2 p-3 bg-blue-50 rounded-lg text-sm">
                                      <div className="font-medium text-blue-800 mb-1">Interview Details</div>
                                      <div className="text-gray-700">
                                        {selectedApplication.interviewDate} at {selectedApplication.interviewTime}
                                        <div className="mt-1">{selectedApplication.interviewLocation}</div>
                                      </div>
                                    </div>
                                  )}
                                  {item.stage === "Offer" && selectedApplication.offerDate && (
                                    <div className="mt-2 p-3 bg-green-50 rounded-lg text-sm">
                                      <div className="font-medium text-green-800 mb-1">Offer Received</div>
                                      <div className="text-gray-700">
                                        Offer details available. Decision deadline:{" "}
                                        {selectedApplication.offerDetails?.deadline}
                                      </div>
                                    </div>
                                  )}
                                  {item.stage === "Rejected" && selectedApplication.rejectionDate && (
                                    <div className="mt-2 p-3 bg-red-50 rounded-lg text-sm">
                                      <div className="font-medium text-red-800 mb-1">Application Rejected</div>
                                      <div className="text-gray-700">{selectedApplication.rejectionReason}</div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="documents" className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Submitted Documents</h4>
                        <Button variant="outline" size="sm">
                          <Paperclip className="w-4 h-4 mr-2" />
                          Add Document
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {selectedApplication.documents.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5 text-gray-600" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{doc.name}</p>
                                <p className="text-xs text-gray-500">
                                  {doc.size} • Uploaded on {doc.uploadDate}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="screening" className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-4">Screening Questions</h4>
                      <div className="space-y-4">
                        {selectedApplication.screeningQuestions?.map((item, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <p className="font-medium text-gray-900 mb-2">{item.question}</p>
                            <p className="text-sm text-gray-600">{item.answer}</p>
                          </div>
                        ))}
                        {(!selectedApplication.screeningQuestions ||
                          selectedApplication.screeningQuestions.length === 0) && (
                          <div className="text-center py-8 text-gray-500">
                            <FileQuestion className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                            <p>No screening questions for this application</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="feedback" className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-4">Employer Feedback</h4>
                      {selectedApplication.feedback ? (
                        <div className="border rounded-lg p-4">
                          <p className="text-sm text-gray-600">{selectedApplication.feedback}</p>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <MessageCircle className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                          <p>No feedback available yet</p>
                          <Button variant="outline" size="sm" className="mt-4">
                            Request Feedback
                          </Button>
                        </div>
                      )}

                      {selectedApplication.evaluationForms && selectedApplication.evaluationForms.length > 0 && (
                        <div className="mt-6">
                          <h4 className="font-medium mb-4">Evaluation Results</h4>
                          {selectedApplication.evaluationForms.map((form) => (
                            <Card key={form.id} className="mb-4">
                              <CardHeader className="py-3">
                                <div className="flex items-center justify-between">
                                  <CardTitle className="text-base">{form.name}</CardTitle>
                                  <div className="flex items-center gap-2">
                                    <Badge variant={form.totalScore >= form.passingScore ? "default" : "destructive"}>
                                      {form.totalScore >= form.passingScore ? "Passed" : "Not Passed"}
                                    </Badge>
                                    <span className="text-sm text-gray-500">Score: {form.totalScore}%</span>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent className="py-3">
                                <div className="space-y-3">
                                  {form.metrics.map((metric, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                      <span className="text-sm">{metric.name}</span>
                                      <div className="flex items-center gap-2">
                                        <div className="flex items-center">
                                          {renderStars(metric.score, metric.maxScore)}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <FileText className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Application</h3>
                <p className="text-gray-500">Choose an application from the list to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
