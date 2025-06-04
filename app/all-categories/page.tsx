"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, MapPin, ChevronDown, BookmarkIcon, X, Briefcase, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Domain/Category data
const domains = [
  {
    id: 1,
    name: "Technology",
    jobCount: 1247,
    icon: "💻",
    color: "bg-blue-100 text-blue-800",
    description: "Software, AI, Data Science",
  },
  {
    id: 2,
    name: "Healthcare",
    jobCount: 892,
    icon: "🏥",
    color: "bg-green-100 text-green-800",
    description: "Medical, Nursing, Research",
  },
  {
    id: 3,
    name: "Finance",
    jobCount: 634,
    icon: "💰",
    color: "bg-yellow-100 text-yellow-800",
    description: "Banking, Investment, Accounting",
  },
  {
    id: 4,
    name: "Marketing",
    jobCount: 567,
    icon: "📈",
    color: "bg-purple-100 text-purple-800",
    description: "Digital, Content, Brand",
  },
  {
    id: 5,
    name: "Education",
    jobCount: 423,
    icon: "🎓",
    color: "bg-indigo-100 text-indigo-800",
    description: "Teaching, Training, Research",
  },
  {
    id: 6,
    name: "Engineering",
    jobCount: 789,
    icon: "⚙️",
    color: "bg-gray-100 text-gray-800",
    description: "Mechanical, Civil, Electrical",
  },
  {
    id: 7,
    name: "Sales",
    jobCount: 445,
    icon: "🤝",
    color: "bg-orange-100 text-orange-800",
    description: "B2B, Retail, Account Management",
  },
  {
    id: 8,
    name: "Design",
    jobCount: 356,
    icon: "🎨",
    color: "bg-pink-100 text-pink-800",
    description: "UI/UX, Graphic, Product",
  },
  {
    id: 9,
    name: "Human Resources",
    jobCount: 234,
    icon: "👥",
    color: "bg-teal-100 text-teal-800",
    description: "Recruitment, Training, Operations",
  },
  {
    id: 10,
    name: "Operations",
    jobCount: 512,
    icon: "📊",
    color: "bg-red-100 text-red-800",
    description: "Supply Chain, Logistics, Management",
  },
  {
    id: 11,
    name: "Customer Service",
    jobCount: 298,
    icon: "📞",
    color: "bg-cyan-100 text-cyan-800",
    description: "Support, Relations, Success",
  },
  {
    id: 12,
    name: "Legal",
    jobCount: 167,
    icon: "⚖️",
    color: "bg-violet-100 text-violet-800",
    description: "Corporate, Compliance, Litigation",
  },
]

// Sample job data with domain categories
const allJobs = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "Google",
    location: "Mountain View, CA",
    experience: "5+ Years",
    jobType: "Full-Time",
    salary: "$150k - $200k",
    salaryPeriod: "per year",
    logo: "/placeholder.svg?height=40&width=40",
    postedTime: "2 hours ago",
    domain: "Technology",
    skills: ["React", "Node.js", "Python", "AWS"],
  },
  {
    id: 2,
    title: "Product Manager",
    company: "Microsoft",
    location: "Seattle, WA",
    experience: "3-5 Years",
    jobType: "Full-Time",
    salary: "$120k - $160k",
    salaryPeriod: "per year",
    logo: "/placeholder.svg?height=40&width=40",
    postedTime: "4 hours ago",
    domain: "Technology",
    skills: ["Product Strategy", "Agile", "Analytics"],
  },
  {
    id: 3,
    title: "Registered Nurse",
    company: "Mayo Clinic",
    location: "Rochester, MN",
    experience: "2-4 Years",
    jobType: "Full-Time",
    salary: "$65k - $85k",
    salaryPeriod: "per year",
    logo: "/placeholder.svg?height=40&width=40",
    postedTime: "6 hours ago",
    domain: "Healthcare",
    skills: ["Patient Care", "Medical Records", "Emergency Response"],
  },
  {
    id: 4,
    title: "Financial Analyst",
    company: "JPMorgan Chase",
    location: "New York, NY",
    experience: "1-3 Years",
    jobType: "Full-Time",
    salary: "$80k - $110k",
    salaryPeriod: "per year",
    logo: "/placeholder.svg?height=40&width=40",
    postedTime: "8 hours ago",
    domain: "Finance",
    skills: ["Excel", "Financial Modeling", "Risk Analysis"],
  },
  {
    id: 5,
    title: "Digital Marketing Manager",
    company: "HubSpot",
    location: "Boston, MA",
    experience: "3-5 Years",
    jobType: "Full-Time",
    salary: "$90k - $120k",
    salaryPeriod: "per year",
    logo: "/placeholder.svg?height=40&width=40",
    postedTime: "1 day ago",
    domain: "Marketing",
    skills: ["SEO", "Content Marketing", "Analytics", "PPC"],
  },
  {
    id: 6,
    title: "UX Designer",
    company: "Adobe",
    location: "San Francisco, CA",
    experience: "2-4 Years",
    jobType: "Full-Time",
    salary: "$95k - $130k",
    salaryPeriod: "per year",
    logo: "/placeholder.svg?height=40&width=40",
    postedTime: "1 day ago",
    domain: "Design",
    skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
  },
  {
    id: 7,
    title: "Mechanical Engineer",
    company: "Tesla",
    location: "Austin, TX",
    experience: "3-6 Years",
    jobType: "Full-Time",
    salary: "$100k - $140k",
    salaryPeriod: "per year",
    logo: "/placeholder.svg?height=40&width=40",
    postedTime: "2 days ago",
    domain: "Engineering",
    skills: ["CAD", "Manufacturing", "Project Management"],
  },
  {
    id: 8,
    title: "Sales Representative",
    company: "Salesforce",
    location: "Chicago, IL",
    experience: "1-3 Years",
    jobType: "Full-Time",
    salary: "$60k - $90k",
    salaryPeriod: "per year",
    logo: "/placeholder.svg?height=40&width=40",
    postedTime: "3 days ago",
    domain: "Sales",
    skills: ["CRM", "Lead Generation", "Negotiation"],
  },
]

