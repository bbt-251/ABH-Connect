import Image from "next/image"
import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface JobCardProps {
  title: string
  company: string
  description: string
  location: string
  jobType: string
  salary: string
  period: string
  logo: string
}

export default function JobCard({
  title,
  company,
  description,
  location,
  jobType,
  salary,
  period,
  logo,
}: JobCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg border bg-white p-5 transition-all hover:shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-8 w-8 overflow-hidden rounded">
            <Image src={logo || "/placeholder.svg"} alt={`${company} logo`} fill className="object-cover" />
          </div>
          <span className="text-sm font-medium">{company}</span>
        </div>
      </div>
      <h3 className="mb-2 text-lg font-bold">{title}</h3>
      <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{description}</p>
      <div className="mb-4 flex items-center gap-2">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span>{location}</span>
        </div>
        <Badge variant="outline" className="text-xs font-normal">
          {jobType}
        </Badge>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold">{salary}</p>
          <p className="text-xs text-muted-foreground">{period}</p>
        </div>
        <Button size="sm" className="rounded-full bg-[#d2f277] text-black hover:bg-[#c2e267]">
          Apply Now
        </Button>
      </div>
    </div>
  )
}
