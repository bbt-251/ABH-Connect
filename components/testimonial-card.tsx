import Image from "next/image"

interface TestimonialCardProps {
  quote: string
  name: string
  position: string
  company: string
  avatar: string
}

export default function TestimonialCard({ quote, name, position, company, avatar }: TestimonialCardProps) {
  return (
    <div className="rounded-lg border bg-[#f5f7fa] p-6">
      <div className="mb-4 flex items-center">
        <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400">
          <span className="text-xs font-bold text-white">M</span>
        </div>
        <span className="font-medium">{company}</span>
      </div>
      <blockquote className="mb-6 text-sm">"{quote}"</blockquote>
      <div className="flex items-center">
        <div className="mr-3 h-10 w-10 overflow-hidden rounded-full">
          <Image
            src={avatar || "/placeholder.svg"}
            alt={name}
            width={40}
            height={40}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-xs text-muted-foreground">{position}</p>
        </div>
      </div>
    </div>
  )
}
