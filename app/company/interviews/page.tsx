"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Users, FileText, Calendar, Eye, MessageSquare, ChevronDown, ChevronUp } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// Sample interviews data
const interviews = [
  {
    id: 1,
    name: "Senior Software Engineer - Technical Round",
    jobTitle: "Senior Software Engineer",
    jobId: "job-001",
    status: "In Progress",
    scheduledDate: "2024-01-15",
    scheduledTime: "14:00",
    location: "Conference Room A / Zoom",
    evaluators: [
      {
        id: 1,
        name: "John Smith",
        role: "Senior Engineer",
        email: "john.smith@company.com",
        avatar: "/placeholder.svg?height=40&width=40",
        status: "Draft",
      },
      {
        id: 2,
        name: "Sarah Johnson",
        role: "Tech Lead",
        email: "sarah.johnson@company.com",
        avatar: "/placeholder.svg?height=40&width=40",
        status: "Draft",
      },
      {
        id: 3,
        name: "Mike Chen",
        role: "Engineering Manager",
        email: "mike.chen@company.com",
        avatar: "/placeholder.svg?height=40&width=40",
        status: "Draft",
      },
    ],
    evaluationForms: [
      {
        id: 1,
        name: "Technical Skills Assessment",
        evaluatorName: "John Smith",
        status: "Not Started",
        metrics: ["Problem Solving", "Code Quality", "System Design", "Communication"],
        passingScore: 75,
      },
      {
        id: 2,
        name: "Leadership & Collaboration",
        evaluatorName: "Sarah Johnson",
        status: "Not Started",
        metrics: ["Team Leadership", "Communication", "Mentoring", "Decision Making"],
        passingScore: 80,
      },
      {
        id: 3,
        name: "Cultural Fit Assessment",
        evaluatorName: "Mike Chen",
        status: "Not Started",
        metrics: ["Company Values", "Team Collaboration", "Adaptability", "Growth Mindset"],
        passingScore: 70,
      },
    ],
    candidates: [
      {
        id: 1,
        name: "Julia Markunson",
        email: "julia.m@gmail.com",
        avatar: "/placeholder.svg?height=40&width=40",
        matchingScore: 92,
        status: "Confirmed",
        notes: "Strong technical background, excellent portfolio",
      },
      {
        id: 2,
        name: "Darlene Simmons",
        email: "darlene.simmons@email.com",
        avatar: "/placeholder.svg?height=40&width=40",
        matchingScore: 95,
        status: "Confirmed",
        notes: "Senior level experience, leadership potential",
      },
      {
        id: 3,
        name: "Esther Cooper",
        email: "esther.cooper@email.com",
        avatar: "/placeholder.svg?height=40&width=40",
        matchingScore: 98,
        status: "Pending",
        notes: "Exceptional candidate, awaiting confirmation",
      },
    ],
    createdDate: "2024-01-10",
    duration: "2 hours",
  },
  {
    id: 2,
    name: "Senior Software Engineer - Final Round",
    jobTitle: "Senior Software Engineer",
    jobId: "job-001",
    status: "Completed",
    scheduledDate: "2024-01-08",
    scheduledTime: "10:00",
    location: "Conference Room B",
    evaluators: [
      {
        id: 4,
        name: "David Wilson",
        role: "CTO",
        email: "david.wilson@company.com",
        avatar: "/placeholder.svg?height=40&width=40",
        status: "Evaluated",
      },
      {
        id: 5,
        name: "Lisa Brown",
        role: "HR Director",
        email: "lisa.brown@company.com",
        avatar: "/placeholder.svg?height=40&width=40",
        status: "Evaluated",
      },
    ],
    evaluationForms: [
      {
        id: 4,
        name: "Executive Assessment",
        evaluatorName: "David Wilson",
        status: "Completed",
        metrics: ["Strategic Thinking", "Technical Vision", "Leadership Potential"],
        passingScore: 85,
        score: 88,
      },
      {
        id: 5,
        name: "Cultural & Compensation Discussion",
        evaluatorName: "Lisa Brown",
        status: "Completed",
        metrics: ["Cultural Alignment", "Salary Expectations", "Career Goals"],
        passingScore: 75,
        score: 92,
      },
    ],
    candidates: [
      {
        id: 4,
        name: "Robert Johnson",
        email: "robert.johnson@email.com",
        avatar: "/placeholder.svg?height=40&width=40",
        matchingScore: 89,
        status: "Hired",
        notes: "Excellent performance, offer extended and accepted",
      },
    ],
    createdDate: "2024-01-05",
    duration: "1.5 hours",
  },
  {
    id: 3,
    name: "Product Designer - Portfolio Review",
    jobTitle: "Senior Product Designer",
    jobId: "job-002",
    status: "In Progress",
    scheduledDate: "2024-01-12",
    scheduledTime: "15:30",
    location: "Design Studio / Zoom",
    evaluators: [
      {
        id: 6,
        name: "Emma Davis",
        role: "Design Director",
        email: "emma.davis@company.com",
        avatar: "/placeholder.svg?height=40&width=40",
        status: "Draft",
      },
      {
        id: 7,
        name: "Alex Thompson",
        role: "Senior Designer",
        email: "alex.thompson@company.com",
        avatar: "/placeholder.svg?height=40&width=40",
        status: "Draft",
      },
    ],
    evaluationForms: [
      {
        id: 6,
        name: "Design Skills Assessment",
        evaluatorName: "Emma Davis",
        status: "In Progress",
        metrics: ["Design Thinking", "User Experience", "Visual Design", "Prototyping"],
        passingScore: 80,
      },
      {
        id: 7,
        name: "Portfolio & Process Review",
        evaluatorName: "Alex Thompson",
        status: "In Progress",
        metrics: ["Portfolio Quality", "Design Process", "Problem Solving", "Creativity"],
        passingScore: 75,
      },
    ],
    candidates: [
      {
        id: 5,
        name: "Maria Garcia",
        email: "maria.garcia@email.com",
        avatar: "/placeholder.svg?height=40&width=40",
        matchingScore: 87,
        status: "In Progress",
        notes: "Strong portfolio, currently presenting design case study",
      },
      {
        id: 6,
        name: "James Wilson",
        email: "james.wilson@email.com",
        avatar: "/placeholder.svg?height=40&width=40",
        matchingScore: 84,
        status: "Waiting",
        notes: "Next candidate, waiting for current interview to complete",
      },
    ],
    createdDate: "2024-01-09",
    duration: "3 hours",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "In Progress":
      return "bg-yellow-100 text-yellow-800"
    case "Completed":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getEvaluatorStatusColor = (status: string) => {
  switch (status) {
    case "Draft":
      return "bg-yellow-100 text-yellow-800"
    case "Evaluated":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getFormStatusColor = (status: string) => {
  switch (status) {
    case "Not Started":
      return "bg-gray-100 text-gray-800"
    case "In Progress":
      return "bg-blue-100 text-blue-800"
    case "Completed":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getCandidateStatusColor = (status: string) => {
  switch (status) {
    case "Confirmed":
      return "bg-green-100 text-green-800"
    case "Pending":
      return "bg-yellow-100 text-yellow-800"
    case "In Progress":
      return "bg-blue-100 text-blue-800"
    case "Completed":
      return "bg-green-100 text-green-800"
    case "Hired":
      return "bg-purple-100 text-purple-800"
    case "Waiting":
      return "bg-orange-100 text-orange-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function InterviewManagementPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [jobFilter, setJobFilter] = useState("all")
  const [expandedInterviews, setExpandedInterviews] = useState<number[]>([])

  const filteredInterviews = interviews.filter((interview) => {
    const matchesSearch =
      interview.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interview.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || interview.status.toLowerCase() === statusFilter
    const matchesJob = jobFilter === "all" || interview.jobId === jobFilter

    return matchesSearch && matchesStatus && matchesJob
  })

  const toggleExpanded = (interviewId: number) => {
    setExpandedInterviews((prev) =>
      prev.includes(interviewId) ? prev.filter((id) => id !== interviewId) : [...prev, interviewId],
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Interview Management</h1>
          <p className="text-gray-600">Manage and track all interviews for your job postings</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search interviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="in progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={jobFilter} onValueChange={setJobFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by job" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Jobs</SelectItem>
                <SelectItem value="job-001">Senior Software Engineer</SelectItem>
                <SelectItem value="job-002">Senior Product Designer</SelectItem>
                <SelectItem value="job-003">Marketing Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Interviews List */}
      <div className="space-y-4">
        {filteredInterviews.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No interviews found</h3>
              <p className="text-gray-600">No interviews match your current filters.</p>
            </CardContent>
          </Card>
        ) : (
          filteredInterviews.map((interview) => (
            <Card key={interview.id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-lg">{interview.name}</CardTitle>
                      <Badge className={getStatusColor(interview.status)}>{interview.status}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{interview.jobTitle}</p>

                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{interview.evaluators.length} Evaluators</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{interview.candidates.length} Candidates</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Collapsible>
                      <CollapsibleTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => toggleExpanded(interview.id)}>
                          {expandedInterviews.includes(interview.id) ? (
                            <>
                              <ChevronUp className="w-4 h-4 mr-2" />
                              Hide Details
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-4 h-4 mr-2" />
                              View Details
                            </>
                          )}
                        </Button>
                      </CollapsibleTrigger>
                    </Collapsible>
                  </div>
                </div>
              </CardHeader>

              <Collapsible open={expandedInterviews.includes(interview.id)}>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Evaluators */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Evaluators ({interview.evaluators.length})
                        </h4>
                        <div className="space-y-3">
                          {interview.evaluators.map((evaluator) => (
                            <div key={evaluator.id} className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-start gap-3 mb-3">
                                <Avatar className="w-10 h-10 flex-shrink-0">
                                  <AvatarImage src={evaluator.avatar || "/placeholder.svg"} />
                                  <AvatarFallback>
                                    {evaluator.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900">{evaluator.name}</p>
                                  <p className="text-xs text-gray-600">{evaluator.role}</p>
                                  <p className="text-xs text-gray-500">{evaluator.email}</p>
                                </div>
                                <Badge className={getEvaluatorStatusColor(evaluator.status)} variant="outline">
                                  {evaluator.status}
                                </Badge>
                              </div>
                              <Button size="sm" variant="outline" className="w-full">
                                <FileText className="w-4 h-4 mr-1" />
                                Evaluation Form
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Candidates */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Candidates ({interview.candidates.length})
                        </h4>
                        <div className="space-y-3">
                          {interview.candidates.map((candidate) => (
                            <div key={candidate.id} className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-start gap-3 mb-2">
                                <Avatar className="w-10 h-10">
                                  <AvatarImage src={candidate.avatar || "/placeholder.svg"} />
                                  <AvatarFallback>
                                    {candidate.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <p className="text-sm font-medium text-gray-900 truncate">{candidate.name}</p>
                                  </div>
                                  <p className="text-xs text-gray-600 truncate">{candidate.email}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className="text-green-600 text-xs">
                                      {candidate.matchingScore}% match
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              {candidate.notes && (
                                <p className="text-xs text-gray-600 bg-white p-2 rounded border mb-3">
                                  {candidate.notes}
                                </p>
                              )}
                              <div className="flex gap-2 flex-wrap">
                                <Button size="sm" variant="outline">
                                  <Eye className="w-4 h-4 mr-1" />
                                  See Applicant Profile
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                >
                                  <Users className="w-4 h-4 mr-1" />
                                  Hire Candidate
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <MessageSquare className="w-4 h-4 mr-1" />
                                  Reject Candidate
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
