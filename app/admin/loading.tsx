import { Card, CardContent } from "@/components/ui/card"

export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <div className="h-8 bg-gray-200 rounded w-64 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-48 mt-2 animate-pulse" />
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-10 bg-gray-200 rounded w-64 animate-pulse" />
              <div className="h-10 bg-gray-200 rounded w-20 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid Loading */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                    <div className="h-8 bg-gray-200 rounded w-16 mt-2 animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded w-20 mt-2 animate-pulse" />
                  </div>
                  <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions Loading */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="h-6 bg-gray-200 rounded w-32 animate-pulse mb-2" />
                <div className="h-4 bg-gray-200 rounded w-48 animate-pulse mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, index) => (
                    <div key={index} className="p-4 rounded-lg border-2 border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className="h-6 w-6 bg-gray-200 rounded animate-pulse" />
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
                          <div className="h-3 bg-gray-200 rounded w-24 mt-1 animate-pulse" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity Loading */}
          <div>
            <Card>
              <CardContent className="p-6">
                <div className="h-6 bg-gray-200 rounded w-32 animate-pulse mb-2" />
                <div className="h-4 bg-gray-200 rounded w-40 animate-pulse mb-6" />
                <div className="space-y-4">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                      <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                        <div className="h-3 bg-gray-200 rounded w-20 mt-1 animate-pulse" />
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
