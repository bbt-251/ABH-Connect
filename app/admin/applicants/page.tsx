"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Users,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  AlertTriangle,
  Calendar,
  MapPin,
  Briefcase,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react"

interface Applicant {
  id: string
  name: string
  email: string
  phone: string
  location: string
  registrationDate: string
  status: "Active" | "Suspended" | "Deactivated"
  appliedJobs: number
  lastActive: string
  profileCompletion: number
  avatar?: string
}

interface Application {
  id: string
  jobTitle: string
  company: string
  appliedDate: string
  status: "Applied" | "Under Review" | "Interview" | "Offered" | "Rejected" | "Withdrawn"
  lastUpdate: string
}

export default function ApplicantsManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [jobsFilter, setJobsFilter] = useState("all")
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null)
  const [showSuspendModal, setShowSuspendModal] = useState(false)
  const [showFlagModal, setShowFlagModal] = useState(false)
  const [showDeactivateModal, setShowDeactivateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showApplicationHistory, setShowApplicationHistory] = useState(false)
  const [actionReason, setActionReason] = useState("")
  const [deleteType, setDeleteType] = useState<"soft" | "permanent">("soft")
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdown(null)
    }

    if (openDropdown) {
      document.addEventListener("click", handleClickOutside)
    }

    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [openDropdown])

  // Mock data
  const applicants: Applicant[] = [
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "+1 (555) 123-4567",
      location: "New York, NY",
      registrationDate: "2024-01-15",
      status: "Active",
      appliedJobs: 12,
      lastActive: "2024-01-19",
      profileCompletion: 95,
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "+1 (555) 234-5678",
      location: "San Francisco, CA",
      registrationDate: "2024-01-10",
      status: "Active",
      appliedJobs: 8,
      lastActive: "2024-01-18",
      profileCompletion: 88,
    },
    {
      id: "3",
      name: "Mike Wilson",
      email: "mike.wilson@email.com",
      phone: "+1 (555) 345-6789",
      location: "Chicago, IL",
      registrationDate: "2024-01-05",
      status: "Suspended",
      appliedJobs: 25,
      lastActive: "2024-01-16",
      profileCompletion: 72,
    },
    {
      id: "4",
      name: "Emily Davis",
      email: "emily.davis@email.com",
      phone: "+1 (555) 456-7890",
      location: "Austin, TX",
      registrationDate: "2023-12-20",
      status: "Active",
      appliedJobs: 15,
      lastActive: "2024-01-19",
      profileCompletion: 100,
    },
    {
      id: "5",
      name: "David Brown",
      email: "david.brown@email.com",
      phone: "+1 (555) 567-8901",
      location: "Seattle, WA",
      registrationDate: "2023-12-15",
      status: "Deactivated",
      appliedJobs: 3,
      lastActive: "2024-01-10",
      profileCompletion: 45,
    },
  ]

  const mockApplications: Application[] = [
    {
      id: "1",
      jobTitle: "Senior Software Engineer",
      company: "TechCorp Inc.",
      appliedDate: "2024-01-18",
      status: "Under Review",
      lastUpdate: "2024-01-19",
    },
    {
      id: "2",
      jobTitle: "Frontend Developer",
      company: "WebSolutions Ltd.",
      appliedDate: "2024-01-15",
      status: "Interview",
      lastUpdate: "2024-01-17",
    },
    {
      id: "3",
      jobTitle: "Full Stack Developer",
      company: "StartupXYZ",
      appliedDate: "2024-01-12",
      status: "Offered",
      lastUpdate: "2024-01-16",
    },
    {
      id: "4",
      jobTitle: "React Developer",
      company: "DigitalAgency",
      appliedDate: "2024-01-10",
      status: "Rejected",
      lastUpdate: "2024-01-14",
    },
  ]

  const stats = [
    {
      title: "Total Applicants",
      value: "8,932",
      change: "+8%",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Active Applicants",
      value: "8,245",
      change: "+12%",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Suspended",
      value: "45",
      change: "-5%",
      icon: AlertTriangle,
      color: "text-yellow-600",
    },
    {
      title: "Deactivated",
      value: "642",
      change: "+2%",
      icon: XCircle,
      color: "text-red-600",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case "Suspended":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Suspended</Badge>
      case "Deactivated":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Deactivated</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getApplicationStatusBadge = (status: string) => {
    switch (status) {
      case "Applied":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Applied</Badge>
      case "Under Review":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Under Review</Badge>
      case "Interview":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Interview</Badge>
      case "Offered":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Offered</Badge>
      case "Rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>
      case "Withdrawn":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Withdrawn</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const filteredApplicants = applicants.filter((applicant) => {
    const matchesSearch =
      applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || applicant.status === statusFilter
    const matchesLocation = locationFilter === "all" || applicant.location.includes(locationFilter)

    return matchesSearch && matchesStatus && matchesLocation
  })

  const handleAction = (action: string, applicant: Applicant, event: React.MouseEvent<HTMLButtonElement>) => {
    console.log("Action triggered:", action, "for applicant:", applicant.name)
    setSelectedApplicant(applicant)
    setActionReason("")

    switch (action) {
      case "view":
        console.log("View applicant profile:", applicant.id)
        alert(`Viewing profile for ${applicant.name}`)
        break
      case "suspend":
        console.log("Opening suspend modal")
        setShowSuspendModal(true)
        break
      case "flag":
        console.log("Opening flag modal")
        setShowFlagModal(true)
        break
      case "deactivate":
        console.log("Opening deactivate modal")
        setShowDeactivateModal(true)
        break
      case "delete":
        console.log("Opening delete modal")
        setShowDeleteModal(true)
        break
      case "history":
        console.log("Opening application history")
        setShowApplicationHistory(true)
        break
      default:
        console.log("Unknown action:", action)
    }
  }

  const handleConfirmAction = (action: string) => {
    if (!selectedApplicant) return

    console.log(`${action} applicant:`, selectedApplicant.id, "Reason:", actionReason)

    // Close modals
    setShowSuspendModal(false)
    setShowFlagModal(false)
    setShowDeactivateModal(false)
    setShowDeleteModal(false)
    setSelectedApplicant(null)
    setActionReason("")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Applicant Management</h1>
              <p className="text-gray-600 mt-1">Manage all job applicants on the platform</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
                    </div>
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Filter Applicants</CardTitle>
              <Button
                variant="ghost"
                onClick={() => {
                  setStatusFilter("all")
                  setLocationFilter("all")
                  setDateFilter("all")
                  setJobsFilter("all")
                }}
              >
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Suspended">Suspended</SelectItem>
                    <SelectItem value="Deactivated">Deactivated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Location</Label>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="New York">New York</SelectItem>
                    <SelectItem value="California">California</SelectItem>
                    <SelectItem value="Texas">Texas</SelectItem>
                    <SelectItem value="Illinois">Illinois</SelectItem>
                    <SelectItem value="Washington">Washington</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Registration Date</Label>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Dates" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Dates</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Applied Jobs</Label>
                <Select value={jobsFilter} onValueChange={setJobsFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Ranges" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ranges</SelectItem>
                    <SelectItem value="0-5">0-5 Jobs</SelectItem>
                    <SelectItem value="6-15">6-15 Jobs</SelectItem>
                    <SelectItem value="16-25">16-25 Jobs</SelectItem>
                    <SelectItem value="25+">25+ Jobs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applicants Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>All Applicants ({filteredApplicants.length})</CardTitle>
                <CardDescription>Manage and monitor all registered applicants</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applicant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied Jobs
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredApplicants.map((applicant) => (
                    <tr key={applicant.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {applicant.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{applicant.name}</div>
                            <div className="text-sm text-gray-500">Profile: {applicant.profileCompletion}%</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <Mail className="h-4 w-4 mr-1 text-gray-400" />
                          {applicant.email}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Phone className="h-4 w-4 mr-1 text-gray-400" />
                          {applicant.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                          {applicant.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(applicant.status)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <Briefcase className="h-4 w-4 mr-1 text-gray-400" />
                          {applicant.appliedJobs} jobs
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                          {new Date(applicant.registrationDate).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          Last active: {new Date(applicant.lastActive).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="relative inline-block text-left">
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation()
                              console.log("Button clicked for applicant:", applicant.name)
                              setOpenDropdown(openDropdown === applicant.id ? null : applicant.id)
                            }}
                          >
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>

                          {openDropdown === applicant.id && (
                            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                              <div className="py-1">
                                <button
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    console.log("View clicked for:", applicant.name)
                                    handleAction("view", applicant, e)
                                    setOpenDropdown(null)
                                  }}
                                >
                                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    ></path>
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    ></path>
                                  </svg>
                                  View Profile
                                </button>

                                <button
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    console.log("History clicked for:", applicant.name)
                                    handleAction("history", applicant, e)
                                    setOpenDropdown(null)
                                  }}
                                >
                                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    ></path>
                                  </svg>
                                  Application History
                                </button>

                                <hr className="my-1" />

                                <button
                                  className="w-full text-left px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 flex items-center"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    console.log("Suspend clicked for:", applicant.name)
                                    handleAction("suspend", applicant, e)
                                    setOpenDropdown(null)
                                  }}
                                >
                                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                                    ></path>
                                  </svg>
                                  Suspend Account
                                </button>

                                <button
                                  className="w-full text-left px-4 py-2 text-sm text-yellow-600 hover:bg-yellow-50 flex items-center"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    console.log("Flag clicked for:", applicant.name)
                                    handleAction("flag", applicant, e)
                                    setOpenDropdown(null)
                                  }}
                                >
                                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 2H21l-3 6 3 6h-8.5l-1-2H5a2 2 0 00-2 2zm9-13.5V9"
                                    ></path>
                                  </svg>
                                  Flag Account
                                </button>

                                <button
                                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    console.log("Deactivate clicked for:", applicant.name)
                                    handleAction("deactivate", applicant, e)
                                    setOpenDropdown(null)
                                  }}
                                >
                                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    ></path>
                                  </svg>
                                  Deactivate Account
                                </button>

                                <hr className="my-1" />

                                <button
                                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    console.log("Delete clicked for:", applicant.name)
                                    handleAction("delete", applicant, e)
                                    setOpenDropdown(null)
                                  }}
                                >
                                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    ></path>
                                  </svg>
                                  Delete Account
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Suspend Modal */}
      <Dialog open={showSuspendModal} onOpenChange={setShowSuspendModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspend Applicant Account</DialogTitle>
            <DialogDescription>
              Suspend {selectedApplicant?.name}'s account. They will not be able to apply for jobs or access their
              profile.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="suspend-reason">Reason for suspension *</Label>
              <Textarea
                id="suspend-reason"
                placeholder="Enter the reason for suspending this account..."
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSuspendModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => handleConfirmAction("suspend")}
              disabled={!actionReason.trim()}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Suspend Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Flag Modal */}
      <Dialog open={showFlagModal} onOpenChange={setShowFlagModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Flag Applicant Account</DialogTitle>
            <DialogDescription>
              Flag {selectedApplicant?.name}'s account for review. This will mark the account for administrative
              attention.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="flag-reason">Reason for flagging *</Label>
              <Select onValueChange={setActionReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spam_behavior">Spam Behavior</SelectItem>
                  <SelectItem value="fake_info">Fake Information</SelectItem>
                  <SelectItem value="inappropriate_content">Inappropriate Content</SelectItem>
                  <SelectItem value="suspicious_activity">Suspicious Activity</SelectItem>
                  <SelectItem value="policy_violation">Policy Violation</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {actionReason === "other" && (
              <div>
                <Label htmlFor="custom-reason">Custom Reason</Label>
                <Textarea id="custom-reason" placeholder="Please specify the reason..." className="mt-1" />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFlagModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => handleConfirmAction("flag")}
              disabled={!actionReason}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              Flag Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deactivate Modal */}
      <Dialog open={showDeactivateModal} onOpenChange={setShowDeactivateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deactivate Applicant Account</DialogTitle>
            <DialogDescription>
              Deactivate {selectedApplicant?.name}'s account. This will disable their access to the platform.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="deactivate-reason">Reason for deactivation *</Label>
              <Select onValueChange={setActionReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="policy_violation">Policy Violation</SelectItem>
                  <SelectItem value="fake_data">Fake Data/Information</SelectItem>
                  <SelectItem value="terms_violation">Terms of Service Violation</SelectItem>
                  <SelectItem value="spam_activity">Spam Activity</SelectItem>
                  <SelectItem value="user_request">User Request</SelectItem>
                  <SelectItem value="security_concern">Security Concern</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {actionReason === "other" && (
              <div>
                <Label htmlFor="custom-deactivate-reason">Custom Reason</Label>
                <Textarea id="custom-deactivate-reason" placeholder="Please specify the reason..." className="mt-1" />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeactivateModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => handleConfirmAction("deactivate")}
              disabled={!actionReason}
              className="bg-red-600 hover:bg-red-700"
            >
              Deactivate Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Applicant Account</DialogTitle>
            <DialogDescription>
              Delete {selectedApplicant?.name}'s account. Choose between soft delete (can be restored) or permanent
              deletion.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Deletion Type</Label>
              <div className="flex space-x-4 mt-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="soft"
                    checked={deleteType === "soft"}
                    onChange={(e) => setDeleteType(e.target.value as "soft" | "permanent")}
                  />
                  <span>Soft Delete (Recoverable)</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="permanent"
                    checked={deleteType === "permanent"}
                    onChange={(e) => setDeleteType(e.target.value as "soft" | "permanent")}
                  />
                  <span>Permanent Delete</span>
                </label>
              </div>
            </div>
            <div>
              <Label htmlFor="delete-reason">Reason for deletion *</Label>
              <Textarea
                id="delete-reason"
                placeholder="Enter the reason for deleting this account..."
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                className="mt-1"
              />
            </div>
            {deleteType === "permanent" && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-800">
                  <strong>Warning:</strong> Permanent deletion cannot be undone. All applicant data, applications, and
                  history will be permanently removed.
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => handleConfirmAction("delete")}
              disabled={!actionReason.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteType === "permanent" ? "Permanently Delete" : "Soft Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Application History Modal */}
      <Dialog open={showApplicationHistory} onOpenChange={setShowApplicationHistory}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Application History - {selectedApplicant?.name}</DialogTitle>
            <DialogDescription>View all job applications, offers, and communication history</DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{mockApplications.length}</div>
                <div className="text-sm text-blue-600">Total Applications</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">1</div>
                <div className="text-sm text-green-600">Offers Received</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">1</div>
                <div className="text-sm text-purple-600">Interviews</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">2</div>
                <div className="text-sm text-orange-600">Messages Sent</div>
              </div>
            </div>

            {/* Applications List */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Recent Applications</h3>
              <div className="space-y-3">
                {mockApplications.map((application) => (
                  <div key={application.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{application.jobTitle}</h4>
                        <p className="text-sm text-gray-600">{application.company}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Applied: {new Date(application.appliedDate).toLocaleDateString()}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            Updated: {new Date(application.lastUpdate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">{getApplicationStatusBadge(application.status)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApplicationHistory(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
