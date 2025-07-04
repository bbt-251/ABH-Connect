"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Search,
  MapPin,
  ChevronDown,
  BookmarkIcon,
  X,
  Briefcase,
  DollarSign,
  ExternalLink,
  Star,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

// Sample data for jobs
const jobListings = [
  {
    id: 1,
    title: "Visual Designer",
    company: "Deloitte",
    location: "Chicago, IL",
    experience: "3 to 5 Years",
    jobType: "Full-Time",
    salary: "$57k - $62k",
    salaryPeriod: "per year",
    logo: "/placeholder.svg?height=40&width=40",
    postedTime: "3 mins ago",
  },
  {
    id: 2,
    title: "Product Designer",
    company: "Grubhub",
    location: "Chicago, IL",
    experience: "3 to 5 Years",
    jobType: "Full-Time",
    salary: "$44k - $52k",
    salaryPeriod: "per year",
    logo: "/placeholder.svg?height=40&width=40",
    postedTime: "17 mins ago",
  },
  {
    id: 3,
    title: "Designer",
    company: "Fray Design Group, INC",
    location: "Chicago, IL",
    experience: "0 to 1 Year",
    jobType: "Paid Internship",
    salary: "$16k",
    salaryPeriod: "per year",
    logo: "/placeholder.svg?height=40&width=40",
    postedTime: "20 mins ago",
  },
  {
    id: 4,
    title: "UX Designer",
    company: "Mintel",
    location: "Chicago, IL",
    experience: "6 to 7 Years",
    jobType: "Full-Time",
    salary: "$49k - $51k",
    salaryPeriod: "per year",
    logo: "/placeholder.svg?height=40&width=40",
    postedTime: "32 mins ago",
  },
]

// Sample data for popular companies
const popularCompanies = [
  { name: "Workday", jobs: 129, logo: "/placeholder.svg?height=24&width=24" },
  { name: "Salesforce", jobs: 86, logo: "/placeholder.svg?height=24&width=24" },
  { name: "Marriott International", jobs: 73, logo: "/placeholder.svg?height=24&width=24" },
  { name: "CarMax", jobs: 62, logo: "/placeholder.svg?height=24&width=24" },
  { name: "SAP America Inc.", jobs: 39, logo: "/placeholder.svg?height=24&width=24" },
  { name: "Deloitte", jobs: 35, logo: "/placeholder.svg?height=24&width=24" },
  { name: "Accenture", jobs: 33, logo: "/placeholder.svg?height=24&width=24" },
  { name: "Alliance Data", jobs: 30, logo: "/placeholder.svg?height=24&width=24" },
]

// Sponsored job listings (looks like regular jobs but sponsored)
const sponsoredJobs = [
  {
    id: "s1",
    title: "Senior Software Engineer",
    company: "TechCorp Solutions",
    location: "Remote",
    experience: "5+ Years",
    jobType: "Full-Time",
    salary: "$120k - $150k",
    salaryPeriod: "per year",
    logo: "/placeholder.svg?height=40&width=40",
    postedTime: "2 hours ago",
    sponsored: true,
    featured: true,
  },
  {
    id: "s2",
    title: "Data Scientist",
    company: "DataDriven Analytics",
    location: "San Francisco, CA",
    experience: "3-5 Years",
    jobType: "Full-Time",
    salary: "$95k - $130k",
    salaryPeriod: "per year",
    logo: "/placeholder.svg?height=40&width=40",
    postedTime: "4 hours ago",
    sponsored: true,
  },
]

// Company spotlight data (very discrete)
const companySpotlights = [
  {
    name: "TechCorp Solutions",
    logo: "/placeholder.svg?height=32&width=32",
    tagline: "Building tomorrow's technology",
    employees: "500+",
    rating: 4.8,
    openJobs: 25,
  },
  {
    name: "GreenTech Innovations",
    logo: "/placeholder.svg?height=32&width=32",
    tagline: "Sustainable tech solutions",
    employees: "200+",
    rating: 4.9,
    openJobs: 15,
  },
  {
    name: "DataDriven Analytics",
    logo: "/placeholder.svg?height=32&width=32",
    tagline: "Data-powered insights",
    employees: "150+",
    rating: 4.7,
    openJobs: 12,
  },
]

