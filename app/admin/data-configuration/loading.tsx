import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function DataConfigurationLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-96 animate-pulse" />
            </div>
            <div className="h-10 bg-gray-200 rounded w-32 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Category Selector Skeleton */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-24 mb-2 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {Array.from({ length: 11 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-3 px-4 py-3">
                      <div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded flex-1 animate-pulse" />
                      <div className="h-5 bg-gray-200 rounded w-8 animate-pulse" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Data Management Skeleton */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-6 w-6 bg-gray-200 rounded animate-pulse" />
                    <div>
                      <div className="h-6 bg-gray-200 rounded w-32 mb-2 animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded w-48 animate-pulse" />
                    </div>
                  </div>
                  <div className="h-10 bg-gray-200 rounded w-24 animate-pulse" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                      <div className="h-4 bg-gray-200 rounded flex-1 mr-4 animate-pulse" />
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                        <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
