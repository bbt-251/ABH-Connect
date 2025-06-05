"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin } from "lucide-react"
import JobCard from "@/components/job-card"
import CategoryCard from "@/components/category-card"
import TestimonialCard from "@/components/testimonial-card"
import AnnouncementCarousel from "@/components/announcement-carousel"

export default function Home() {
    return (
        <div className="flex min-h-screen flex-col">
            <header className="border-b bg-white">
                <div className="flex h-16 items-center justify-between px-4 md:px-6">
                    <div className="flex items-center gap-3">
                        <Image
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-9xNdd6tEqppxZ2JNyyzzlibUNBOJ99.png"
                            alt="ABH Connect Logo"
                            width={40}
                            height={40}
                        />
                        <span className="text-xl font-semibold text-[#0a3141]">ABH Connect</span>
                    </div>
                    <div>
                        <Link href="/auth">
                            <Button className="rounded-full bg-[#d2f277] text-black hover:bg-[#c2e267]">Get Started</Button>
                        </Link>
                    </div>
                </div>
            </header>
            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-[#f5f7fa] py-12 md:py-16 lg:py-20">
                    <div className=" px-4 md:px-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-6">
                                <Image src="/placeholder.svg?height=80&width=80" alt="Decorative icon" width={80} height={80} />
                            </div>
                            <h1 className="mb-4 text-4xl font-bold tracking-tight text-[#0a3141] md:text-5xl lg:text-6xl">
                                Get The Right Job
                                <br />
                                You Deserve
                            </h1>
                            <p className="mb-8 text-muted-foreground">Last 24 hrs jobs found here! Your dream jobs is waiting.</p>
                            <div className="w-full max-w-3xl">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto_auto]">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input placeholder="Job title or keyword" className="pl-10 h-12 rounded-md" />
                                    </div>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input placeholder="New York, USA" className="pl-10 h-12 rounded-md" />
                                    </div>
                                    <Button className="h-12 px-6 bg-[#d2f277] text-black hover:bg-[#c2e267]">Search</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Trending Jobs Section */}
                <section className="py-12 md:py-16">
                    <div className=" px-4 md:px-6">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-[#0a3141]">Trending Jobs</h2>
                            <Link href="/all-jobs" className="text-sm font-medium text-[#0a3141]">
                                See All Jobs
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            <JobCard
                                title="Senior UI Designer"
                                company="Microsoft"
                                description="Have a passion for UI/UX? Opportunity to start from the ground up and build."
                                location="Glendale, CA"
                                jobType="Full-time"
                                salary="$20K"
                                period="Monthly"
                                logo="/placeholder.svg?height=30&width=30"
                            />
                            <JobCard
                                title="Product Designer"
                                company="Google"
                                description="You will be the design lead responsible for creating production assets."
                                location="Arizona, MA"
                                jobType="Remote"
                                salary="$25K"
                                period="Monthly"
                                logo="/placeholder.svg?height=30&width=30"
                            />
                            <JobCard
                                title="Marketing Officer"
                                company="Mailchimp"
                                description="We're looking for someone to join us part of a great, cross-functional team that creates."
                                location="Boston, MA"
                                jobType="Full-time"
                                salary="$15K"
                                period="Monthly"
                                logo="/placeholder.svg?height=30&width=30"
                            />
                        </div>
                    </div>
                </section>

                {/* Categories Section */}
                <section className="bg-[#f5f7fa] py-12 md:py-16">
                    <div className=" px-4 md:px-6">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-[#0a3141]">One platform for all sectors</h2>
                            <Link href="/all-categories" className="text-sm font-medium text-[#0a3141]">
                                See all sectors
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                            <CategoryCard title="Marketing" count="35" />
                            <CategoryCard title="Development" count="42" />
                            <CategoryCard title="UI/UX Design" count="35" active={true} />
                            <CategoryCard title="Human Research" count="15" />
                            <CategoryCard title="Security" count="35" />
                            <CategoryCard title="Software" count="22" />
                            <CategoryCard title="Management" count="42" />
                            <CategoryCard title="Finance" count="30" />
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="bg-white py-12 md:py-16">
                    <div className=" px-4 md:px-6">
                        <h2 className="text-2xl font-bold text-[#0a3141] mb-8">
                            Review of People
                            <br />
                            Who Have Found Jobs
                        </h2>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <TestimonialCard
                                quote="I can't thank JobSearchPro enough for connecting me with the perfect company! The matching algorithm is spot on, and the job alerts kept me updated on new opportunities. Highly recommend to anyone in the tech industry."
                                name="Ibrahim Hasan"
                                position="Product Designer"
                                company="Mailchimp"
                                avatar="/placeholder.svg?height=60&width=60"
                            />
                            <TestimonialCard
                                quote="I can't thank JobSearchPro enough for connecting me with the perfect company! The matching algorithm is spot on, and the job alerts kept me updated on new opportunities. Highly recommend to anyone in the tech industry."
                                name="Ibrahim Hasan"
                                position="Product Designer"
                                company="Mailchimp"
                                avatar="/placeholder.svg?height=60&width=60"
                            />
                        </div>
                    </div>
                </section>

                {/* CV Upload Section */}
                <section className="py-12 md:py-16">
                    <div className=" px-4 md:px-6">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            <div>
                                <h2 className="text-2xl font-bold text-[#0a3141] mb-4">
                                    Get Matched The Most Valuable Jobs, Just Drop Your CV at Wazifa
                                </h2>
                                <p className="text-muted-foreground mb-6">
                                    In the subject line of your email, write your name, the description of the position and its reference
                                    number. If you did not find the vacancy on the employer's website, it's helpful not state where you
                                    found it.
                                </p>
                                <Button className="rounded-full bg-[#d2f277] text-black hover:bg-[#c2e267]">Register Now</Button>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <div className="mb-6">
                                    <label htmlFor="cv-upload" className="block text-sm font-medium text-gray-700 mb-2">
                                        Upload Your CV
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                                        <input
                                            type="file"
                                            id="cv-upload"
                                            accept=".pdf,.doc,.docx"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0]
                                                if (file) {
                                                    console.log("File selected:", file.name)
                                                }
                                            }}
                                        />
                                        <label htmlFor="cv-upload" className="cursor-pointer">
                                            <div className="flex flex-col items-center">
                                                <svg
                                                    className="w-8 h-8 text-gray-400 mb-2"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                    />
                                                </svg>
                                                <span className="text-sm text-gray-600">Click to upload or drag and drop</span>
                                                <span className="text-xs text-gray-400">PDF, DOC, DOCX (max 5MB)</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <Input placeholder="Enter your email" className="h-12" />
                                    </div>
                                    <Button className="w-full h-12 bg-[#d2f277] text-black hover:bg-[#c2e267]">Send CV</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Newsletter Section */}
                <section className="bg-[#0a3141] py-12 md:py-16">
                    <div className=" px-4 md:px-6">
                        <div className="mx-auto max-w-2xl text-center text-white">
                            <h2 className="text-2xl font-bold mb-4">Never Want to Miss Any Job News?</h2>
                            <p className="mb-6 text-gray-300">
                                Subscribe to see up-to-date job insights, career tips and new vacancies. We post approximately one time.
                            </p>
                            <div className="flex justify-center">
                                <Link href={"auth/register?type=applicant"}>
                                    <Button className="h-12 px-8 bg-[#d2f277] text-black hover:bg-[#c2e267] font-medium">
                                        Register Applicant
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Announcement Carousel */}
                <section className="bg-gradient-to-r from-[#0a3141] to-[#1a4a5c] py-12 md:py-16">
                    <div className=" px-4 md:px-6">
                        <div className="mx-auto max-w-4xl">
                            <h2 className="text-3xl font-bold text-white text-center mb-8 md:text-4xl">Latest Announcements</h2>
                            <AnnouncementCarousel />
                        </div>
                    </div>
                </section>
            </main>
            <footer className="border-t bg-white py-8 md:py-12">
                <div className=" px-4 md:px-6">
                    <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-4">
                        <div>
                            <h3 className="mb-4 text-sm font-medium">About</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>
                                    <Link href="#">Press</Link>
                                </li>
                                <li>
                                    <Link href="#">Partners Relations</Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="mb-4 text-sm font-medium">Jobs</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>
                                    <Link href="#">Job Referrals</Link>
                                </li>
                                <li>
                                    <Link href="#">FAQ</Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="mb-4 text-sm font-medium">Careers</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>
                                    <Link href="#">Blog</Link>
                                </li>
                                <li>
                                    <Link href="#">Affiliate</Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="mb-4 text-sm font-medium">Terms</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>
                                    <Link href="#">Privacy Policy</Link>
                                </li>
                                <li>
                                    <Link href="#">Help & Support</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 border-t pt-8">
                        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                            <div className="flex gap-4">
                                <Link href="#" className="rounded-full border p-2">
                                    <span className="sr-only">Facebook</span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-facebook"
                                    >
                                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                                    </svg>
                                </Link>
                                <Link href="#" className="rounded-full border p-2">
                                    <span className="sr-only">Twitter</span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-twitter"
                                    >
                                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                                    </svg>
                                </Link>
                                <Link href="#" className="rounded-full border p-2">
                                    <span className="sr-only">LinkedIn</span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-linkedin"
                                    >
                                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                        <rect width="4" height="12" x="2" y="9" />
                                        <circle cx="4" cy="4" r="2" />
                                    </svg>
                                </Link>
                                <Link href="#" className="rounded-full border p-2">
                                    <span className="sr-only">YouTube</span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-youtube"
                                    >
                                        <path d="M2.5 17a24.12 24.12 0 0 1 0-10a2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                                        <path d="m10 15 5-3-5-3z" />
                                    </svg>
                                </Link>
                            </div>
                            <div className="flex gap-4 text-xs text-muted-foreground">
                                <Link href="#">Terms & Condition</Link>
                                <Link href="#">Privacy Policy</Link>
                                <Link href="#">Support</Link>
                            </div>
                            <p className="text-xs text-muted-foreground">©Copyright AzifaJobs. All Rights Reserved</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