// Alternative 1: Native Sponsored Job Card (looks like regular job)
function SponsoredJobCard({ job, onClick, isSelected }: any) {
  return (
    <div
      className={`bg-white p-6 rounded-lg shadow-sm border cursor-pointer relative ${
        isSelected ? "border-[#0a3141] bg-blue-50" : "border-gray-100"
      } ${job.featured ? "border-l-4 border-l-[#d2f277]" : ""}`}
      onClick={() => onClick(job)}
    >
      {job.sponsored && (
        <Badge variant="outline" className="absolute top-4 right-4 text-xs bg-gray-50 text-gray-600">
          Sponsored
        </Badge>
      )}
      {job.featured && <Badge className="absolute top-4 right-20 text-xs bg-[#d2f277] text-black">Featured</Badge>}

      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 shrink-0">
          <Image src={job.logo || "/placeholder.svg"} alt={`${job.company} logo`} width={48} height={48} />
        </div>
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
            <div>
              <h3 className="font-semibold text-lg">{job.title}</h3>
              <p className="text-gray-500">
                {job.company} · {job.location}
              </p>
            </div>
            <button className="text-[#0a3141] flex items-center mt-2 md:mt-0">
              <BookmarkIcon className="w-4 h-4 mr-1" />
              Save Job
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-500">Experience</p>
              <p className="font-medium">{job.experience}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Job Type</p>
              <p className="font-medium">{job.jobType}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Salary</p>
              <p className="font-medium">
                {job.salary} <span className="text-xs text-gray-500">{job.salaryPeriod}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Posted {job.postedTime}</p>
            <Button className="bg-[#d2f277] text-black hover:bg-[#c2e267]">Apply</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Alternative 2: Minimal Company Spotlight Card
function CompanySpotlightCard({ company }: { company: any }) {
  return (
    <div className="bg-white border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-3 mb-3">
        <Image src={company.logo || "/placeholder.svg"} alt={company.name} width={32} height={32} className="rounded" />
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate">{company.name}</h4>
          <p className="text-xs text-gray-500 truncate">{company.tagline}</p>
        </div>
      </div>
      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
        <span className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          {company.employees}
        </span>
        <span className="flex items-center gap-1">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          {company.rating}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[#0a3141]">{company.openJobs} open roles</span>
        <Button size="sm" variant="ghost" className="text-xs h-6 px-2">
          View <ExternalLink className="w-3 h-3 ml-1" />
        </Button>
      </div>
    </div>
  )
}

// Alternative 3: Subtle Text-Only Promotion
function TextOnlyPromotion() {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
      <p className="text-sm text-gray-600 mb-2">
        <span className="font-medium">Looking for top talent?</span> Join 500+ companies finding great candidates.
      </p>
      <Button variant="link" className="text-xs text-[#0a3141] p-0 h-auto">
        Post a job →
      </Button>
    </div>
  )
}

// Alternative 4: Company Logo Carousel (very subtle)
function CompanyLogoCarousel() {
  return (
    <div className="bg-white border border-gray-100 rounded-lg p-4">
      <p className="text-xs text-gray-500 text-center mb-3">Trusted by leading companies</p>
      <div className="flex items-center justify-center gap-4 opacity-60">
        {companySpotlights.map((company, index) => (
          <Image
            key={index}
            src={company.logo || "/placeholder.svg"}
            alt={company.name}
            width={24}
            height={24}
            className="grayscale hover:grayscale-0 transition-all"
          />
        ))}
      </div>
    </div>
  )
}

// Alternative 5: Inline Company Mention (very discrete)
function InlineCompanyMention() {
  return (
    <div className="bg-blue-50 border-l-2 border-blue-200 p-3 rounded-r-lg">
      <p className="text-sm text-gray-700">
        💡 <span className="font-medium">TechCorp Solutions</span> is actively hiring.
        <button className="text-[#0a3141] underline ml-1">See 25 open positions</button>
      </p>
    </div>
  )
}

export default function AllJobsPage() {
  const [jobTitle, setJobTitle] = useState("Designer")
  const [location, setLocation] = useState("Chicago, IL")
  const [email, setEmail] = useState("")
  const [resultsCount, setResultsCount] = useState(284)
  const [selectedJob, setSelectedJob] = useState<any>(null)
  const [adStyle, setAdStyle] = useState<"native" | "spotlight" | "text" | "logos" | "inline">("native")

  // Combine regular and sponsored jobs
  const allJobs = [...sponsoredJobs, ...jobListings]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-[#0a3141] text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8 text-center">Find your dream job</h1>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4">
            <div className="relative bg-white rounded-md">
              <Input
                type="text"
                placeholder="Search job title, keywords or company"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="pl-10 h-12 text-gray-800"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            <div className="relative bg-white rounded-md">
              <Input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10 h-12 text-gray-800"
              />
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            <Button className="h-12 px-8 bg-[#d2f277] text-black hover:bg-[#c2e267]">Search</Button>
          </div>
        </div>
      </section>

      {/* Ad Style Selector (for demo purposes) */}
      <section className="container mx-auto px-4 py-4">
        <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
          <p className="text-sm text-gray-600 mb-2">Advertisement Style Preview:</p>
          <div className="flex gap-2 flex-wrap">
            <Button
              size="sm"
              variant={adStyle === "native" ? "default" : "outline"}
              onClick={() => setAdStyle("native")}
            >
              Native Jobs
            </Button>
            <Button
              size="sm"
              variant={adStyle === "spotlight" ? "default" : "outline"}
              onClick={() => setAdStyle("spotlight")}
            >
              Company Spotlight
            </Button>
            <Button size="sm" variant={adStyle === "text" ? "default" : "outline"} onClick={() => setAdStyle("text")}>
              Text Only
            </Button>
            <Button size="sm" variant={adStyle === "logos" ? "default" : "outline"} onClick={() => setAdStyle("logos")}>
              Logo Carousel
            </Button>
            <Button
              size="sm"
              variant={adStyle === "inline" ? "default" : "outline"}
              onClick={() => setAdStyle("inline")}
            >
              Inline Mention
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="w-full md:w-64 shrink-0 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-lg">Filters</h2>
                <button className="text-[#0a3141] text-sm font-medium">Clear All</button>
              </div>

              {/* Job Type Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-3">JOB TYPE</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium cursor-pointer">All (284)</label>
                    <button className="text-xs text-gray-500">Clear</button>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="full-time" className="mr-2" />
                    <label htmlFor="full-time" className="text-sm">
                      Full Time (146)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="part-time" className="mr-2" />
                    <label htmlFor="part-time" className="text-sm">
                      Part Time (32)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="contract" className="mr-2" />
                    <label htmlFor="contract" className="text-sm">
                      Contract (18)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="internship" className="mr-2" />
                    <label htmlFor="internship" className="text-sm">
                      Internship (81)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="freelance" className="mr-2" />
                    <label htmlFor="freelance" className="text-sm">
                      Freelance (7)
                    </label>
                  </div>
                </div>
              </div>

              {/* Location Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-3">LOCATION</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium cursor-pointer">Chicago, IL (284)</label>
                    <button className="text-xs text-gray-500">Clear</button>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="niles" className="mr-2" />
                    <label htmlFor="niles" className="text-sm">
                      Niles, IL (46)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="oak-brook" className="mr-2" />
                    <label htmlFor="oak-brook" className="text-sm">
                      Oak Brook, IL (39)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="northbrook" className="mr-2" />
                    <label htmlFor="northbrook" className="text-sm">
                      Northbrook, IL (37)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="skokie" className="mr-2" />
                    <label htmlFor="skokie" className="text-sm">
                      Skokie, IL (34)
                    </label>
                  </div>
                  <button className="text-[#0a3141] text-sm font-medium mt-2">More</button>
                </div>
              </div>

              {/* Company Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">COMPANY</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium cursor-pointer">All (284)</label>
                    <button className="text-xs text-gray-500">Clear</button>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="abbott" className="mr-2" />
                    <label htmlFor="abbott" className="text-sm">
                      Abbott (32)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="drivative" className="mr-2" />
                    <label htmlFor="drivative" className="text-sm">
                      Drivative Solutions (18)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="cars" className="mr-2" />
                    <label htmlFor="cars" className="text-sm">
                      Cars.com (29)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="caterpillar" className="mr-2" />
                    <label htmlFor="caterpillar" className="text-sm">
                      Caterpillar Inc. (27)
                    </label>
                  </div>
                  <button className="text-[#0a3141] text-sm font-medium mt-2">More</button>
                </div>
              </div>
            </div>

            {/* Sidebar Advertisements based on selected style */}
            {adStyle === "spotlight" && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-500">FEATURED COMPANIES</h3>
                {companySpotlights.map((company, index) => (
                  <CompanySpotlightCard key={index} company={company} />
                ))}
              </div>
            )}

            {adStyle === "text" && (
              <div className="space-y-4">
                <TextOnlyPromotion />
              </div>
            )}

            {adStyle === "logos" && (
              <div className="space-y-4">
                <CompanyLogoCarousel />
              </div>
            )}
          </div>

          {/* Job Listings */}
          <div className="flex-1">
            {/* Results Count and Sort */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-500">{resultsCount} results found</p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sort By:</span>
                <button className="flex items-center text-sm font-medium">
                  Date Posted <ChevronDown className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>

            {/* Job Cards */}
            <div className="space-y-4">
              {allJobs.map((job, index) => (
                <div key={job.id}>
                  {/* Show different ad styles based on selection */}
                  {adStyle === "native" ? (
                    <SponsoredJobCard job={job} onClick={setSelectedJob} isSelected={selectedJob?.id === job.id} />
                  ) : (
                    <div
                      className={`bg-white p-6 rounded-lg shadow-sm border cursor-pointer ${
                        selectedJob?.id === job.id ? "border-[#0a3141] bg-blue-50" : "border-gray-100"
                      }`}
                      onClick={() => setSelectedJob(job)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 shrink-0">
                          <Image
                            src={job.logo || "/placeholder.svg"}
                            alt={`${job.company} logo`}
                            width={48}
                            height={48}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-lg">{job.title}</h3>
                              <p className="text-gray-500">
                                {job.company} · {job.location}
                              </p>
                            </div>
                            <button className="text-[#0a3141] flex items-center mt-2 md:mt-0">
                              <BookmarkIcon className="w-4 h-4 mr-1" />
                              Save Job
                            </button>
                          </div>

                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-xs text-gray-500">Experience</p>
                              <p className="font-medium">{job.experience}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Job Type</p>
                              <p className="font-medium">{job.jobType}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Salary</p>
                              <p className="font-medium">
                                {job.salary} <span className="text-xs text-gray-500">{job.salaryPeriod}</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500">Posted {job.postedTime}</p>
                            <Button className="bg-[#d2f277] text-black hover:bg-[#c2e267]">Apply</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Inline company mention after 2nd job */}
                  {index === 1 && adStyle === "inline" && (
                    <div className="my-4">
                      <InlineCompanyMention />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Job Detail Panel */}
      {selectedJob && (
        <div className="fixed inset-y-0 right-0 w-[500px] bg-white shadow-xl border-l border-gray-200 z-50 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">{selectedJob.title}</h2>
              <button onClick={() => setSelectedJob(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Image src={selectedJob.logo || "/placeholder.svg"} alt={selectedJob.company} width={40} height={40} />
                <div>
                  <h3 className="font-medium">{selectedJob.company}</h3>
                  <p className="text-sm text-gray-500">
                    {selectedJob.location} • {selectedJob.postedTime} • 796 applicants
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                  {selectedJob.jobType}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Remote</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">Senior Level</span>
                {selectedJob.sponsored && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Sponsored</span>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{selectedJob.jobType} • Senior level</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{selectedJob.location} (Remote)</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">
                    {selectedJob.salary} {selectedJob.salaryPeriod}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 text-gray-400">👥</span>
                  <span className="text-sm">1-10 employees • Staffing and Recruiting</span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Skills:</span> User Interface Design, E-Commerce, Product Management,
                  Agile Methodologies, +8 more
                </p>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 bg-[#d2f277] text-black hover:bg-[#c2e267]">Apply now</Button>
                <Button variant="outline" className="border-[#0a3141] text-[#0a3141] bg-transparent">
                  <BookmarkIcon className="w-4 h-4" />
                </Button>
              </div>

              <div>
                <h4 className="font-semibold mb-3">About the job</h4>
                <div className="text-sm text-gray-600 leading-relaxed space-y-4">
                  <p>
                    We are seeking a highly skilled and experienced {selectedJob.title} to join our dynamic product
                    team. This role offers an exciting opportunity to shape the future of our platform and drive
                    innovation across multiple product lines.
                  </p>
                  <p>
                    As a {selectedJob.title}, you will be responsible for leading cross-functional teams, defining
                    product strategy, and ensuring successful product launches. You'll work closely with engineering,
                    design, marketing, and sales teams to deliver exceptional user experiences.
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Key Responsibilities</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Lead product strategy and roadmap development for multiple product lines</li>
                  <li>• Collaborate with cross-functional teams to define and execute product requirements</li>
                  <li>• Conduct market research and competitive analysis to identify opportunities</li>
                  <li>• Work closely with UX/UI designers to create intuitive user experiences</li>
                  <li>• Define and track key product metrics and KPIs</li>
                  <li>• Manage product lifecycle from conception to launch and beyond</li>
                  <li>• Communicate product vision and strategy to stakeholders at all levels</li>
                  <li>• Mentor and guide junior product team members</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Required Qualifications</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• {selectedJob.experience} of product management experience</li>
                  <li>• Bachelor's degree in Business, Engineering, Computer Science, or related field</li>
                  <li>• Strong analytical and problem-solving skills</li>
                  <li>• Experience with Agile/Scrum methodologies</li>
                  <li>• Excellent communication and leadership abilities</li>
                  <li>• Experience with product analytics tools (Google Analytics, Mixpanel, etc.)</li>
                  <li>• Knowledge of user research and usability testing methods</li>
                  <li>• Experience in B2B or B2C product environments</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Preferred Qualifications</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• MBA or advanced degree preferred</li>
                  <li>• Experience in SaaS or technology companies</li>
                  <li>• Technical background with understanding of software development</li>
                  <li>• Experience with A/B testing and experimentation</li>
                  <li>• Knowledge of machine learning and AI applications</li>
                  <li>• Previous experience in a startup environment</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Skills & Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">Product Strategy</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">User Research</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">Agile/Scrum</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">Data Analysis</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">A/B Testing</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">Roadmapping</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">Wireframing</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">SQL</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">Jira</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">Figma</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">Google Analytics</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">Mixpanel</span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">What We Offer</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Competitive salary and equity package</li>
                  <li>• Comprehensive health, dental, and vision insurance</li>
                  <li>• Flexible work arrangements and remote-first culture</li>
                  <li>• Professional development budget and learning opportunities</li>
                  <li>• Unlimited PTO and flexible working hours</li>
                  <li>• State-of-the-art equipment and home office setup allowance</li>
                  <li>• Team retreats and company events</li>
                  <li>• Opportunity to work with cutting-edge technologies</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3">About {selectedJob.company}</h4>
                <div className="text-sm text-gray-600 leading-relaxed space-y-3">
                  <p>
                    {selectedJob.company} is a leading technology company that specializes in creating innovative
                    solutions for businesses worldwide. We're passionate about building products that make a real
                    difference in people's lives and help organizations achieve their goals.
                  </p>
                  <p>
                    Our team is composed of talented individuals from diverse backgrounds who share a common vision of
                    excellence and innovation. We foster a collaborative environment where creativity thrives and
                    everyone has the opportunity to make a meaningful impact.
                  </p>
                  <p>
                    Join us in our mission to transform the industry and be part of a company that values growth,
                    innovation, and making a positive impact on the world.
                  </p>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex gap-3 mb-4">
                  <Button className="flex-1 bg-[#d2f277] text-black hover:bg-[#c2e267]">Apply now</Button>
                  <Button variant="outline" className="border-[#0a3141] text-[#0a3141] bg-transparent">
                    <BookmarkIcon className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 text-center">
                  By applying, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
