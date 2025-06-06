"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Plus,
  Search,
  MoreVertical,
  Eye,
  Users,
  UserPlus,
  FileText,
  XCircle,
  Megaphone,
  Calendar,
  MapPin,
  DollarSign,
  Briefcase,
  Clock,
  BarChart3,
} from "lucide-react"

// Sample job postings data
const jobPostings = [
  {
    id: 1,
    title: "Senior Software Engineer",
    department: "Engineering",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120k - $160k",
    status: "Active",
    applicants: 45,
    postedDate: "2024-01-15",
    deadline: "2024-02-15",
    description: "We are looking for a Senior Software Engineer to join our growing team...",
  },
  {
    id: 2,
    title: "Product Manager",
    department: "Product",
    location: "New York, NY",
    type: "Full-time",
    salary: "$100k - $140k",
    status: "Draft",
    applicants: 0,
    postedDate: "2024-01-18",
    deadline: "2024-02-20",
    description: "Seeking an experienced Product Manager to drive product strategy...",
  },
  {
    id: 3,
    title: "UX Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
    salary: "$80k - $110k",
    status: "Closed",
    applicants: 67,
    postedDate: "2024-01-10",
    deadline: "2024-01-25",
    description: "Join our design team to create amazing user experiences...",
  },
  {
    id: 4,
    title: "Marketing Specialist",
    department: "Marketing",
    location: "Chicago, IL",
    type: "Part-time",
    salary: "$50k - $70k",
    status: "Paused",
    applicants: 23,
    postedDate: "2024-01-12",
    deadline: "2024-02-10",
    description: "Looking for a creative Marketing Specialist to join our team...",
  },
]

// Sample screening question sets (from prescreening page)
const screeningQuestionSets = [
  {
    id: "sq1",
    name: "Software Engineer Technical Screening",
    description: "Comprehensive screening for software engineering positions",
    questionCount: 5,
  },
  {
    id: "sq2",
    name: "Product Designer Portfolio Review",
    description: "Design-focused screening questions",
    questionCount: 3,
  },
  {
    id: "sq3",
    name: "Marketing Manager Experience Check",
    description: "Marketing-specific questions",
    questionCount: 4,
  },
  {
    id: "sq4",
    name: "General Availability & Culture Fit",
    description: "Basic screening for availability and cultural alignment",
    questionCount: 2,
  },
]

// Sample criteria sets (from matching criteria)
const criteriaSetsList = [
  {
    id: "cs1",
    name: "Senior Developer Requirements",
    description: "5 criteria for senior software engineering roles",
    criteriaCount: 5,
  },
  {
    id: "cs2",
    name: "Entry Level Filter",
    description: "3 criteria for entry-level positions",
    criteriaCount: 3,
  },
  {
    id: "cs3",
    name: "Remote Work Filter",
    description: "4 criteria for remote work positions",
    criteriaCount: 4,
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800"
    case "Draft":
      return "bg-gray-100 text-gray-800"
    case "Closed":
      return "bg-red-100 text-red-800"
    case "Paused":
      return "bg-yellow-100 text-yellow-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Active":
      return "🟢"
    case "Draft":
      return "📝"
    case "Closed":
      return "🔴"
    case "Paused":
      return "⏸️"
    default:
      return "📄"
  }
}

