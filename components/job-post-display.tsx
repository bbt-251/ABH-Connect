"use client"

import Image from "next/image"
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  DollarSign,
  GraduationCap,
  Briefcase,
  Building2,
  Globe,
  Phone,
  Mail,
  ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"

interface JobPostDisplayProps {
  jobPost: {
    id: string
    createdAt: string
    jobTitle: string
    department: string
    location: string
    employmentType: string
    minSalary: string
    maxSalary: string
    applicationDeadline: string
    levelOfEducation: string
    yearsOfExperience: string
    jobDescription: string
    useScreeningQuestions: boolean
    selectedScreeningSet: string
    useCustomCriteria: boolean
    selectedCriteriaSet: string
    status: "Draft" | "Announced" | "Withdrawn" | "Terminated"
    applicants: number
    applications: {
      applicationId: string
      applicantId: string
    }[]
    uid: string
    company: {
      id: string
      uid: string
      companyName: string
      companyType: string
      companySize: string
      country: string
      cityLocation: string | null
      officialEmail: string | null
      officialPhoneCountryCode: string
      officialPhone: string | null
      websiteUrl: string | null
      fullName: string
      email: string
      adminPhoneCountryCode: string
      adminPhone: string
      tinNumber: string
      companyLogoUrl: string | null
    }
  }
}

export default function JobPostDisplay({ jobPost }: JobPostDisplayProps) {
  const router = useRouter()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatDescription = (description: string) => {
    return description.split("\n").map((line, index) => {
      if (line.trim() === "") return <br key={index} />
      if (line.startsWith("•")) {
        return (
          <li key={index} className="ml-4 mb-1">
            {line.substring(1).trim()}
          </li>
        )
      }
      if (line.endsWith(":")) {
        return (
          <h4 key={index} className="font-semibold text-gray-900 mt-4 mb-2">
            {line}
          </h4>
        )
      }
      return (
        <p key={index} className="mb-2">
          {line}
        </p>
      )
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Announced":
        return "bg-green-100 text-green-800"
      case "Draft":
        return "bg-yellow-100 text-yellow-800"
      case "Withdrawn":
        return "bg-red-100 text-red-800"
      case "Terminated":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          {/* Back Button */}
          <Button variant="ghost" onClick={() => router.back()} className="mb-6 hover:bg-gray-100">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Button>

          {/* Header Section */}
          <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex gap-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-lg border">
                  <Image
                    src={jobPost.company.companyLogoUrl || "/placeholder.svg?height=64&width=64&text=Logo"}
                    alt={`${jobPost.company.companyName} logo`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{jobPost.jobTitle}</h1>
                  <p className="text-lg text-gray-600">{jobPost.company.companyName}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {jobPost.location}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      {jobPost.employmentType}
                    </Badge>
                    <Badge className={getStatusColor(jobPost.status)}>{jobPost.status}</Badge>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:items-end">
                <Button size="lg" className="bg-[#d2f277] text-black hover:bg-[#c2e267]">
                  Apply Now
                </Button>
                <p className="text-sm text-gray-500">{jobPost.applicants} applicants</p>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Job Description</CardTitle>
                </CardHeader>
                <CardContent className="prose max-w-none">
                  <div className="text-gray-700 leading-relaxed">{formatDescription(jobPost.jobDescription)}</div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Job Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Job Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Salary Range</p>
                      <p className="font-medium">
                        {jobPost.minSalary} - {jobPost.maxSalary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Application Deadline</p>
                      <p className="font-medium">{formatDate(jobPost.applicationDeadline)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Education Level</p>
                      <p className="font-medium">{jobPost.levelOfEducation}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Experience Required</p>
                      <p className="font-medium">{jobPost.yearsOfExperience}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Department</p>
                      <p className="font-medium">{jobPost.department}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Posted</p>
                      <p className="font-medium">{formatDate(jobPost.createdAt)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Company Information */}
              <Card>
                <CardHeader>
                  <CardTitle>About {jobPost.company.companyName}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Industry</p>
                      <p className="font-medium">{jobPost.company.companyType}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Company Size</p>
                      <p className="font-medium">{jobPost.company.companySize}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">
                        {jobPost.company.cityLocation}, {jobPost.company.country}
                      </p>
                    </div>
                  </div>

                  {jobPost.company.websiteUrl && (
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Website</p>
                        <a
                          href={jobPost.company.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:text-blue-800"
                        >
                          Visit Website
                        </a>
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-medium">Contact Information</h4>

                    {jobPost.company.officialEmail && (
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <a
                          href={`mailto:${jobPost.company.officialEmail}`}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          {jobPost.company.officialEmail}
                        </a>
                      </div>
                    )}

                    {jobPost.company.officialPhone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <a
                          href={`tel:${jobPost.company.officialPhoneCountryCode}${jobPost.company.officialPhone}`}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          {jobPost.company.officialPhoneCountryCode} {jobPost.company.officialPhone}
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Apply Button (Mobile) */}
              <div className="lg:hidden">
                <Button size="lg" className="w-full bg-[#d2f277] text-black hover:bg-[#c2e267]">
                  Apply Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
