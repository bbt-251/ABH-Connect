"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const announcements = [
  {
    id: 1,
    badge: "NEW OPPORTUNITY",
    title: "500+ New Tech Jobs Added This Week",
    description: "Discover exciting opportunities in software development, data science, and AI across top companies.",
  },
  {
    id: 2,
    badge: "TRENDING",
    title: "Remote Work Opportunities Expanding",
    description: "Join the growing trend of remote work with flexible positions from leading global companies.",
  },
  {
    id: 3,
    badge: "FEATURED",
    title: "Healthcare Sector Hiring Surge",
    description: "Medical professionals and healthcare administrators are in high demand across multiple specialties.",
  },
  {
    id: 4,
    badge: "URGENT",
    title: "Engineering Positions Available",
    description: "Mechanical, electrical, and civil engineering roles with competitive salaries and benefits.",
  },
]

export default function AnnouncementCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % announcements.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + announcements.length) % announcements.length)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % announcements.length)
  }

  return (
    <div className="relative overflow-hidden rounded-lg bg-white/10 backdrop-blur-sm">
      <div className="relative">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {announcements.map((announcement) => (
            <div key={announcement.id} className="min-w-full p-8 text-center">
              <div className="mb-4">
                <span className="inline-block px-3 py-1 text-xs font-semibold bg-[#d2f277] text-black rounded-full mb-2">
                  {announcement.badge}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 md:text-2xl">{announcement.title}</h3>
              <p className="text-gray-200 max-w-2xl mx-auto leading-relaxed">{announcement.description}</p>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          aria-label="Previous announcement"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          aria-label="Next announcement"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {announcements.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentSlide ? "bg-[#d2f277]" : "bg-white/30 hover:bg-white/50"
            }`}
            aria-label={`Go to announcement ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