export default function JobPostingPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedJob, setSelectedJob] = useState<(typeof jobPostings)[0] | null>(null)

  // New job form state
  const [newJob, setNewJob] = useState({
    title: "",
    department: "",
    location: "",
    type: "",
    minSalary: "",
    maxSalary: "",
    deadline: "",
    education: "",
    experience: "",
    description: "",
    useScreeningQuestions: false,
    selectedScreeningSet: "",
    useCustomCriteria: false,
    selectedCriteriaSet: "",
  })

  const filteredJobs = jobPostings.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || job.status.toLowerCase() === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleCreateJob = () => {
    console.log("Creating new job:", newJob)
    console.log(
      "Selected screening set:",
      newJob.useScreeningQuestions ? screeningQuestionSets.find((s) => s.id === newJob.selectedScreeningSet) : "None",
    )
    console.log(
      "Selected criteria set:",
      newJob.useCustomCriteria ? criteriaSetsList.find((s) => s.id === newJob.selectedCriteriaSet) : "None",
    )
    setShowCreateDialog(false)
    // Reset form
    setNewJob({
      title: "",
      department: "",
      location: "",
      type: "",
      minSalary: "",
      maxSalary: "",
      deadline: "",
      education: "",
      experience: "",
      description: "",
      useScreeningQuestions: false,
      selectedScreeningSet: "",
      useCustomCriteria: false,
      selectedCriteriaSet: "",
    })
  }

  const handleJobAction = (action: string, jobId: number) => {
    switch (action) {
      case "announce":
        alert(`Announcing job posting ${jobId}`)
        break
      case "withdraw":
        alert(`Withdrawing job posting ${jobId}`)
        break
      case "invite-evaluators":
        alert(`Inviting evaluators for job ${jobId}`)
        break
      case "view-evaluators-form":
        alert(`Viewing evaluators form for job ${jobId}`)
        break
      case "terminate":
        if (confirm(`Are you sure you want to terminate the process for job ${jobId}?`)) {
          alert(`Terminating process for job ${jobId}`)
        }
        break
      default:
        console.log(`${action} for job ${jobId}`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Postings</h1>
          <p className="text-gray-500">Create and manage your job postings</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-[#d2f277] text-black hover:bg-[#c2e267]" onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Job Posting
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Job Posting</DialogTitle>
              <DialogDescription>Fill in the details to create a new job posting.</DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g. Senior Software Engineer"
                    value={newJob.title}
                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department *</Label>
                  <Select
                    value={newJob.department}
                    onValueChange={(value) => setNewJob({ ...newJob, department: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="hr">Human Resources</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="e.g. San Francisco, CA or Remote"
                    value={newJob.location}
                    onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="type">Employment Type *</Label>
                  <Select value={newJob.type} onValueChange={(value) => setNewJob({ ...newJob, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="salary">Salary Range</Label>
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <Input
                        id="minSalary"
                        type="number"
                        placeholder="Min"
                        className="pl-7"
                        value={newJob.minSalary}
                        onChange={(e) => setNewJob({ ...newJob, minSalary: e.target.value })}
                      />
                    </div>
                    <span className="text-gray-500">-</span>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <Input
                        id="maxSalary"
                        type="number"
                        placeholder="Max"
                        className="pl-7"
                        value={newJob.maxSalary}
                        onChange={(e) => setNewJob({ ...newJob, maxSalary: e.target.value })}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Enter values in thousands (e.g., 80 for $80,000)</p>
                </div>
                <div>
                  <Label htmlFor="deadline">Application Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={newJob.deadline}
                    onChange={(e) => setNewJob({ ...newJob, deadline: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="education">Level of Education *</Label>
                  <Select
                    value={newJob.education}
                    onValueChange={(value) => setNewJob({ ...newJob, education: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select education level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high-school">High School</SelectItem>
                      <SelectItem value="associate">Associate Degree</SelectItem>
                      <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                      <SelectItem value="master">Master's Degree</SelectItem>
                      <SelectItem value="phd">PhD/Doctorate</SelectItem>
                      <SelectItem value="professional">Professional Certification</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="experience">Years of Experience *</Label>
                  <Select
                    value={newJob.experience}
                    onValueChange={(value) => setNewJob({ ...newJob, experience: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-1">0-1 years</SelectItem>
                      <SelectItem value="2-3">2-3 years</SelectItem>
                      <SelectItem value="4-5">4-5 years</SelectItem>
                      <SelectItem value="6-8">6-8 years</SelectItem>
                      <SelectItem value="9-12">9-12 years</SelectItem>
                      <SelectItem value="13+">13+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Job Description *</Label>
                <div className="mt-1 border rounded-md">
                  <div className="border-b p-2 bg-gray-50 flex flex-wrap gap-1">
                    <select
                      className="px-2 py-1 text-xs border rounded hover:bg-gray-200"
                      onChange={(e) => document.execCommand("formatBlock", false, e.target.value)}
                      defaultValue=""
                    >
                      <option value="">Format</option>
                      <option value="h1">Heading 1</option>
                      <option value="h2">Heading 2</option>
                      <option value="h3">Heading 3</option>
                      <option value="p">Paragraph</option>
                      <option value="blockquote">Quote</option>
                    </select>
                    <select
                      className="px-2 py-1 text-xs border rounded hover:bg-gray-200"
                      onChange={(e) => document.execCommand("fontSize", false, e.target.value)}
                      defaultValue=""
                    >
                      <option value="">Size</option>
                      <option value="1">Small</option>
                      <option value="3">Normal</option>
                      <option value="5">Large</option>
                      <option value="7">Extra Large</option>
                    </select>
                    <button
                      type="button"
                      className="px-2 py-1 text-xs border rounded hover:bg-gray-200 font-bold"
                      onClick={() => document.execCommand("bold")}
                    >
                      B
                    </button>
                    <button
                      type="button"
                      className="px-2 py-1 text-xs border rounded hover:bg-gray-200 italic"
                      onClick={() => document.execCommand("italic")}
                    >
                      I
                    </button>
                    <button
                      type="button"
                      className="px-2 py-1 text-xs border rounded hover:bg-gray-200 underline"
                      onClick={() => document.execCommand("underline")}
                    >
                      U
                    </button>
                    <button
                      type="button"
                      className="px-2 py-1 text-xs border rounded hover:bg-gray-200"
                      onClick={() => document.execCommand("strikeThrough")}
                    >
                      S̶
                    </button>
                    <div className="w-px h-6 bg-gray-300 mx-1"></div>
                    <select
                      className="px-2 py-1 text-xs border rounded hover:bg-gray-200"
                      onChange={(e) => document.execCommand("foreColor", false, e.target.value)}
                      defaultValue=""
                    >
                      <option value="">Text Color</option>
                      <option value="#000000">Black</option>
                      <option value="#333333">Dark Gray</option>
                      <option value="#666666">Gray</option>
                      <option value="#0a3141">Brand Blue</option>
                      <option value="#d2f277">Brand Green</option>
                      <option value="#dc2626">Red</option>
                      <option value="#059669">Green</option>
                      <option value="#2563eb">Blue</option>
                    </select>
                    <select
                      className="px-2 py-1 text-xs border rounded hover:bg-gray-200"
                      onChange={(e) => document.execCommand("hiliteColor", false, e.target.value)}
                      defaultValue=""
                    >
                      <option value="">Highlight</option>
                      <option value="yellow">Yellow</option>
                      <option value="lightblue">Light Blue</option>
                      <option value="lightgreen">Light Green</option>
                      <option value="pink">Pink</option>
                      <option value="transparent">None</option>
                    </select>
                    <div className="w-px h-6 bg-gray-300 mx-1"></div>
                    <button
                      type="button"
                      className="px-2 py-1 text-xs border rounded hover:bg-gray-200"
                      onClick={() => document.execCommand("justifyLeft")}
                    >
                      ⬅
                    </button>
                    <button
                      type="button"
                      className="px-2 py-1 text-xs border rounded hover:bg-gray-200"
                      onClick={() => document.execCommand("justifyCenter")}
                    >
                      ⬌
                    </button>
                    <button
                      type="button"
                      className="px-2 py-1 text-xs border rounded hover:bg-gray-200"
                      onClick={() => document.execCommand("justifyRight")}
                    >
                      ➡
                    </button>
                    <button
                      type="button"
                      className="px-2 py-1 text-xs border rounded hover:bg-gray-200"
                      onClick={() => document.execCommand("justifyFull")}
                    >
                      ⬌⬌
                    </button>
                    <div className="w-px h-6 bg-gray-300 mx-1"></div>
                    <button
                      type="button"
                      className="px-2 py-1 text-xs border rounded hover:bg-gray-200"
                      onClick={() => document.execCommand("insertUnorderedList")}
                    >
                      • List
                    </button>
                    <button
                      type="button"
                      className="px-2 py-1 text-xs border rounded hover:bg-gray-200"
                      onClick={() => document.execCommand("insertOrderedList")}
                    >
                      1. List
                    </button>
                    <button
                      type="button"
                      className="px-2 py-1 text-xs border rounded hover:bg-gray-200"
                      onClick={() => document.execCommand("indent")}
                    >
                      →|
                    </button>
                    <button
                      type="button"
                      className="px-2 py-1 text-xs border rounded hover:bg-gray-200"
                      onClick={() => document.execCommand("outdent")}
                    >
                      |←
                    </button>
                    <div className="w-px h-6 bg-gray-300 mx-1"></div>
                    <button
                      type="button"
                      className="px-2 py-1 text-xs border rounded hover:bg-gray-200"
                      onClick={() => {
                        const url = prompt("Enter URL:")
                        if (url) document.execCommand("createLink", false, url)
                      }}
                    >
                      🔗 Link
                    </button>
                    <button
                      type="button"
                      className="px-2 py-1 text-xs border rounded hover:bg-gray-200"
                      onClick={() => document.execCommand("unlink")}
                    >
                      🔗❌
                    </button>
                    <button
                      type="button"
                      className="px-2 py-1 text-xs border rounded hover:bg-gray-200"
                      onClick={() => {
                        const url = prompt("Enter image URL:")
                        if (url) document.execCommand("insertImage", false, url)
                      }}
                    >
                      🖼️ Image
                    </button>
                    <div className="w-px h-6 bg-gray-300 mx-1"></div>
                    <button
                      type="button"
                      className="px-2 py-1 text-xs border rounded hover:bg-gray-200"
                      onClick={() => document.execCommand("insertHorizontalRule")}
                    >
                      ―
                    </button>
                    <button
                      type="button"
                      className="px-2 py-1 text-xs border rounded hover:bg-gray-200"
                      onClick={() => document.execCommand("removeFormat")}
                    >
                      🧹 Clear
                    </button>
                    <button
                      type="button"
                      className="px-2 py-1 text-xs border rounded hover:bg-gray-200"
                      onClick={() => document.execCommand("undo")}
                    >
                      ↶ Undo
                    </button>
                    <button
                      type="button"
                      className="px-2 py-1 text-xs border rounded hover:bg-gray-200"
                      onClick={() => document.execCommand("redo")}
                    >
                      ↷ Redo
                    </button>
                  </div>
                  <div
                    contentEditable
                    lang="en"
                    dir="ltr"
                    className="min-h-[200px] p-4 focus:outline-none focus:ring-2 focus:ring-[#d2f277] focus:ring-offset-2 prose prose-sm max-w-none text-left"
                    style={{
                      minHeight: "200px",
                      direction: "ltr",
                      textAlign: "left",
                      unicodeBidi: "bidi-override",
                      writingMode: "horizontal-tb",
                    }}
                    onInput={(e) => {
                      const target = e.target as HTMLDivElement
                      setNewJob({ ...newJob, description: target.innerHTML })
                    }}
                    onPaste={(e) => {
                      e.preventDefault()
                      const text = e.clipboardData.getData("text/plain")
                      document.execCommand("insertText", false, text)
                    }}
                    dangerouslySetInnerHTML={{ __html: newJob.description }}
                    suppressContentEditableWarning={true}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Use the toolbar above to format your job description. You can add headings, lists, links, images, and
                  more.
                </p>
              </div>
              {/* Screening Questions Section */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <input
                    type="checkbox"
                    id="useScreeningQuestions"
                    checked={newJob.useScreeningQuestions}
                    onChange={(e) =>
                      setNewJob({ ...newJob, useScreeningQuestions: e.target.checked, selectedScreeningSet: "" })
                    }
                    className="w-4 h-4"
                  />
                  <Label htmlFor="useScreeningQuestions" className="font-medium">
                    Include Screening Questions
                  </Label>
                </div>

                {newJob.useScreeningQuestions && (
                  <div className="ml-6 space-y-3">
                    <Label htmlFor="screeningSet">Select Screening Question Set</Label>
                    <Select
                      value={newJob.selectedScreeningSet}
                      onValueChange={(value) => setNewJob({ ...newJob, selectedScreeningSet: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a screening question set" />
                      </SelectTrigger>
                      <SelectContent>
                        {screeningQuestionSets.map((set) => (
                          <SelectItem key={set.id} value={set.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{set.name}</span>
                              <span className="text-xs text-gray-500">
                                {set.description} • {set.questionCount} questions
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {newJob.selectedScreeningSet && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-blue-800">
                          <FileText className="w-4 h-4" />
                          <span className="font-medium">
                            {screeningQuestionSets.find((s) => s.id === newJob.selectedScreeningSet)?.name}
                          </span>
                        </div>
                        <p className="text-xs text-blue-600 mt-1">
                          {screeningQuestionSets.find((s) => s.id === newJob.selectedScreeningSet)?.description}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Custom Criteria Section */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <input
                    type="checkbox"
                    id="useCustomCriteria"
                    checked={newJob.useCustomCriteria}
                    onChange={(e) =>
                      setNewJob({ ...newJob, useCustomCriteria: e.target.checked, selectedCriteriaSet: "" })
                    }
                    className="w-4 h-4"
                  />
                  <Label htmlFor="useCustomCriteria" className="font-medium">
                    Apply Custom Criteria
                  </Label>
                </div>

                {newJob.useCustomCriteria && (
                  <div className="ml-6 space-y-3">
                    <Label htmlFor="criteriaSet">Select Criteria Set</Label>
                    <Select
                      value={newJob.selectedCriteriaSet}
                      onValueChange={(value) => setNewJob({ ...newJob, selectedCriteriaSet: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a criteria set" />
                      </SelectTrigger>
                      <SelectContent>
                        {criteriaSetsList.map((set) => (
                          <SelectItem key={set.id} value={set.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{set.name}</span>
                              <span className="text-xs text-gray-500">{set.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {newJob.selectedCriteriaSet && (
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-green-800">
                          <BarChart3 className="w-4 h-4" />
                          <span className="font-medium">
                            {criteriaSetsList.find((s) => s.id === newJob.selectedCriteriaSet)?.name}
                          </span>
                        </div>
                        <p className="text-xs text-green-600 mt-1">
                          {criteriaSetsList.find((s) => s.id === newJob.selectedCriteriaSet)?.description}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateJob} className="bg-[#d2f277] text-black hover:bg-[#c2e267]">
                  Create Job Posting
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {jobPostings.filter((job) => job.status === "Active").length}
            </div>
            <div className="text-sm text-gray-500">Announced Job Posting</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">
              {jobPostings.filter((job) => job.status === "Draft").length}
            </div>
            <div className="text-sm text-gray-500">Withdrawn Job Posting</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-[#0a3141]">
              {jobPostings.reduce((sum, job) => sum + job.applicants, 0)}
            </div>
            <div className="text-sm text-gray-500">Total Applicants</div>
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
                placeholder="Search job titles or departments..."
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
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Job Listings */}
      <div className="grid grid-cols-1 gap-6">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{job.title}</h3>
                    <Badge className={getStatusColor(job.status)}>
                      {getStatusIcon(job.status)} {job.status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {job.department}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {job.type}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {job.salary}
                    </div>
                  </div>
                  <p className="text-gray-600 line-clamp-2">{job.description}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleJobAction("announce", job.id)}>
                      <Megaphone className="w-4 h-4 mr-2" />
                      Announce Job Posting
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleJobAction("withdraw", job.id)}>
                      <XCircle className="w-4 h-4 mr-2" />
                      Withdraw Job Posting
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleJobAction("invite-evaluators", job.id)}>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Invite Evaluators
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleJobAction("view-evaluators-form", job.id)}>
                      <FileText className="w-4 h-4 mr-2" />
                      View Evaluators Form
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleJobAction("terminate", job.id)} className="text-red-600">
                      <XCircle className="w-4 h-4 mr-2" />
                      Terminate Process
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{job.applicants} applicants</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Posted {job.postedDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>Deadline {job.deadline}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedJob(job)}>
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                  <Button
                    size="sm"
                    className="bg-[#d2f277] text-black hover:bg-[#c2e267]"
                    onClick={() => (window.location.href = `/company/jobs/${job.id}/applicants`)}
                  >
                    <Users className="w-4 h-4 mr-1" />
                    View Applicants
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <FileText className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No job postings found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Get started by creating your first job posting."}
            </p>
            {!searchTerm && statusFilter === "all" && (
              <Button onClick={() => setShowCreateDialog(true)} className="bg-[#d2f277] text-black hover:bg-[#c2e267]">
                <Plus className="w-4 h-4 mr-2" />
                Create Job Posting
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Job Details Modal */}
      {selectedJob && (
        <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                {selectedJob.title}
                <Badge className={getStatusColor(selectedJob.status)}>
                  {getStatusIcon(selectedJob.status)} {selectedJob.status}
                </Badge>
              </DialogTitle>
              <DialogDescription>
                {selectedJob.department} • {selectedJob.location} • {selectedJob.type}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-[#0a3141]">{selectedJob.applicants}</div>
                  <div className="text-sm text-gray-500">Applicants</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-green-600">{selectedJob.salary}</div>
                  <div className="text-sm text-gray-500">Salary Range</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">{selectedJob.postedDate}</div>
                  <div className="text-sm text-gray-500">Posted Date</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-orange-600">{selectedJob.deadline}</div>
                  <div className="text-sm text-gray-500">Deadline</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Job Description</h4>
                <div
                  className="text-gray-600 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedJob.description }}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
