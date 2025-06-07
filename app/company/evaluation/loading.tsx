import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function EvaluationMetricsLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div>
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-96 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Cards Skeleton */}
      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
                  <div className="flex gap-4">
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                  <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="space-y-2">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-16 bg-gray-100 rounded animate-pulse" />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
