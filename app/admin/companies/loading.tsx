import { Card, CardContent } from "@/components/ui/card"

export default function CompaniesLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <div className="h-8 bg-gray-200 rounded w-64 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-48 mt-2 animate-pulse" />
            </div>
            <div className="h-10 bg-gray-200 rounded w-32 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Loading */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="h-10 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="h-10 bg-gray-200 rounded w-48 animate-pulse" />
              <div className="h-10 bg-gray-200 rounded w-48 animate-pulse" />
            </div>
          </CardContent>
        </Card>

        {/* Companies List Loading */}
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-gray-200 rounded-lg animate-pulse" />
                    <div>
                      <div className="h-5 bg-gray-200 rounded w-48 animate-pulse" />
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
                        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
                        <div className="h-4 bg-gray-200 rounded w-12 animate-pulse" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-6 bg-gray-200 rounded w-20 animate-pulse" />
                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
