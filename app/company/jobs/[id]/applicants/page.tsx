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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

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
  const [noteColorFilter, setNoteColorFilter] = useState("all")
  const [notePinFilter, setNotePinFilter] = useState("all")
  const [noteColorFilterMain, setNoteColorFilterMain] = useState("all")

  const [showCreateCriteriaSetModal, setShowCreateCriteriaSetModal] = useState(false)
  const [showCustomCriteriaModal, setShowCustomCriteriaModal] = useState(false)
  const [criteriaSetName, setCriteriaSetName] = useState("")
  const [selectedCriteria, setSelectedCriteria] = useState<any[]>([])
  const [customCriteria, setCustomCriteria] = useState([
    { id: "remote_work", name: "Remote Work Preference", type: "select", options: ["Yes", "No", "Hybrid"] },
    { id: "salary_range", name: "Expected Salary Range", type: "number", unit: "USD" },
  ])

  // Note Management State
  const [notes, setNotes] = useState<any[]>([
    {
      id: 1,
      applicantId: 1,
      content: "Great portfolio and communication skills. Very impressed with the React projects shown.",
      author: "John Smith",
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-15T10:30:00Z",
      isPinned: true,
      color: "blue",
      tags: ["Top Candidate", "Strong Portfolio"],
      type: "feedback",
    },
    {
      id: 2,
      applicantId: 1,
      content: "Need to follow up on salary expectations. Mentioned $80k-100k range.",
      author: "Sarah Johnson",
      createdAt: "2024-01-14T15:45:00Z",
      updatedAt: "2024-01-14T15:45:00Z",
      isPinned: false,
      color: "yellow",
      tags: ["Follow up", "Salary"],
      type: "reminder",
    },
    {
      id: 3,
      applicantId: 2,
      content: "Concerns about availability - mentioned part-time preference but job is full-time.",
      author: "John Smith",
      createdAt: "2024-01-13T09:15:00Z",
      updatedAt: "2024-01-13T09:15:00Z",
      isPinned: false,
      color: "red",
      tags: ["Concern", "Availability"],
      type: "concern",
    },
  ])

  const [showNotesModal, setShowNotesModal] = useState(false)
  const [showAddNoteModal, setShowAddNoteModal] = useState(false)
  const [editingNote, setEditingNote] = useState<any>(null)
  const [noteContent, setNoteContent] = useState("")
  const [noteColor, setNoteColor] = useState("blue")
  const [noteTags, setNoteTags] = useState<string[]>([])
  const [noteSearch, setNoteSearch] = useState("")
  const [noteFilter, setNoteFilter] = useState("all")

  const defaultCriteria = [
    { id: "gender", name: "Gender", type: "select", options: ["Male", "Female", "Any"] },
    {
      id: "education_level",
      name: "Level of Education",
      type: "select",
      options: ["High School", "Bachelor's Degree", "Master's Degree", "PhD"],
    },
    { id: "years_experience", name: "Years of Experience", type: "number", unit: "years" },
    { id: "age", name: "Age", type: "number", unit: "years" },
    { id: "matching_score", name: "Matching Score", type: "number", unit: "%" },
    { id: "screening_score", name: "Screening Score", type: "number", unit: "%" },
  ]

  const allCriteria = [...defaultCriteria, ...customCriteria]

  const availableNoteTags = [
    "Top Candidate",
    "Follow up",
    "Concern",
    "Strong Portfolio",
    "Good Fit",
    "Salary",
    "Availability",
    "Skills Gap",
    "Culture Fit",
    "Interview Ready",
  ]

  const noteColors = [
    { value: "blue", label: "Blue", class: "bg-blue-100 border-blue-300 text-blue-800" },
    { value: "green", label: "Green", class: "bg-green-100 border-green-300 text-green-800" },
    { value: "yellow", label: "Yellow", class: "bg-yellow-100 border-yellow-300 text-yellow-800" },
    { value: "red", label: "Red", class: "bg-red-100 border-red-300 text-red-800" },
    { value: "purple", label: "Purple", class: "bg-purple-100 border-purple-300 text-purple-800" },
    { value: "gray", label: "Gray", class: "bg-gray-100 border-gray-300 text-gray-800" },
  ]

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

  const getApplicantNotes = (applicantId: number) => {
    return notes.filter((note) => note.applicantId === applicantId)
  }

  const getFilteredNotes = (applicantId: number) => {
    let applicantNotes = getApplicantNotes(applicantId)

    if (noteSearch) {
      applicantNotes = applicantNotes.filter(
        (note) =>
          note.content.toLowerCase().includes(noteSearch.toLowerCase()) ||
          note.tags.some((tag: string) => tag.toLowerCase().includes(noteSearch.toLowerCase())) ||
          note.author.toLowerCase().includes(noteSearch.toLowerCase()),
      )
    }

    if (noteFilter !== "all") {
      applicantNotes = applicantNotes.filter((note) => note.type === noteFilter)
    }

    return applicantNotes.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })
  }

  const getFilteredNotesForQuickView = (applicantId: number) => {
    let applicantNotes = getApplicantNotes(applicantId)

    // Filter by pin status using main filter
    if (notePinFilter === "pinned") {
      applicantNotes = applicantNotes.filter((note) => note.isPinned)
    } else if (notePinFilter === "unpinned") {
      applicantNotes = applicantNotes.filter((note) => !note.isPinned)
    }

    // Filter by color using main filter
    if (noteColorFilterMain !== "all") {
      applicantNotes = applicantNotes.filter((note) => note.color === noteColorFilterMain)
    }

    return applicantNotes.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })
  }

  const handleAddNote = () => {
    if (!noteContent.trim()) return

    const newNote = {
      id: Date.now(),
      applicantId: selectedApplicant.id,
      content: noteContent,
      author: "Current User", // Replace with actual user
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPinned: false,
      color: noteColor,
      tags: noteTags,
      type: noteTags.includes("Concern") ? "concern" : noteTags.includes("Follow up") ? "reminder" : "feedback",
    }

    setNotes([...notes, newNote])
    setNoteContent("")
    setNoteTags([])
    setNoteColor("blue")
    setShowAddNoteModal(false)
  }

  const handleEditNote = (note: any) => {
    setEditingNote(note)
    setNoteContent(note.content)
    setNoteColor(note.color)
    setNoteTags(note.tags)
    setShowAddNoteModal(true)
  }

  const handleUpdateNote = () => {
    if (!noteContent.trim() || !editingNote) return

    const updatedNotes = notes.map((note) =>
      note.id === editingNote.id
        ? {
            ...note,
            content: noteContent,
            color: noteColor,
            tags: noteTags,
            updatedAt: new Date().toISOString(),
            type: noteTags.includes("Concern") ? "concern" : noteTags.includes("Follow up") ? "reminder" : "feedback",
          }
        : note,
    )

    setNotes(updatedNotes)
    setEditingNote(null)
    setNoteContent("")
    setNoteTags([])
    setNoteColor("blue")
    setShowAddNoteModal(false)
  }

  const handleDeleteNote = (noteId: number) => {
    setNotes(notes.filter((note) => note.id !== noteId))
  }

  const handlePinNote = (noteId: number) => {
    setNotes(notes.map((note) => (note.id === noteId ? { ...note, isPinned: !note.isPinned } : note)))
  }

  const handleTagToggle = (tag: string) => {
    setNoteTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const handleAddNoteOld = () => {
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
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-9 gap-4">
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
          <Select value={notePinFilter} onValueChange={setNotePinFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Note Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Notes</SelectItem>
              <SelectItem value="pinned">📌 Pinned Notes</SelectItem>
              <SelectItem value="unpinned">📍 Unpinned Notes</SelectItem>
            </SelectContent>
          </Select>

          <Select value={noteColorFilterMain} onValueChange={setNoteColorFilterMain}>
            <SelectTrigger>
              <SelectValue placeholder="Note Color" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Colors</SelectItem>
              <SelectItem value="blue">🔵 Blue Notes</SelectItem>
              <SelectItem value="green">🟢 Green Notes</SelectItem>
              <SelectItem value="yellow">🟡 Yellow Notes</SelectItem>
              <SelectItem value="red">🔴 Red Notes</SelectItem>
              <SelectItem value="purple">🟣 Purple Notes</SelectItem>
              <SelectItem value="gray">⚪ Gray Notes</SelectItem>
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
                      {getApplicantNotes(applicant.id).length > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <MessageSquare className="w-3 h-3 text-blue-600" />
                          <span className="text-xs text-blue-600">{getApplicantNotes(applicant.id).length} notes</span>
                        </div>
                      )}
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

                        {/* Quick Notes Section */}
                        <div className="mb-6">
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="font-medium text-gray-900">Quick Notes</h3>
                            <Button size="sm" onClick={() => setShowAddNoteModal(true)}>
                              <Plus className="w-4 h-4 mr-2" />
                              Add Note
                            </Button>
                          </div>

                          {/* Replace the old Note Filters section with this simpler version */}
                          {(notePinFilter !== "all" || noteColorFilterMain !== "all") && (
                            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-blue-800">
                                  <span>Active filters:</span>
                                  {notePinFilter !== "all" && (
                                    <Badge variant="outline" className="text-blue-600">
                                      {notePinFilter === "pinned" ? "📌 Pinned" : "📍 Unpinned"}
                                    </Badge>
                                  )}
                                  {noteColorFilterMain !== "all" && (
                                    <Badge variant="outline" className="text-blue-600">
                                      {noteColors.find((c) => c.value === noteColorFilterMain)?.label} Notes
                                    </Badge>
                                  )}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setNotePinFilter("all")
                                    setNoteColorFilterMain("all")
                                  }}
                                  className="text-xs"
                                >
                                  Clear Note Filters
                                </Button>
                              </div>
                            </div>
                          )}

                          {/* Add Note Form */}
                          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                            <div className="space-y-3">
                              <textarea
                                value={noteContent}
                                onChange={(e) => setNoteContent(e.target.value)}
                                placeholder="Add a quick note about this applicant..."
                                className="w-full h-20 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                              <div className="flex justify-between items-center">
                                <div className="flex gap-2">
                                  {noteColors.slice(0, 4).map((color) => (
                                    <button
                                      key={color.value}
                                      onClick={() => setNoteColor(color.value)}
                                      className={`w-6 h-6 rounded-full border-2 ${color.class} ${
                                        noteColor === color.value ? "ring-2 ring-blue-500" : ""
                                      }`}
                                      title={color.label}
                                    />
                                  ))}
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setNoteContent("")
                                      setNoteColor("blue")
                                      setNoteTags([])
                                    }}
                                  >
                                    Clear
                                  </Button>
                                  <Button size="sm" onClick={handleAddNote} disabled={!noteContent.trim()}>
                                    Add Note
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Recent Notes Display */}
                          <div className="space-y-3">
                            {getFilteredNotesForQuickView(selectedApplicant.id)
                              .slice(0, 5)
                              .map((note) => {
                                const colorClass =
                                  noteColors.find((c) => c.value === note.color)?.class ||
                                  "bg-gray-100 border-gray-300 text-gray-800"
                                return (
                                  <div key={note.id} className={`p-3 rounded-lg border ${colorClass} relative`}>
                                    <div className="flex justify-between items-start mb-2">
                                      <div className="flex flex-wrap gap-1">
                                        {note.isPinned && (
                                          <Badge variant="outline" className="text-xs">
                                            📌 Pinned
                                          </Badge>
                                        )}
                                        {note.tags.map((tag: string) => (
                                          <Badge key={tag} variant="secondary" className="text-xs">
                                            {tag}
                                          </Badge>
                                        ))}
                                      </div>
                                      <div className="flex gap-1">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handlePinNote(note.id)}
                                          className="h-6 w-6 p-0"
                                          title={note.isPinned ? "Unpin" : "Pin"}
                                        >
                                          {note.isPinned ? "📌" : "📍"}
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleEditNote(note)}
                                          className="h-6 w-6 p-0"
                                          title="Edit"
                                        >
                                          ✏️
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleDeleteNote(note.id)}
                                          className="h-6 w-6 p-0 text-red-600"
                                          title="Delete"
                                        >
                                          🗑️
                                        </Button>
                                      </div>
                                    </div>
                                    <p className="text-sm mb-2">{note.content}</p>
                                    <div className="flex justify-between items-center text-xs text-gray-500">
                                      <span>By {note.author}</span>
                                      <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                                    </div>
                                  </div>
                                )
                              })}

                            {getFilteredNotesForQuickView(selectedApplicant.id).length === 0 && (
                              <div className="text-center py-4 text-gray-500">
                                <p className="text-sm">
                                  {noteFilter !== "all" || noteColorFilter !== "all"
                                    ? "No notes match the current filters"
                                    : "No notes added yet"}
                                </p>
                              </div>
                            )}

                            {getApplicantNotes(selectedApplicant.id).length > 5 && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowNotesModal(true)}
                                className="w-full"
                              >
                                View All {getApplicantNotes(selectedApplicant.id).length} Notes
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Applicant Evaluation Tabs */}
                <div className="lg:col-span-3 mt-6">
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Applicant Evaluation</h2>
                      <Tabs defaultValue="screening" className="w-full">
                        <TabsList className="grid w-full grid-cols-6">
                          <TabsTrigger value="screening">Screening Questions</TabsTrigger>
                          <TabsTrigger value="matching">Matching Criteria</TabsTrigger>
                          <TabsTrigger value="exam">Exam Management</TabsTrigger>
                          <TabsTrigger value="metrics">Evaluation Metrics</TabsTrigger>
                          <TabsTrigger value="interview">Interview Management</TabsTrigger>
                          <TabsTrigger value="notes">
                            Notes ({getApplicantNotes(selectedApplicant.id).length})
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="screening" className="mt-6">
                          <div className="space-y-4">
                            <h3 className="font-medium text-gray-900">Screening Questions</h3>
                            <div className="space-y-4">
                              <div className="p-4 border border-gray-200 rounded-lg">
                                <h4 className="font-medium text-gray-900 mb-2">
                                  1. Do you have experience with React and Node.js?
                                </h4>
                                <p className="text-sm text-gray-600 mb-2">
                                  Answer: Yes, I have 5+ years of experience with both technologies.
                                </p>
                                <Badge variant="outline" className="text-green-600">
                                  Passed
                                </Badge>
                              </div>
                              <div className="p-4 border border-gray-200 rounded-lg">
                                <h4 className="font-medium text-gray-900 mb-2">
                                  2. Are you available for full-time employment?
                                </h4>
                                <p className="text-sm text-gray-600 mb-2">
                                  Answer: Yes, I am available for full-time employment immediately.
                                </p>
                                <Badge variant="outline" className="text-green-600">
                                  Passed
                                </Badge>
                              </div>
                              <div className="p-4 border border-gray-200 rounded-lg">
                                <h4 className="font-medium text-gray-900 mb-2">
                                  3. What is your expected salary range?
                                </h4>
                                <p className="text-sm text-gray-600 mb-2">Answer: $80,000 - $100,000 annually</p>
                                <Badge variant="outline" className="text-yellow-600">
                                  Review Required
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="matching" className="mt-6">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h3 className="font-medium text-gray-900">Matching Criteria Sets</h3>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => setShowCustomCriteriaModal(true)}>
                                  <Plus className="w-4 h-4 mr-2" />
                                  Define Custom Criteria
                                </Button>
                                <Button size="sm" onClick={() => setShowCreateCriteriaSetModal(true)}>
                                  <Plus className="w-4 h-4 mr-2" />
                                  Create a set of criteria
                                </Button>
                              </div>
                            </div>

                            {/* Existing Criteria Sets */}
                            <div className="space-y-3">
                              <div className="p-4 border border-gray-200 rounded-lg">
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <h4 className="font-medium text-gray-900">Senior Developer Requirements</h4>
                                    <p className="text-sm text-gray-600">5 criteria • Last updated 2 days ago</p>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button variant="ghost" size="sm">
                                      Edit
                                    </Button>
                                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                      Delete
                                    </Button>
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  <Badge variant="outline">Education: Bachelor's+</Badge>
                                  <Badge variant="outline">Experience: 5+ years</Badge>
                                  <Badge variant="outline">Matching Score: ≥80%</Badge>
                                  <Badge variant="outline">Age: 25-45</Badge>
                                  <Badge variant="outline">Gender: Any</Badge>
                                </div>
                              </div>

                              <div className="p-4 border border-gray-200 rounded-lg">
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <h4 className="font-medium text-gray-900">Entry Level Filter</h4>
                                    <p className="text-sm text-gray-600">3 criteria • Last updated 1 week ago</p>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button variant="ghost" size="sm">
                                      Edit
                                    </Button>
                                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                      Delete
                                    </Button>
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  <Badge variant="outline">Education: Bachelor's</Badge>
                                  <Badge variant="outline">Experience: 0-3 years</Badge>
                                  <Badge variant="outline">Screening Score: ≥70%</Badge>
                                </div>
                              </div>
                            </div>

                            {/* Current Applicant Analysis */}
                            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                              <h4 className="font-medium text-blue-900 mb-3">Current Applicant Analysis</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-sm text-blue-800">Education Level</span>
                                    <Badge variant="outline" className="text-green-600">
                                      {selectedApplicant.educationLevel}
                                    </Badge>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-blue-800">Experience</span>
                                    <Badge variant="outline" className="text-green-600">
                                      {selectedApplicant.experienceYears} years
                                    </Badge>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-blue-800">Matching Score</span>
                                    <Badge variant="outline" className="text-green-600">
                                      {selectedApplicant.matchingScore}%
                                    </Badge>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-sm text-blue-800">Screening Score</span>
                                    <Badge variant="outline" className="text-blue-600">
                                      {selectedApplicant.screeningScore}%
                                    </Badge>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-blue-800">Location</span>
                                    <Badge variant="outline" className="text-blue-600">
                                      {selectedApplicant.location}
                                    </Badge>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-blue-800">Criteria Match</span>
                                    <Badge variant="outline" className="text-green-600">
                                      Meets Senior Developer Requirements
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="exam" className="mt-6">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h3 className="font-medium text-gray-900">Exam Management</h3>
                              <Button size="sm">
                                <Plus className="w-4 h-4 mr-2" />
                                Assign New Exam
                              </Button>
                            </div>
                            <div className="space-y-4">
                              <div className="p-4 border border-gray-200 rounded-lg">
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <h4 className="font-medium text-gray-900">
                                      Technical Assessment - React & Node.js
                                    </h4>
                                    <p className="text-sm text-gray-600">Assigned: 2 days ago</p>
                                  </div>
                                  <Badge variant="outline" className="text-blue-600">
                                    In Progress
                                  </Badge>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span>Duration: 2 hours</span>
                                    <span>Time Remaining: 1h 30m</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: "25%" }}></div>
                                  </div>
                                  <p className="text-xs text-gray-500">Progress: 25% completed</p>
                                </div>
                              </div>
                              <div className="p-4 border border-gray-200 rounded-lg">
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <h4 className="font-medium text-gray-900">Coding Challenge - Algorithm Design</h4>
                                    <p className="text-sm text-gray-600">Completed: 1 week ago</p>
                                  </div>
                                  <Badge variant="outline" className="text-green-600">
                                    Completed
                                  </Badge>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span>Score: 85/100</span>
                                    <span>Time Taken: 1h 45m</span>
                                  </div>
                                  <Button variant="outline" size="sm">
                                    View Results
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="metrics" className="mt-6">
                          <div className="space-y-4">
                            <h3 className="font-medium text-gray-900">Evaluation Metrics</h3>
                            <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div className="p-4 border border-gray-200 rounded-lg">
                                  <h4 className="font-medium text-gray-900 mb-3">Performance Scores</h4>
                                  <div className="space-y-3">
                                    <div>
                                      <div className="flex justify-between mb-1">
                                        <span className="text-sm">Technical Skills</span>
                                        <span className="text-sm font-medium">92%</span>
                                      </div>
                                      <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-green-600 h-2 rounded-full" style={{ width: "92%" }}></div>
                                      </div>
                                    </div>
                                    <div>
                                      <div className="flex justify-between mb-1">
                                        <span className="text-sm">Communication</span>
                                        <span className="text-sm font-medium">88%</span>
                                      </div>
                                      <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-green-600 h-2 rounded-full" style={{ width: "88%" }}></div>
                                      </div>
                                    </div>
                                    <div>
                                      <div className="flex justify-between mb-1">
                                        <span className="text-sm">Problem Solving</span>
                                        <span className="text-sm font-medium">85%</span>
                                      </div>
                                      <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: "85%" }}></div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-4">
                                <div className="p-4 border border-gray-200 rounded-lg">
                                  <h4 className="font-medium text-gray-900 mb-3">Evaluation Summary</h4>
                                  <div className="space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-sm">Overall Rating</span>
                                      <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                          <span
                                            key={star}
                                            className={`text-lg ${star <= 4 ? "text-yellow-400" : "text-gray-300"}`}
                                          >
                                            ★
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm">Recommendation</span>
                                      <Badge variant="outline" className="text-green-600">
                                        Highly Recommended
                                      </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm">Culture Fit</span>
                                      <Badge variant="outline" className="text-blue-600">
                                        Excellent
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="interview" className="mt-6">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h3 className="font-medium text-gray-900">Interview Management</h3>
                              <Button size="sm">
                                <Plus className="w-4 h-4 mr-2" />
                                Schedule Interview
                              </Button>
                            </div>
                            <div className="space-y-4">
                              <div className="p-4 border border-gray-200 rounded-lg">
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <h4 className="font-medium text-gray-900">Technical Interview - Round 1</h4>
                                    <p className="text-sm text-gray-600">Scheduled: Tomorrow, 2:00 PM</p>
                                    <p className="text-sm text-gray-600">Interviewer: John Smith (Senior Engineer)</p>
                                  </div>
                                  <Badge variant="outline" className="text-blue-600">
                                    Scheduled
                                  </Badge>
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm">
                                    Reschedule
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    Join Meeting
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    Send Reminder
                                  </Button>
                                </div>
                              </div>
                              <div className="p-4 border border-gray-200 rounded-lg">
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <h4 className="font-medium text-gray-900">HR Interview - Initial Screening</h4>
                                    <p className="text-sm text-gray-600">Completed: 3 days ago</p>
                                    <p className="text-sm text-gray-600">Interviewer: Sarah Johnson (HR Manager)</p>
                                  </div>
                                  <Badge variant="outline" className="text-green-600">
                                    Completed
                                  </Badge>
                                </div>
                                <div className="mt-3">
                                  <h5 className="font-medium text-gray-900 mb-2">Interview Notes:</h5>
                                  <p className="text-sm text-gray-600 mb-2">
                                    Candidate showed excellent communication skills and enthusiasm for the role. Strong
                                    cultural fit and clear career goals.
                                  </p>
                                  <div className="flex justify-between">
                                    <span className="text-sm">Rating: 4.5/5</span>
                                    <Button variant="outline" size="sm">
                                      View Full Report
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="notes" className="mt-6">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h3 className="font-medium text-gray-900">Private Notes</h3>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => setShowNotesModal(true)}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View All Notes
                                </Button>
                                <Button size="sm" onClick={() => setShowAddNoteModal(true)}>
                                  <Plus className="w-4 h-4 mr-2" />
                                  Add Note
                                </Button>
                              </div>
                            </div>

                            {/* Recent Notes Preview */}
                            <div className="space-y-3">
                              {getFilteredNotes(selectedApplicant.id)
                                .slice(0, 3)
                                .map((note) => {
                                  const colorClass =
                                    noteColors.find((c) => c.value === note.color)?.class ||
                                    "bg-gray-100 border-gray-300 text-gray-800"
                                  return (
                                    <div key={note.id} className={`p-4 rounded-lg border-2 ${colorClass} relative`}>
                                      <div className="flex justify-between items-start mb-2">
                                        <div className="flex flex-wrap gap-1">
                                          {note.isPinned && (
                                            <Badge variant="outline" className="text-xs mr-2">
                                              📌 Pinned
                                            </Badge>
                                          )}
                                          {note.tags.map((tag: string) => (
                                            <Badge key={tag} variant="secondary" className="text-xs">
                                              {tag}
                                            </Badge>
                                          ))}
                                        </div>
                                        <div className="flex gap-1">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handlePinNote(note.id)}
                                            className="h-6 w-6 p-0"
                                          >
                                            {note.isPinned ? "📌" : "📍"}
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEditNote(note)}
                                            className="h-6 w-6 p-0"
                                          >
                                            ✏️
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDeleteNote(note.id)}
                                            className="h-6 w-6 p-0 text-red-600"
                                          >
                                            🗑️
                                          </Button>
                                        </div>
                                      </div>
                                      <p className="text-sm mb-2 whitespace-pre-wrap">{note.content}</p>
                                      <div className="flex justify-between items-center text-xs opacity-75">
                                        <span>By {note.author}</span>
                                        <div className="flex gap-2">
                                          <span>Created: {new Date(note.createdAt).toLocaleDateString()}</span>
                                          {note.updatedAt !== note.createdAt && (
                                            <span>Updated: {new Date(note.updatedAt).toLocaleDateString()}</span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  )
                                })}

                              {getApplicantNotes(selectedApplicant.id).length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                  <p>No notes added yet</p>
                                  <p className="text-sm">Add your first note to start documenting feedback</p>
                                </div>
                              )}

                              {getApplicantNotes(selectedApplicant.id).length > 3 && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setShowNotesModal(true)}
                                  className="w-full"
                                >
                                  View All {getApplicantNotes(selectedApplicant.id).length} Notes
                                </Button>
                              )}
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
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

      {/* Create Criteria Set Modal */}
      {showCreateCriteriaSetModal && (
        <Dialog open={showCreateCriteriaSetModal} onOpenChange={setShowCreateCriteriaSetModal}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Criteria Set</DialogTitle>
              <DialogDescription>Define a set of criteria to filter and evaluate applicants</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Set Name</label>
                <Input
                  value={criteriaSetName}
                  onChange={(e) => setCriteriaSetName(e.target.value)}
                  placeholder="e.g., Senior Developer Requirements"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Select Criteria</label>
                <div className="space-y-4">
                  {allCriteria.map((criteria) => (
                    <div key={criteria.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <Checkbox
                          checked={selectedCriteria.some((c) => c.id === criteria.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedCriteria([...selectedCriteria, { ...criteria, operator: "equal", value: "" }])
                            } else {
                              setSelectedCriteria(selectedCriteria.filter((c) => c.id !== criteria.id))
                            }
                          }}
                        />
                        <span className="font-medium">{criteria.name}</span>
                      </div>

                      {selectedCriteria.some((c) => c.id === criteria.id) && (
                        <div className="ml-6 flex gap-3">
                          {criteria.type === "select" ? (
                            <Select
                              value={selectedCriteria.find((c) => c.id === criteria.id)?.value || ""}
                              onValueChange={(value) => {
                                setSelectedCriteria(
                                  selectedCriteria.map((c) => (c.id === criteria.id ? { ...c, value } : c)),
                                )
                              }}
                            >
                              <SelectTrigger className="w-48">
                                <SelectValue placeholder="Select option" />
                              </SelectTrigger>
                              <SelectContent>
                                {criteria.options?.map((option) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <>
                              <Select
                                value={selectedCriteria.find((c) => c.id === criteria.id)?.operator || "equal"}
                                onValueChange={(operator) => {
                                  setSelectedCriteria(
                                    selectedCriteria.map((c) => (c.id === criteria.id ? { ...c, operator } : c)),
                                  )
                                }}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="equal">Equal to</SelectItem>
                                  <SelectItem value="greater">Greater than</SelectItem>
                                  <SelectItem value="less">Less than</SelectItem>
                                  <SelectItem value="between">Between</SelectItem>
                                </SelectContent>
                              </Select>
                              <Input
                                type="number"
                                placeholder={`Value in ${criteria.unit}`}
                                className="w-32"
                                value={selectedCriteria.find((c) => c.id === criteria.id)?.value || ""}
                                onChange={(e) => {
                                  setSelectedCriteria(
                                    selectedCriteria.map((c) =>
                                      c.id === criteria.id ? { ...c, value: e.target.value } : c,
                                    ),
                                  )
                                }}
                              />
                              {selectedCriteria.find((c) => c.id === criteria.id)?.operator === "between" && (
                                <Input
                                  type="number"
                                  placeholder={`Max ${criteria.unit}`}
                                  className="w-32"
                                  value={selectedCriteria.find((c) => c.id === criteria.id)?.maxValue || ""}
                                  onChange={(e) => {
                                    setSelectedCriteria(
                                      selectedCriteria.map((c) =>
                                        c.id === criteria.id ? { ...c, maxValue: e.target.value } : c,
                                      ),
                                    )
                                  }}
                                />
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateCriteriaSetModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  console.log("Creating criteria set:", { name: criteriaSetName, criteria: selectedCriteria })
                  setShowCreateCriteriaSetModal(false)
                  setCriteriaSetName("")
                  setSelectedCriteria([])
                }}
              >
                Create Set
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Custom Criteria Modal */}
      {showCustomCriteriaModal && (
        <Dialog open={showCustomCriteriaModal} onOpenChange={setShowCustomCriteriaModal}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Define Custom Criteria</DialogTitle>
              <DialogDescription>Create custom criteria that can be used in your criteria sets</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Criteria Name</label>
                <Input placeholder="e.g., Remote Work Preference" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Criteria Type</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="select">Multiple Choice</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="boolean">Yes/No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Options (for Multiple Choice)</label>
                <Input placeholder="Enter options separated by commas" />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCustomCriteriaModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  console.log("Creating custom criteria")
                  setShowCustomCriteriaModal(false)
                }}
              >
                Create Criteria
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Notes Management Modal */}
      {showNotesModal && (
        <Dialog open={showNotesModal} onOpenChange={setShowNotesModal}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Notes for {selectedApplicant.name}</DialogTitle>
              <DialogDescription>Manage all private notes and feedback for this applicant</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Search and Filter */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search notes by content, tags, or author..."
                    value={noteSearch}
                    onChange={(e) => setNoteSearch(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={noteFilter} onValueChange={setNoteFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Notes</SelectItem>
                    <SelectItem value="feedback">Feedback</SelectItem>
                    <SelectItem value="reminder">Reminders</SelectItem>
                    <SelectItem value="concern">Concerns</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Notes List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {getFilteredNotes(selectedApplicant.id).map((note) => {
                  const colorClass =
                    noteColors.find((c) => c.value === note.color)?.class || "bg-gray-100 border-gray-300 text-gray-800"
                  return (
                    <div key={note.id} className={`p-4 rounded-lg border-2 ${colorClass} relative`}>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex flex-wrap gap-1">
                          {note.isPinned && (
                            <Badge variant="outline" className="text-xs mr-2">
                              📌 Pinned
                            </Badge>
                          )}
                          {note.tags.map((tag: string) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePinNote(note.id)}
                            className="h-6 w-6 p-0"
                          >
                            {note.isPinned ? "📌" : "📍"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditNote(note)}
                            className="h-6 w-6 p-0"
                          >
                            ✏️
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteNote(note.id)}
                            className="h-6 w-6 p-0 text-red-600"
                          >
                            🗑️
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm mb-2 whitespace-pre-wrap">{note.content}</p>
                      <div className="flex justify-between items-center text-xs opacity-75">
                        <span>By {note.author}</span>
                        <div className="flex gap-2">
                          <span>Created: {new Date(note.createdAt).toLocaleDateString()}</span>
                          {note.updatedAt !== note.createdAt && (
                            <span>Updated: {new Date(note.updatedAt).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {getFilteredNotes(selectedApplicant.id).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No notes found</p>
                  <p className="text-sm">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNotesModal(false)}>
                Close
              </Button>
              <Button onClick={() => setShowAddNoteModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add New Note
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Add/Edit Note Modal */}
      {showAddNoteModal && (
        <Dialog open={showAddNoteModal} onOpenChange={setShowAddNoteModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingNote ? "Edit Note" : "Add New Note"} for {selectedApplicant.name}
              </DialogTitle>
              <DialogDescription>
                Add private feedback, impressions, or reminders about this applicant
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Note Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Note Content</label>
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Enter your note here..."
                  className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <div className="flex gap-2">
                  {noteColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setNoteColor(color.value)}
                      className={`w-8 h-8 rounded-full border-2 ${color.class} ${
                        noteColor === color.value ? "ring-2 ring-blue-500" : ""
                      }`}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>

              {/* Tags Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {availableNoteTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className={`px-3 py-1 text-sm rounded-full border ${
                        noteTags.includes(tag)
                          ? "bg-blue-100 border-blue-300 text-blue-800"
                          : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddNoteModal(false)
                  setEditingNote(null)
                  setNoteContent("")
                  setNoteTags([])
                  setNoteColor("blue")
                }}
              >
                Cancel
              </Button>
              <Button onClick={editingNote ? handleUpdateNote : handleAddNote}>
                {editingNote ? "Update Note" : "Add Note"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
