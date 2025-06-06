"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  ArrowLeft,
  MessageSquare,
  Download,
  Eye,
  Plus,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from "lucide-react"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Sample applicants data
const applicants = [
  {
    id: 1,
    name: "Julia Markunson",
    location: "New Zealand",
    employmentType: "Full Time",
    appliedDate: "3 days ago",
    status: "Pending",
    avatar: "/placeholder.svg?height=200&width=200",
    bio: "I'm a seasoned professional, who has worked as freelancer and full-time staff for companies big and small. I only subscribe to strict best practices, so my projects are easy to pick up by any external development team.",
    portfolio: "https://dribbble.com/julia.markunson",
    rate: "$45/hour",
    rateType: "Average",
    seniorityLevel: "Senior",
    phone: "+1 342 5342 3425",
    email: "julia.m@gmail.com",
    desiredCommitment: "Full Time",
    skills: ["UX Design", "UI Design", "Figma", "Sketch", "CRM", "Product Design"],
    yearsExperience: "10-12 years",
    desiredJobTitle: "Senior Product Designer",
    notes: "Applied a while ago. Portfolio is very good, need to check communication skills and culture fit.",
    matchingScore: 92,
    screeningScore: 88,
    educationLevel: "Master's Degree",
    experienceYears: 11,
    matchingCriteria: ["Skills Match", "Experience Level", "Location Preference"],
  },
  {
    id: 2,
    name: "Diane Hawkins",
    location: "Sierra Leone",
    employmentType: "Part Time",
    appliedDate: "3 days ago",
    status: "Reviewed",
    avatar: "/placeholder.svg?height=200&width=200",
    bio: "Creative designer with 8 years of experience in digital product design. Passionate about creating user-centered solutions.",
    portfolio: "https://behance.net/diane.hawkins",
    rate: "$35/hour",
    rateType: "Below Average",
    seniorityLevel: "Mid-level",
    phone: "+232 76 123 456",
    email: "diane.hawkins@email.com",
    desiredCommitment: "Part Time",
    skills: ["UI Design", "Prototyping", "Adobe XD", "Figma", "User Research"],
    yearsExperience: "6-8 years",
    desiredJobTitle: "Product Designer",
    notes: "Strong portfolio, good communication skills. Available for part-time only.",
    matchingScore: 78,
    screeningScore: 82,
    educationLevel: "Bachelor's Degree",
    experienceYears: 7,
    matchingCriteria: ["Skills Match", "Availability"],
  },
  {
    id: 3,
    name: "Darlene Simmons",
    location: "Slovenia",
    employmentType: "Full Time",
    appliedDate: "3 days ago",
    status: "Test Task",
    avatar: "/placeholder.svg?height=200&width=200",
    bio: "Senior UX/UI designer with expertise in enterprise software design. Led design teams in multiple successful projects.",
    portfolio: "https://portfolio.darlene-simmons.com",
    rate: "$55/hour",
    rateType: "Above Average",
    seniorityLevel: "Senior",
    phone: "+386 1 234 5678",
    email: "darlene.simmons@email.com",
    desiredCommitment: "Full Time",
    skills: ["UX Design", "Design Systems", "Leadership", "Figma", "Sketch", "User Testing"],
    yearsExperience: "12+ years",
    desiredJobTitle: "Senior UX Designer",
    notes: "Excellent portfolio and leadership experience. Currently working on test task.",
    matchingScore: 95,
    screeningScore: 91,
    educationLevel: "Master's Degree",
    experienceYears: 14,
    matchingCriteria: ["Skills Match", "Experience Level", "Portfolio Quality"],
  },
  {
    id: 4,
    name: "Theresa Watson",
    location: "Liberia",
    employmentType: "Part Time",
    appliedDate: "3 days ago",
    status: "Interview",
    avatar: "/placeholder.svg?height=200&width=200",
    bio: "Passionate designer focused on mobile app design and user experience optimization.",
    portfolio: "https://theresa-watson.design",
    rate: "$30/hour",
    rateType: "Below Average",
    seniorityLevel: "Mid-level",
    phone: "+231 77 123 456",
    email: "theresa.watson@email.com",
    desiredCommitment: "Part Time",
    skills: ["Mobile Design", "UI Design", "Figma", "Prototyping"],
    yearsExperience: "4-6 years",
    desiredJobTitle: "Mobile App Designer",
    notes: "Good mobile design skills. Interview scheduled for next week.",
    matchingScore: 71,
    screeningScore: 75,
    educationLevel: "Bachelor's Degree",
    experienceYears: 5,
    matchingCriteria: ["Skills Match", "Mobile Experience"],
  },
  {
    id: 5,
    name: "Esther Cooper",
    location: "Norfolk Island",
    employmentType: "Full Time",
    appliedDate: "3 days ago",
    status: "Hired",
    avatar: "/placeholder.svg?height=200&width=200",
    bio: "Experienced product designer with a track record of successful product launches and team leadership.",
    portfolio: "https://esther-cooper.com",
    rate: "$60/hour",
    rateType: "Above Average",
    seniorityLevel: "Senior",
    phone: "+672 3 12345",
    email: "esther.cooper@email.com",
    desiredCommitment: "Full Time",
    skills: ["Product Design", "Design Strategy", "Team Leadership", "Figma", "User Research"],
    yearsExperience: "15+ years",
    desiredJobTitle: "Lead Product Designer",
    notes: "Exceptional candidate. Hired for lead position.",
    matchingScore: 98,
    screeningScore: 96,
    educationLevel: "Master's Degree",
    experienceYears: 16,
    matchingCriteria: ["Skills Match", "Experience Level", "Leadership", "Portfolio Quality"],
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-800"
    case "Reviewed":
      return "bg-blue-100 text-blue-800"
    case "Test Task":
      return "bg-purple-100 text-purple-800"
    case "Interview":
      return "bg-orange-100 text-orange-800"
    case "Hired":
      return "bg-green-100 text-green-800"
    case "Rejected":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const statusSteps = ["Pending", "Reviewed", "Test Task", "Interview", "Hired"]

export default function ApplicantsPage({ params }: { params: { id: string } }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedApplicant, setSelectedApplicant] = useState(applicants[0])
  const [newNote, setNewNote] = useState("")
  const [educationFilter, setEducationFilter] = useState("all")
  const [experienceFilter, setExperienceFilter] = useState("all")
  const [matchingScoreFilter, setMatchingScoreFilter] = useState("all")
  const [screeningScoreFilter, setScreeningScoreFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")
  const [selectedApplicants, setSelectedApplicants] = useState<number[]>([])
  const [matchingCriteriaFilter, setMatchingCriteriaFilter] = useState("all")
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false)

  const filteredApplicants = applicants.filter((applicant) => {
    const matchesSearch = applicant.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || applicant.status.toLowerCase() === statusFilter
    const matchesEducation = educationFilter === "all" || applicant.educationLevel === educationFilter
    const matchesExperience =
      experienceFilter === "all" ||
      (experienceFilter === "0-2" && applicant.experienceYears <= 2) ||
      (experienceFilter === "3-5" && applicant.experienceYears >= 3 && applicant.experienceYears <= 5) ||
      (experienceFilter === "6-10" && applicant.experienceYears >= 6 && applicant.experienceYears <= 10) ||
      (experienceFilter === "10+" && applicant.experienceYears > 10)
    const matchesMatchingScore =
      matchingScoreFilter === "all" ||
      (matchingScoreFilter === "90+" && applicant.matchingScore >= 90) ||
      (matchingScoreFilter === "80-89" && applicant.matchingScore >= 80 && applicant.matchingScore < 90) ||
      (matchingScoreFilter === "70-79" && applicant.matchingScore >= 70 && applicant.matchingScore < 80) ||
      (matchingScoreFilter === "below-70" && applicant.matchingScore < 70)
    const matchesScreeningScore =
      screeningScoreFilter === "all" ||
      (screeningScoreFilter === "90+" && applicant.screeningScore >= 90) ||
      (screeningScoreFilter === "80-89" && applicant.screeningScore >= 80 && applicant.screeningScore < 90) ||
      (screeningScoreFilter === "70-79" && applicant.screeningScore >= 70 && applicant.screeningScore < 80) ||
      (screeningScoreFilter === "below-70" && applicant.screeningScore < 70)
    const matchesLocation = locationFilter === "all" || applicant.location === locationFilter
    const matchesMatchingCriteria =
      matchingCriteriaFilter === "all" || applicant.matchingCriteria.includes(matchingCriteriaFilter)

    return (
      matchesSearch &&
      matchesStatus &&
      matchesEducation &&
      matchesExperience &&
      matchesMatchingScore &&
      matchesScreeningScore &&
      matchesLocation &&
      matchesMatchingCriteria
    )
  })

  const handleAddNote = () => {
    if (newNote.trim()) {
      console.log("Adding note:", newNote)
      setNewNote("")
    }
  }

  const getCurrentStepIndex = (status: string) => {
    return statusSteps.indexOf(status)
  }

  const handleSelectApplicant = (applicantId: number, checked: boolean) => {
    if (checked) {
      setSelectedApplicants((prev) => [...prev, applicantId])
    } else {
      setSelectedApplicants((prev) => prev.filter((id) => id !== applicantId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedApplicants(filteredApplicants.map((a) => a.id))
    } else {
      setSelectedApplicants([])
    }
  }

  const clearSelection = () => {
    setSelectedApplicants([])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href="/company/jobs">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Jobs
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Senior Software Engineer - Applicants</h1>
            <p className="text-sm text-gray-500">{filteredApplicants.length} applicants</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search applicants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="reviewed">Reviewed</SelectItem>
              <SelectItem value="test task">Test Task</SelectItem>
              <SelectItem value="interview">Interview</SelectItem>
              <SelectItem value="hired">Hired</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={educationFilter} onValueChange={setEducationFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Education" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Education</SelectItem>
              <SelectItem value="High School">High School</SelectItem>
              <SelectItem value="Bachelor's Degree">Bachelor's Degree</SelectItem>
              <SelectItem value="Master's Degree">Master's Degree</SelectItem>
              <SelectItem value="PhD">PhD</SelectItem>
            </SelectContent>
          </Select>
          <Select value={experienceFilter} onValueChange={setExperienceFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Experience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Experience</SelectItem>
              <SelectItem value="0-2">0-2 years</SelectItem>
              <SelectItem value="3-5">3-5 years</SelectItem>
              <SelectItem value="6-10">6-10 years</SelectItem>
              <SelectItem value="10+">10+ years</SelectItem>
            </SelectContent>
          </Select>
          <Select value={matchingScoreFilter} onValueChange={setMatchingScoreFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Matching Score" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Scores</SelectItem>
              <SelectItem value="90+">90+</SelectItem>
              <SelectItem value="80-89">80-89</SelectItem>
              <SelectItem value="70-79">70-79</SelectItem>
              <SelectItem value="below-70">Below 70</SelectItem>
            </SelectContent>
          </Select>
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="New Zealand">New Zealand</SelectItem>
              <SelectItem value="Sierra Leone">Sierra Leone</SelectItem>
              <SelectItem value="Slovenia">Slovenia</SelectItem>
              <SelectItem value="Liberia">Liberia</SelectItem>
              <SelectItem value="Norfolk Island">Norfolk Island</SelectItem>
            </SelectContent>
          </Select>
          <Select value={matchingCriteriaFilter} onValueChange={setMatchingCriteriaFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Matching Criteria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Criteria</SelectItem>
              <SelectItem value="Skills Match">Skills Match</SelectItem>
              <SelectItem value="Experience Level">Experience Level</SelectItem>
              <SelectItem value="Location Preference">Location Preference</SelectItem>
              <SelectItem value="Portfolio Quality">Portfolio Quality</SelectItem>
              <SelectItem value="Leadership">Leadership</SelectItem>
              <SelectItem value="Availability">Availability</SelectItem>
              <SelectItem value="Mobile Experience">Mobile Experience</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex h-[calc(100vh-140px)]">
        {/* Applicants List */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium text-gray-900">
                {statusFilter === "all" ? "All" : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}{" "}
                <span className="text-blue-600">{filteredApplicants.length}</span>
              </h2>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedApplicants.length === filteredApplicants.length && filteredApplicants.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm text-gray-600">Select All</span>
              </div>
            </div>

            <div className="space-y-2">
              {filteredApplicants.map((applicant) => (
                <div
                  key={applicant.id}
                  onClick={() => setSelectedApplicant(applicant)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${
                    selectedApplicant.id === applicant.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={applicant.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {applicant.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Checkbox
                          checked={selectedApplicants.includes(applicant.id)}
                          onCheckedChange={(checked) => handleSelectApplicant(applicant.id, checked as boolean)}
                        />
                        <span className="text-sm text-gray-600">Select</span>
                      </div>
                      <h3 className="font-medium text-gray-900 truncate">{applicant.name}</h3>
                      {/* Remove: <p className="text-sm text-gray-500">{applicant.location}</p> */}
                      {/* badges */}
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-green-600">
                          {applicant.matchingScore}% match
                        </Badge>
                        <Badge variant="outline" className="text-blue-600">
                          {applicant.screeningScore}% screen
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{applicant.appliedDate}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Applicant Details */}
        <div className="flex-1 overflow-y-auto">
          {selectedApplicant && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Section */}
                <div className="lg:col-span-3">
                  <Card>
                    <CardContent className="p-6">
                      {/* 1st Section: Personal Info */}
                      <div className="flex items-start gap-6 mb-6 pb-6 border-b border-gray-200">
                        <Avatar className="w-24 h-24">
                          <AvatarImage src={selectedApplicant.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-2xl">
                            {selectedApplicant.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h1 className="text-2xl font-bold text-gray-900 mb-1">{selectedApplicant.name}</h1>
                              <p className="text-sm text-gray-600 mb-1">
                                <span className="font-medium">Phone:</span> {selectedApplicant.phone}
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Email:</span> {selectedApplicant.email}
                              </p>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuItem onClick={() => alert("Send Message clicked")}>
                                  <MessageSquare className="w-4 h-4 mr-2" />
                                  Send Message
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => alert("Download CV clicked")}>
                                  <Download className="w-4 h-4 mr-2" />
                                  Download CV
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => alert("View Portfolio clicked")}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Portfolio
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => alert("Generate Profile clicked")}>
                                  <Plus className="w-4 h-4 mr-2" />
                                  Generate Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => alert("Export Applicants clicked")}>
                                  <Download className="w-4 h-4 mr-2" />
                                  Export Applicants
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => alert("Assign Exam clicked")}>
                                  <Plus className="w-4 h-4 mr-2" />
                                  Assign Exam
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => alert("Evaluate Applicants Exams clicked")}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  Evaluate Applicants Exams
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => alert("Proceed to Interview clicked")}>
                                  <Plus className="w-4 h-4 mr-2" />
                                  Proceed to Interview
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => alert("Hire Applicants clicked")}
                                  className="bg-gray-900 text-white focus:bg-gray-800 focus:text-white"
                                >
                                  <Plus className="w-4 h-4 mr-2" />
                                  Hire Applicants
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>

                      {/* 2nd Section: Experience Summary */}
                      <div className="mb-6 pb-6 border-b border-gray-200">
                        <h3 className="font-medium text-gray-900 mb-3">Experience Summary</h3>
                        <p className="text-gray-600 leading-relaxed">{selectedApplicant.bio}</p>
                        <div className="mt-3">
                          <a
                            href={selectedApplicant.portfolio}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                          >
                            Portfolio: {selectedApplicant.portfolio}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>

                      {/* 3rd Section: Key Data */}
                      <div className="grid grid-cols-4 gap-6 mb-6 pb-6 border-b border-gray-200">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <h3 className="font-medium text-gray-900 mb-1">Matching Score</h3>
                          <p className="text-2xl font-bold text-green-600">{selectedApplicant.matchingScore}%</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <h3 className="font-medium text-gray-900 mb-1">Screening Score</h3>
                          <p className="text-2xl font-bold text-blue-600">{selectedApplicant.screeningScore}%</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <h3 className="font-medium text-gray-900 mb-1">Education</h3>
                          <p className="text-lg font-semibold">{selectedApplicant.educationLevel}</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <h3 className="font-medium text-gray-900 mb-1">Experience</h3>
                          <p className="text-lg font-semibold">{selectedApplicant.experienceYears} years</p>
                        </div>
                      </div>

                      {/* 4th Section: Work Experience Details */}
                      <div className="mb-6 pb-6 border-b border-gray-200">
                        <h3 className="font-medium text-gray-900 mb-3">Work Experience</h3>
                        <div className="space-y-4">
                          <div className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex justify-between">
                              <div>
                                <h4 className="font-semibold text-gray-900">Senior Product Designer</h4>
                                <p className="text-gray-600">TechCorp Inc.</p>
                              </div>
                              <div className="text-sm text-gray-500">Mar 2020 - Jan 2024</div>
                            </div>
                            <div className="mt-3">
                              <p className="text-sm text-gray-700 whitespace-pre-line">
                                • Led development of customer-facing web applications using React and Node.js •
                                Collaborated with cross-functional teams to deliver features on time • Mentored 3 junior
                                developers and conducted code reviews • Implemented CI/CD pipelines reducing deployment
                                time by 60% • Optimized application performance resulting in 40% faster load times
                              </p>
                            </div>
                            <div className="mt-3 text-sm">
                              <span className="font-medium">Reference:</span> Jane Smith - Engineering Manager -
                              jane.smith@techcorp.com
                            </div>
                          </div>
                          <div className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex justify-between">
                              <div>
                                <h4 className="font-semibold text-gray-900">{selectedApplicant.desiredJobTitle}</h4>
                                <p className="text-gray-600">Previous Company</p>
                              </div>
                              <div className="text-sm text-gray-500">Jan 2018 - Feb 2020</div>
                            </div>
                            <div className="mt-3">
                              <p className="text-sm text-gray-700">
                                Previous work experience details would be displayed here.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 5th Section: Education Experience Details */}
                      <div className="mb-6 pb-6 border-b border-gray-200">
                        <h3 className="font-medium text-gray-900 mb-3">Education</h3>
                        <div className="space-y-4">
                          <div className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex justify-between">
                              <div>
                                <h4 className="font-semibold text-gray-900">Bachelor of Science in Computer Science</h4>
                                <p className="text-gray-600">University of California, Berkeley</p>
                              </div>
                              <div className="text-sm text-gray-500">Sep 2014 - May 2018</div>
                            </div>
                            <div className="mt-2">
                              <Badge variant="outline">{selectedApplicant.educationLevel}</Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 6th Section: Skills, Languages and Certifications */}
                      <div>
                        <div className="mb-6">
                          <h3 className="font-medium text-gray-900 mb-3">Skills</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedApplicant.skills.map((skill, index) => (
                              <Badge key={index} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="mb-6">
                          <h3 className="font-medium text-gray-900 mb-3">Languages</h3>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="text-blue-600">
                              English (Fluent)
                            </Badge>
                            <Badge variant="outline" className="text-blue-600">
                              Spanish (Intermediate)
                            </Badge>
                            <Badge variant="outline" className="text-blue-600">
                              French (Basic)
                            </Badge>
                          </div>
                        </div>

                        <div className="mb-6">
                          <h3 className="font-medium text-gray-900 mb-3">Certifications</h3>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                              <div>
                                <p className="font-medium">AWS Certified Solutions Architect</p>
                                <p className="text-sm text-gray-500">Amazon Web Services • Expires Dec 2024</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                              <div>
                                <p className="font-medium">React Developer Certification</p>
                                <p className="text-sm text-gray-500">Meta • Issued Jan 2023</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mb-6">
                          <h3 className="font-medium text-gray-900 mb-3">Matching Criteria</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedApplicant.matchingCriteria.map((criteria, index) => (
                              <Badge key={index} variant="outline" className="text-green-600">
                                {criteria}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar - Removed */}
                <div className="space-y-6">{/* Content removed - moved to dropdown menu */}</div>
              </div>
            </div>
          )}
        </div>

        {/* Selection Panel */}
        <div
          className={`${isPanelCollapsed ? "w-12" : "w-80"} bg-white border-l border-gray-200 overflow-y-auto transition-all duration-300 flex-shrink-0`}
        >
          {isPanelCollapsed ? (
            <div className="p-2 h-full">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPanelCollapsed(false)}
                className="w-full h-10 flex items-center justify-center"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {selectedApplicants.length > 0 && (
                <div className="mt-2 text-center">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center mx-auto">
                    {selectedApplicants.length}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-medium text-gray-900">
                  Selected Candidates <span className="text-blue-600">({selectedApplicants.length})</span>
                </h2>
                <div className="flex items-center gap-2">
                  {selectedApplicants.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearSelection}>
                      Clear All
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => setIsPanelCollapsed(true)}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {selectedApplicants.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">No candidates selected</p>
                  <p className="text-gray-400 text-xs mt-1">Select candidates to perform bulk actions</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2 mb-6">
                    {selectedApplicants.map((id) => {
                      const applicant = applicants.find((a) => a.id === id)
                      if (!applicant) return null
                      return (
                        <div key={id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={applicant.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="text-xs">
                              {applicant.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{applicant.name}</p>
                            <p className="text-xs text-gray-500">{applicant.matchingScore}% match</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSelectApplicant(id, false)}
                            className="h-6 w-6 p-0"
                          >
                            ×
                          </Button>
                        </div>
                      )
                    })}
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-900 mb-3">Bulk Actions</h3>
                    <Button className="w-full" variant="outline" size="sm">
                      Export Selected ({selectedApplicants.length})
                    </Button>
                    <Button className="w-full" variant="outline" size="sm">
                      Assign Exam to Selected
                    </Button>
                    <Button className="w-full" variant="outline" size="sm">
                      Send Message to Selected
                    </Button>
                    <Button className="w-full" variant="outline" size="sm">
                      Move to Interview
                    </Button>
                    <Button className="w-full" variant="outline" size="sm">
                      Reject Selected
                    </Button>
                    <Button className="w-full" variant="default" size="sm">
                      Hire Selected
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
