"use client"

import { educationLevels, experienceYears } from "@/app/auth/register/page"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/context/authContext"
import { useToast } from "@/context/toastContext"
import { dateFormat, timestampFormat } from "@/lib/api/dayjs_format"
import { jobPostCollection } from "@/lib/api/firebase/collections"
import { db } from "@/lib/api/firebase/init"
import ApplicantModel from "@/models/applicant"
import JobPostModel from "@/models/jobPost"
import { format } from "date-fns"
import dayjs from "dayjs"
import { doc, onSnapshot, query, where } from "firebase/firestore"
import {
    AlertCircle,
    BarChart3,
    Briefcase,
    Calendar,
    Clock,
    DollarSign,
    Eye,
    FileText,
    MapPin,
    Megaphone,
    MoreVertical,
    Plus,
    Search,
    UserPlus,
    Users,
    XCircle
} from "lucide-react"
import { useEffect, useState } from "react"

// Sample job postings data
const jobPostings = [
    {
        id: "1",
        title: "Senior Software Engineer",
        department: "Engineering",
        location: "San Francisco, CA",
        type: "Full-time",
        salary: "$120k - $160k",
        status: "Active",
        applicants: 45,
        minSalary: "",
        maxSalary: "",
        postedDate: "2024-01-15",
        deadline: "2024-02-15",
        description: "We are looking for a Senior Software Engineer to join our growing team...",
        levelOfEducation: "",
        yearsOfExperience: "",
        useScreeningQuestions: false,
        selectedScreeningSet: "",
        useCustomCriteria: false,
        selectedCriteriaSet: "",
    },
    {
        id: "2",
        title: "Product Manager",
        department: "Product",
        location: "New York, NY",
        type: "Full-time",
        salary: "$100k - $140k",
        status: "Draft",
        applicants: 0,
        minSalary: "",
        maxSalary: "",
        postedDate: "2024-01-18",
        deadline: "2024-02-20",
        description: "Seeking an experienced Product Manager to drive product strategy...",
        levelOfEducation: "",
        yearsOfExperience: "",
        useScreeningQuestions: false,
        selectedScreeningSet: "",
        useCustomCriteria: false,
        selectedCriteriaSet: "",
    },
    {
        id: "3",
        title: "UX Designer",
        department: "Design",
        location: "Remote",
        type: "Full-time",
        salary: "$80k - $110k",
        status: "Closed",
        applicants: 67,
        minSalary: "",
        maxSalary: "",
        postedDate: "2024-01-10",
        deadline: "2024-01-25",
        description: "Join our design team to create amazing user experiences...",
        levelOfEducation: "",
        yearsOfExperience: "",
        useScreeningQuestions: false,
        selectedScreeningSet: "",
        useCustomCriteria: false,
        selectedCriteriaSet: "",
    },
    {
        id: "4",
        title: "Marketing Specialist",
        department: "Marketing",
        location: "Chicago, IL",
        type: "Part-time",
        salary: "$50k - $70k",
        status: "Paused",
        applicants: 23,
        minSalary: "",
        maxSalary: "",
        postedDate: "2024-01-12",
        deadline: "2024-02-10",
        description: "Looking for a creative Marketing Specialist to join our team...",
        levelOfEducation: "",
        yearsOfExperience: "",
        useScreeningQuestions: false,
        selectedScreeningSet: "",
        useCustomCriteria: false,
        selectedCriteriaSet: "",
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

    const [statusCardInfo, setStatusCardInfo] = useState({
        announced: 0,
        withdrawn: 0,
        totalApplicants: 0,
    });

    const [createButtonLoading, setCreateButtonLoading] = useState<boolean>(false);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    const { user } = useAuth();
    const { showToast } = useToast();

    useEffect(() => {
        if (user) {

            let jobs: any[] = [];
            const jobQuery = query(jobPostCollection, where("uid", "==", user.uid ?? ""));
            const unsubscribe = onSnapshot(jobQuery, (snapshot) => {
                jobs = snapshot.docs;
            });

            console.log("jobs: ", jobs);

            return () => unsubscribe(); // Cleanup the listener on unmount

        }
    }, [user]);

    // New job form state
    const [newJob, setNewJob] = useState({
        title: "",
        department: "",
        location: "",
        type: "",
        minSalary: "",
        maxSalary: "",
        deadline: "",
        description: "",
        levelOfEducation: "",
        yearsOfExperience: "",
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

    const validateJobPosting = () => {
        const errors: string[] = [];

        if (!newJob.title.trim()) errors.push("Job title is required");
        if (!newJob.department.trim()) errors.push("Department is required");
        if (!newJob.location.trim()) errors.push("Location is required");
        if (!newJob.type.trim()) errors.push("Employment type is required");
        if (!newJob.deadline.trim()) errors.push("Application deadline is required");
        if (!newJob.levelOfEducation.trim()) errors.push("Level of education is required");
        if (!newJob.yearsOfExperience.trim()) errors.push("Years of experience is required");
        if (!newJob.description.trim()) errors.push("Job description is required");
        if (newJob.useScreeningQuestions && !newJob.selectedScreeningSet.trim()) errors.push("Screening question is required");
        if (newJob.useCustomCriteria && !newJob.selectedCriteriaSet.trim()) errors.push("Custom criteria is required");

        setValidationErrors(errors);
        return errors.length === 0;
    }

    const handleCreateJob = async () => {
        if (!validateJobPosting()) {
            return;
        }

        setCreateButtonLoading(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        console.log("Creating new job:", newJob)

        const jobPost: Omit<JobPostModel, "id"> = {
            ...newJob,
            createdAt: dayjs().format(timestampFormat),
            jobTitle: newJob.title,
            department: newJob.department,
            applicationDeadline: dayjs(newJob.deadline).format(dateFormat),
            jobDescription: newJob.description,
            employmentType: newJob.type,
            uid: `${user?.uid}`,
            useScreeningQuestions: newJob.useScreeningQuestions,
            selectedScreeningSet: newJob.selectedScreeningSet,
        };

        console.log("jobPost: ", jobPost);
        showToast(`Your job ${jobPost.jobTitle} has been created!`, "Success", "success");
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
            description: "",
            levelOfEducation: "",
            yearsOfExperience: "",
            useScreeningQuestions: false,
            selectedScreeningSet: "",
            useCustomCriteria: false,
            selectedCriteriaSet: "",
        });
    }

    const handleJobAction = (action: string, jobId: string) => {
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

                            {/* Validation Errors */}
                            {validationErrors.length > 0 && (
                                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <h4 className="text-sm font-medium text-red-800 mb-2 flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" />
                                        Please fix the following errors:
                                    </h4>
                                    <ul className="text-sm text-red-700 space-y-1">
                                        {validationErrors.map((error, index) => (
                                            <li key={index} className="flex items-center gap-2">
                                                <div className="w-1 h-1 bg-red-500 rounded-full flex-shrink-0" />
                                                {error}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <Separator className="mb-6" />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div>
                                    <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                                        Job Title <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="title"
                                        placeholder="e.g. Senior Software Engineer"
                                        value={newJob.title}
                                        onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                                        className="mt-1 h-12"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="department" className="text-sm font-medium text-gray-700">
                                        Department <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={newJob.department}
                                        onValueChange={(value) => setNewJob({ ...newJob, department: value })}
                                    >
                                        <SelectTrigger className="mt-1 h-12">
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
                                    <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                                        Location <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="location"
                                        placeholder="e.g. San Francisco, CA or Remote"
                                        value={newJob.location}
                                        onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                                        className="mt-1 h-12"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="type" className="text-sm font-medium text-gray-700">
                                        Employment Type <span className="text-red-500">*</span>
                                    </Label>
                                    <Select value={newJob.type} onValueChange={(value) => setNewJob({ ...newJob, type: value })}>
                                        <SelectTrigger className="mt-1 h-12">
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
                                                min={0}
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
                                                min={newJob.minSalary}
                                                placeholder="Max"
                                                className="pl-7"
                                                value={newJob.maxSalary}
                                                onChange={(e) => setNewJob({ ...newJob, maxSalary: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Enter values in thousands (e.g., 80 for $80,000)</p>
                                </div>

                                {/* Application Deadline */}
                                <div>
                                    <Label htmlFor="deadline" className="text-sm font-medium text-gray-700">
                                        Application Deadline  <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="deadline"
                                        type="date"
                                        value={newJob.deadline}
                                        onChange={(e) => setNewJob({ ...newJob, deadline: e.target.value })}
                                        className="mt-1 h-12 p-3 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                                        style={{
                                            textAlign: "center", // Aligns text like DayPicker cells
                                        }}
                                    />
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700">
                                        Level of Education <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={newJob.levelOfEducation}
                                        onValueChange={(value) => setNewJob((prev) => ({ ...prev, levelOfEducation: value }))}
                                    >
                                        <SelectTrigger className="mt-1 h-12">
                                            <SelectValue placeholder="Select education level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {educationLevels.map((level) => (
                                                <SelectItem key={level} value={level}>
                                                    {level}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700">
                                        Years of Experience <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={newJob.yearsOfExperience}
                                        onValueChange={(value) => setNewJob((prev) => ({ ...prev, yearsOfExperience: value }))}
                                    >
                                        <SelectTrigger className="mt-1 h-12">
                                            <SelectValue placeholder="Select experience level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {experienceYears.map((years) => (
                                                <SelectItem key={years} value={years}>
                                                    {years}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                            </div>

                            {/* Job Description */}
                            <div>
                                <Label htmlFor="description">Job Description <span className="text-red-500">*</span></Label>
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
                                        className="min-h-[200px] p-4 focus:outline-none focus:ring-2 focus:ring-[#d2f277] focus:ring-offset-2 prose prose-sm max-w-none direction-ltr"
                                        style={{ minHeight: "200px", direction: "ltr" }}
                                        // dir="ltr" // Explicitly set text direction to LTR
                                        onInput={(e) => {
                                            const target = e.target as HTMLDivElement
                                            target.style.direction = "ltr"; // Force LTR direction on input
                                            setNewJob({ ...newJob, description: target.innerHTML })
                                        }}
                                        onPaste={(e) => {
                                            e.preventDefault()
                                            const text = e.clipboardData.getData("text/plain")
                                            document.execCommand("insertText", true, text)
                                        }}
                                        // dangerouslySetInnerHTML={{ __html: newJob.description }}
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
                            {statusCardInfo.announced}
                        </div>
                        <div className="text-sm text-gray-500">Announced Job Posting</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-gray-600">
                            {statusCardInfo.announced}
                        </div>
                        <div className="text-sm text-gray-500">Withdrawn Job Posting</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-[#0a3141]">
                            {statusCardInfo.totalApplicants}
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

                                    <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm" onClick={() => setSelectedJob(job)}>
                                                <Eye className="w-4 h-4 mr-1" />
                                                View Details
                                            </Button>
                                        </DialogTrigger>

                                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                                            <DialogHeader>
                                                <DialogTitle>Update Job Posting</DialogTitle>
                                                <DialogDescription>Fill in the details to update job posting.</DialogDescription>
                                            </DialogHeader>

                                            <div className="space-y-6 py-4">

                                                {/* Validation Errors */}
                                                {validationErrors.length > 0 && (
                                                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                                        <h4 className="text-sm font-medium text-red-800 mb-2 flex items-center gap-2">
                                                            <AlertCircle className="w-4 h-4" />
                                                            Please fix the following errors:
                                                        </h4>
                                                        <ul className="text-sm text-red-700 space-y-1">
                                                            {validationErrors.map((error, index) => (
                                                                <li key={index} className="flex items-center gap-2">
                                                                    <div className="w-1 h-1 bg-red-500 rounded-full flex-shrink-0" />
                                                                    {error}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                <Separator className="mb-6" />

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                                    <div>
                                                        <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                                                            Job Title <span className="text-red-500">*</span>
                                                        </Label>
                                                        <Input
                                                            id="title"
                                                            placeholder="e.g. Senior Software Engineer"
                                                            value={selectedJob?.title}
                                                            onChange={(e) => setSelectedJob({ ...selectedJob, title: e.target.value } as any)}
                                                            className="mt-1 h-12"
                                                        />
                                                    </div>

                                                    <div>
                                                        <Label htmlFor="department" className="text-sm font-medium text-gray-700">
                                                            Department <span className="text-red-500">*</span>
                                                        </Label>
                                                        <Select
                                                            value={selectedJob?.department}
                                                            onValueChange={(value) => setSelectedJob({ ...selectedJob, department: value } as any)}
                                                        >
                                                            <SelectTrigger className="mt-1 h-12">
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
                                                        <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                                                            Location <span className="text-red-500">*</span>
                                                        </Label>
                                                        <Input
                                                            id="location"
                                                            placeholder="e.g. San Francisco, CA or Remote"
                                                            value={selectedJob?.location}
                                                            onChange={(e) => setSelectedJob({ ...selectedJob, location: e.target.value } as any)}
                                                            className="mt-1 h-12"
                                                        />
                                                    </div>

                                                    <div>
                                                        <Label htmlFor="type" className="text-sm font-medium text-gray-700">
                                                            Employment Type <span className="text-red-500">*</span>
                                                        </Label>
                                                        <Select value={selectedJob?.type} onValueChange={(value) => setSelectedJob({ ...selectedJob, type: value } as any)}>
                                                            <SelectTrigger className="mt-1 h-12">
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
                                                                    min={0}
                                                                    value={selectedJob?.minSalary}
                                                                    onChange={(e) => setSelectedJob({ ...selectedJob, minSalary: e.target.value } as any)}
                                                                />
                                                            </div>
                                                            <span className="text-gray-500">-</span>
                                                            <div className="relative flex-1">
                                                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                                                <Input
                                                                    id="maxSalary"
                                                                    type="number"
                                                                    min={selectedJob?.minSalary}
                                                                    placeholder="Max"
                                                                    className="pl-7"
                                                                    value={selectedJob?.maxSalary}
                                                                    onChange={(e) => setSelectedJob({ ...selectedJob, maxSalary: e.target.value } as any)}
                                                                />
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-gray-500 mt-1">Enter values in thousands (e.g., 80 for $80,000)</p>
                                                    </div>

                                                    {/* Application Deadline */}
                                                    <div>
                                                        <Label htmlFor="deadline" className="text-sm font-medium text-gray-700">
                                                            Application Deadline  <span className="text-red-500">*</span>
                                                        </Label>
                                                        <Input
                                                            id="deadline"
                                                            type="date"
                                                            value={selectedJob?.deadline}
                                                            onChange={(e) => setSelectedJob({ ...selectedJob, deadline: e.target.value } as any)}
                                                            className="mt-1 h-12 p-3 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                                                            style={{
                                                                textAlign: "center", // Aligns text like DayPicker cells
                                                            }}
                                                        />
                                                    </div>

                                                    <div>
                                                        <Label className="text-sm font-medium text-gray-700">
                                                            Level of Education <span className="text-red-500">*</span>
                                                        </Label>
                                                        <Select
                                                            value={selectedJob?.levelOfEducation}
                                                            onValueChange={(value) => setSelectedJob((prev) => ({ ...prev, levelOfEducation: value } as any))}
                                                        >
                                                            <SelectTrigger className="mt-1 h-12">
                                                                <SelectValue placeholder="Select education level" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {educationLevels.map((level) => (
                                                                    <SelectItem key={level} value={level}>
                                                                        {level}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div>
                                                        <Label className="text-sm font-medium text-gray-700">
                                                            Years of Experience <span className="text-red-500">*</span>
                                                        </Label>
                                                        <Select
                                                            value={selectedJob?.yearsOfExperience}
                                                            onValueChange={(value) => setSelectedJob((prev) => ({ ...prev, yearsOfExperience: value } as any))}
                                                        >
                                                            <SelectTrigger className="mt-1 h-12">
                                                                <SelectValue placeholder="Select experience level" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {experienceYears.map((years) => (
                                                                    <SelectItem key={years} value={years}>
                                                                        {years}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                </div>

                                                {/* Job Description */}
                                                <div>
                                                    <Label htmlFor="description">Job Description <span className="text-red-500">*</span></Label>
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
                                                            className="min-h-[200px] p-4 focus:outline-none focus:ring-2 focus:ring-[#d2f277] focus:ring-offset-2 prose prose-sm max-w-none direction-ltr"
                                                            style={{ minHeight: "200px", direction: "ltr" }}
                                                            // dir="ltr" // Explicitly set text direction to LTR
                                                            onInput={(e) => {
                                                                const target = e.target as HTMLDivElement
                                                                target.style.direction = "ltr"; // Force LTR direction on input
                                                                setSelectedJob({ ...selectedJob, description: target.innerHTML } as any)
                                                            }}
                                                            onPaste={(e) => {
                                                                e.preventDefault()
                                                                const text = e.clipboardData.getData("text/plain")
                                                                document.execCommand("insertText", true, text)
                                                            }}
                                                            // dangerouslySetInnerHTML={{ __html: selectedJob?.description }}
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
                                                            checked={selectedJob?.useScreeningQuestions}
                                                            onChange={(e) =>
                                                                setSelectedJob({ ...selectedJob, useScreeningQuestions: e.target.checked, selectedScreeningSet: "" } as any)
                                                            }
                                                            className="w-4 h-4"
                                                        />
                                                        <Label htmlFor="useScreeningQuestions" className="font-medium">
                                                            Include Screening Questions
                                                        </Label>
                                                    </div>

                                                    {selectedJob?.useScreeningQuestions && (
                                                        <div className="ml-6 space-y-3">
                                                            <Label htmlFor="screeningSet">Select Screening Question Set</Label>
                                                            <Select
                                                                value={selectedJob?.selectedScreeningSet}
                                                                onValueChange={(value) => setSelectedJob({ ...selectedJob, selectedScreeningSet: value } as any)}
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
                                                            {selectedJob?.selectedScreeningSet && (
                                                                <div className="p-3 bg-blue-50 rounded-lg">
                                                                    <div className="flex items-center gap-2 text-sm text-blue-800">
                                                                        <FileText className="w-4 h-4" />
                                                                        <span className="font-medium">
                                                                            {screeningQuestionSets.find((s) => s.id === selectedJob?.selectedScreeningSet)?.name}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-xs text-blue-600 mt-1">
                                                                        {screeningQuestionSets.find((s) => s.id === selectedJob?.selectedScreeningSet)?.description}
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
                                                            checked={selectedJob?.useCustomCriteria}
                                                            onChange={(e) =>
                                                                setSelectedJob({ ...selectedJob, useCustomCriteria: e.target.checked, selectedCriteriaSet: "" } as any)
                                                            }
                                                            className="w-4 h-4"
                                                        />
                                                        <Label htmlFor="useCustomCriteria" className="font-medium">
                                                            Apply Custom Criteria
                                                        </Label>
                                                    </div>

                                                    {selectedJob?.useCustomCriteria && (
                                                        <div className="ml-6 space-y-3">
                                                            <Label htmlFor="criteriaSet">Select Criteria Set</Label>
                                                            <Select
                                                                value={selectedJob?.selectedCriteriaSet}
                                                                onValueChange={(value) => setSelectedJob({ ...selectedJob, selectedCriteriaSet: value } as any)}
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
                                                            {selectedJob?.selectedCriteriaSet && (
                                                                <div className="p-3 bg-green-50 rounded-lg">
                                                                    <div className="flex items-center gap-2 text-sm text-green-800">
                                                                        <BarChart3 className="w-4 h-4" />
                                                                        <span className="font-medium">
                                                                            {criteriaSetsList.find((s) => s.id === selectedJob?.selectedCriteriaSet)?.name}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-xs text-green-600 mt-1">
                                                                        {criteriaSetsList.find((s) => s.id === selectedJob?.selectedCriteriaSet)?.description}
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
            {/* {selectedJob && (
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
            )} */}
        </div>
    )
}
