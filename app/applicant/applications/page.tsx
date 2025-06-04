"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Calendar, MapPin, Building, Eye, MessageSquare, FileText } from "lucide-react"
import Link from "next/link"

const applications = [
  {
    id: 1,
    company: "Google",
    position: "Senior Software Engineer",
    status: "Interview Scheduled",
    appliedDate: "2024-01-15",
    salary: "$150k - $200k",
    location: "Mountain View, CA",
    type: "Full-time",
    logo: "/placeholder.svg?height=40&width=40",
    interviewDate: "2024-01-20",
    notes: "Technical interview scheduled with the engineering team",
  },
  {
    id: 2,
    company: "Microsoft",
    position: "Product Manager",
    status: "Under Review",
    appliedDate: "2024-01-12",
    salary: "$120k - $160k",
    location: "Seattle, WA",
    type: "Full-time",
    logo: "/placeholder.svg?height=40&width=40",
    notes: "Application submitted through company website",
  },
  {
    id: 3,
    company: "Apple",
    position: "UX Designer",
    status: "Applied",
    appliedDate: "2024-01-10",
    salary: "$110k - $140k",
    location: "Cupertino, CA",
    type: "Full-time",
    logo: "/placeholder.svg?height=40&width=40",
    notes: "Portfolio submitted with application",
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
  },
  {
    id: 5,
    company: "Amazon",
    position: "Software Development Engineer",
    status: "Interview Completed",
    appliedDate: "2024-01-08",
    salary: "$140k - $180k",
    location: "Seattle, WA",
    type: "Full-time",
    logo: "/placeholder.svg?height=40&width=40",
    notes: "Waiting for final decision",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Interview Scheduled":
      return "bg-blue-100 text-blue-800"
    case "Under Review":
      return "bg-yellow-100 text-yellow-800"
    case "Applied":
      return "bg-gray-100 text-gray-800"
    case "Rejected":
      return "bg-red-100 text-red-800"
    case "Interview Completed":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function ApplicationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedApplication, setSelectedApplication] = useState<(typeof applications)[0] | null>(null)

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.position.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const statusCounts = {
    all: applications.length,
    applied: applications.filter((app) => app.status === "Applied").length,
    review: applications.filter((app) => app.status === "Under Review").length,
    interview: applications.filter((app) => app.status.includes("Interview")).length,
    rejected: applications.filter((app) => app.status === "Rejected").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-500">Track and manage your job applications</p>
        </div>
        <Link href="/all-jobs">
          <Button className="bg-[#d2f277] text-black hover:bg-[#c2e267]">Apply to New Jobs</Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter("all")}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-[#0a3141]">{statusCounts.all}</div>
            <div className="text-sm text-gray-500">Total</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter("Applied")}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">{statusCounts.applied}</div>
            <div className="text-sm text-gray-500">Applied</div>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setStatusFilter("Under Review")}
        >
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{statusCounts.review}</div>
            <div className="text-sm text-gray-500">Under Review</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter("Interview")}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{statusCounts.interview}</div>
            <div className="text-sm text-gray-500">Interviews</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter("Rejected")}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{statusCounts.rejected}</div>
            <div className="text-sm text-gray-500">Rejected</div>
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Applications</SelectItem>
                <SelectItem value="Applied">Applied</SelectItem>
                <SelectItem value="Under Review">Under Review</SelectItem>
                <SelectItem value="Interview Scheduled">Interview Scheduled</SelectItem>
                <SelectItem value="Interview Completed">Interview Completed</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <Card
              key={application.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedApplication?.id === application.id ? "ring-2 ring-[#0a3141]" : ""
              }`}
              onClick={() => setSelectedApplication(application)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Building className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{application.position}</h3>
                        <p className="text-gray-600">{application.company}</p>
                      </div>
                      <Badge className={getStatusColor(application.status)}>{application.status}</Badge>
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
                      <div className="font-medium text-gray-900">{application.salary}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Application Details */}
        <div className="lg:sticky lg:top-6">
          {selectedApplication ? (
            <Card>
              <CardHeader>
                <CardTitle>Application Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Building className="w-8 h-8 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{selectedApplication.position}</h3>
                    <p className="text-gray-600">{selectedApplication.company}</p>
                    <Badge className={getStatusColor(selectedApplication.status)}>{selectedApplication.status}</Badge>
                  </div>
                </div>

                <div className="space-y-4">
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
                    </div>
                  </div>

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
                  </div>
                </div>
              </CardContent>
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