export default function AllCategoriesPage() {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [location, setLocation] = useState("")
  const [selectedJob, setSelectedJob] = useState<(typeof allJobs)[0] | null>(null)

  // Filter jobs based on selected domain and search term
  const filteredJobs = allJobs.filter((job) => {
    const matchesDomain = !selectedDomain || job.domain === selectedDomain
    const matchesSearch =
      !searchTerm ||
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesDomain && matchesSearch
  })

  const totalJobs = selectedDomain
    ? domains.find((d) => d.name === selectedDomain)?.jobCount || 0
    : domains.reduce((sum, domain) => sum + domain.jobCount, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-9xNdd6tEqppxZ2JNyyzzlibUNBOJ99.png"
                alt="ABH Connect Logo"
                width={40}
                height={40}
              />
            </Link>
            <span className="text-xl font-semibold text-[#0a3141]">ABH Connect</span>
          </div>
          <div>
            <Link href="/auth">
              <Button className="rounded-full bg-[#d2f277] text-black hover:bg-[#c2e267]">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-[#0a3141] text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4 text-center">Explore All Job Categories</h1>
          <p className="text-center text-gray-300 mb-8">Find opportunities across all industries and domains</p>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4">
            <div className="relative bg-white rounded-md">
              <Input
                type="text"
                placeholder="Search job title, keywords or skills"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Domain Filter Cards */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#0a3141]">Browse by Category</h2>
            {selectedDomain && (
              <Button
                variant="outline"
                onClick={() => setSelectedDomain(null)}
                className="text-[#0a3141] border-[#0a3141]"
              >
                Clear Filter
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {domains.map((domain) => (
              <div
                key={domain.id}
                onClick={() => setSelectedDomain(selectedDomain === domain.name ? null : domain.name)}
                className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                  selectedDomain === domain.name
                    ? "border-[#0a3141] bg-[#0a3141] text-white"
                    : "border-gray-200 bg-white hover:border-[#0a3141]"
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">{domain.icon}</div>
                  <h3 className="font-semibold text-sm mb-1">{domain.name}</h3>
                  <p className={`text-xs mb-2 ${selectedDomain === domain.name ? "text-gray-200" : "text-gray-500"}`}>
                    {domain.description}
                  </p>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      selectedDomain === domain.name ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {domain.jobCount} jobs
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Job Listings */}
        <div className="flex gap-8">
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-[#0a3141]">
                  {selectedDomain ? `${selectedDomain} Jobs` : "All Jobs"}
                </h3>
                <p className="text-gray-500">{filteredJobs.length} results found</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sort By:</span>
                <button className="flex items-center text-sm font-medium">
                  Date Posted <ChevronDown className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>

            {/* Job Cards */}
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className={`bg-white p-6 rounded-lg shadow-sm border cursor-pointer transition-all hover:shadow-md ${
                    selectedJob?.id === job.id ? "border-[#0a3141] bg-blue-50" : "border-gray-100"
                  }`}
                  onClick={() => setSelectedJob(job)}
                >
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
                        <div className="flex items-center gap-2 mt-2 md:mt-0">
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">{job.domain}</span>
                          <button className="text-[#0a3141] flex items-center">
                            <BookmarkIcon className="w-4 h-4 mr-1" />
                            Save Job
                          </button>
                        </div>
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
                        <div className="flex flex-wrap gap-1">
                          {job.skills.slice(0, 3).map((skill, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              {skill}
                            </span>
                          ))}
                          {job.skills.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              +{job.skills.length - 3} more
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="text-sm text-gray-500">Posted {job.postedTime}</p>
                          <Button className="bg-[#d2f277] text-black hover:bg-[#c2e267]">Apply</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No jobs found matching your criteria.</p>
                <p className="text-gray-400 mt-2">Try adjusting your search or removing filters.</p>
              </div>
            )}
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
                    {selectedJob.location} • {selectedJob.postedTime}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                  {selectedJob.jobType}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{selectedJob.domain}</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">Remote</span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">
                    {selectedJob.jobType} • {selectedJob.experience}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{selectedJob.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">
                    {selectedJob.salary} {selectedJob.salaryPeriod}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 bg-[#d2f277] text-black hover:bg-[#c2e267]">Apply now</Button>
                <Button variant="outline" className="border-[#0a3141] text-[#0a3141]">
                  <BookmarkIcon className="w-4 h-4" />
                </Button>
              </div>

              <div>
                <h4 className="font-semibold mb-3">About the job</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  We are looking for a talented {selectedJob.title} to join our dynamic team. This role offers an
                  exciting opportunity to work with cutting-edge technologies and contribute to innovative projects.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Required Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.skills.map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Requirements</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• {selectedJob.experience} of relevant experience</li>
                  <li>• Strong problem-solving and analytical skills</li>
                  <li>• Excellent communication and teamwork abilities</li>
                  <li>• Bachelor's degree in relevant field or equivalent experience</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
