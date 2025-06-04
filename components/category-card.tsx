import { ChevronRight } from "lucide-react"
import Link from "next/link"

interface CategoryCardProps {
  title: string
  count: string
  active?: boolean
}

export default function CategoryCard({ title, count, active = false }: CategoryCardProps) {
  return (
    <Link href={`/category/${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <div
        className={`flex items-center justify-between rounded-lg border p-4 transition-all hover:shadow-md ${active ? "bg-[#0a3141] text-white" : "bg-white"}`}
      >
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className={`text-sm ${active ? "text-gray-300" : "text-muted-foreground"}`}>{count} Jobs Available</p>
        </div>
        <ChevronRight className="h-5 w-5" />
      </div>
    </Link>
  )
}
