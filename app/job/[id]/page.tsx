import { Suspense } from "react"
import { notFound } from "next/navigation"
import JobPostDisplay from "@/components/job-post-display"
import { Skeleton } from "@/components/ui/skeleton"

// Mock data based on your models - replace with actual API call
async function getJobPost(id: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  // Mock job post data
  const jobPost = {
    id: id,
    createdAt: "2024-01-15T10:30:00Z",
    jobTitle: "Senior Frontend Developer",
    department: "Engineering",
    location: "San Francisco, CA",
    employmentType: "Full-time",
    minSalary: "$120,000",
    maxSalary: "$180,000",
    applicationDeadline: "2024-02-15T23:59:59Z",
    levelOfEducation: "Bachelor's Degree",
    yearsOfExperience: "3-5 years",
    jobDescription: `We are seeking a talented Senior Frontend Developer to join our dynamic engineering team. You will be responsible for building and maintaining high-quality web applications using modern technologies.

Key Responsibilities:
• Develop and maintain responsive web applications using React, TypeScript, and Next.js
• Collaborate with designers and backend developers to implement user-friendly interfaces
• Optimize applications for maximum speed and scalability
• Write clean, maintainable, and well-documented code
• Participate in code reviews and mentor junior developers
• Stay up-to-date with the latest frontend technologies and best practices

Requirements:
• 3+ years of experience in frontend development
• Strong proficiency in React, TypeScript, and modern JavaScript
• Experience with Next.js, Tailwind CSS, and state management libraries
• Knowledge of RESTful APIs and GraphQL
• Familiarity with version control systems (Git)
• Strong problem-solving skills and attention to detail
• Excellent communication and teamwork abilities

What We Offer:
• Competitive salary and equity package
• Comprehensive health, dental, and vision insurance
• Flexible work arrangements and remote work options
• Professional development opportunities
• Modern office space with great amenities
• Collaborative and inclusive work environment`,
    useScreeningQuestions: true,
    selectedScreeningSet: "frontend-screening-v1",
    useCustomCriteria: true,
    selectedCriteriaSet: "senior-dev-criteria",
    status: "Announced" as const,
    applicants: 47,
    applications: [],
    uid: "company-123",
    company: {
      id: "comp-456",
      uid: "company-123",
      companyName: "TechFlow Solutions",
      companyType: "Technology",
      companySize: "51-200 employees",
      country: "United States",
      cityLocation: "San Francisco",
      officialEmail: "careers@techflow.com",
      officialPhoneCountryCode: "+1",
      officialPhone: "(555) 123-4567",
      websiteUrl: "https://techflow.com",
      fullName: "Sarah Johnson",
      email: "sarah.johnson@techflow.com",
      adminPhoneCountryCode: "+1",
      adminPhone: "(555) 987-6543",
      tinNumber: "12-3456789",
      businessLicenseDocument: null,
      companyLogoDocument: null,
      companyLogoUrl: "/placeholder.svg?height=80&width=80&text=TF",
    },
  }

  return jobPost
}

export default async function JobPostPage({ params }: { params: { id: string } }) {
  try {
    const jobPost = await getJobPost(params.id)

    return (
      <div className="min-h-screen bg-gray-50">
        <Suspense fallback={<JobPostSkeleton />}>
          <JobPostDisplay jobPost={jobPost} />
        </Suspense>
      </div>
    )
  } catch (error) {
    notFound()
  }
}

function JobPostSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Skeleton className="h-96 w-full" />
            </div>
            <div>
              <Skeleton className="h-80 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
