"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { FileText, Eye, MessageSquare, TrendingUp, Calendar, Users } from "lucide-react"

// Sample data
const applicationData = [
  { month: "Jan", applications: 12, interviews: 3 },
  { month: "Feb", applications: 15, interviews: 5 },
  { month: "Mar", applications: 18, interviews: 7 },
  { month: "Apr", applications: 22, interviews: 9 },
  { month: "May", applications: 25, interviews: 12 },
  { month: "Jun", applications: 28, interviews: 15 },
]

const statusData = [
  { name: "Applied", value: 45, color: "#0a3141" },
  { name: "Under Review", value: 25, color: "#d2f277" },
  { name: "Interview", value: 15, color: "#f59e0b" },
  { name: "Rejected", value: 15, color: "#ef4444" },
]

const recentApplications = [
  {
    id: 1,
    company: "Google",
    position: "Senior Software Engineer",
    status: "Interview Scheduled",
    appliedDate: "2024-01-15",
    logo: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    company: "Microsoft",
    position: "Product Manager",
    status: "Under Review",
    appliedDate: "2024-01-12",
    logo: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    company: "Apple",
    position: "UX Designer",
    status: "Applied",
    appliedDate: "2024-01-10",
    logo: "/placeholder.svg?height=40&width=40",
  },
]

const upcomingEvents = [
  {
    id: 1,
    title: "Interview with Google",
    date: "2024-01-20",
    time: "10:00 AM",
    type: "Video Call",
  },
  {
    id: 2,
    title: "Career Coaching Session",
    date: "2024-01-22",
    time: "2:00 PM",
    type: "In-person",
  },
  {
    id: 3,
    title: "Tech Skills Workshop",
    date: "2024-01-25",
    time: "6:00 PM",
    type: "Online",
  },
]

export default function ApplicantDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#0a3141] to-[#1a4a5c] rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, John!</h1>
        <p className="text-gray-200">Here's what's happening with your job search today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">+5% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interviews</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">3 scheduled this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Trends */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Matching Jobs</CardTitle>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center">
                  <span className="text-sm font-medium">G</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Senior Software Engineer</h4>
                  <p className="text-sm text-gray-500">Google • Mountain View, CA</p>
                  <p className="text-sm text-green-600">95% match</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">$150k - $200k</p>
                  <p className="text-xs text-gray-500">Full-time</p>
                  <Button
                    size="sm"
                    className="bg-[#0a3141] hover:bg-[#1a4a5c] text-white"
                    onClick={() => console.log("Applied to job")}
                  >
                    Apply Now
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center">
                  <span className="text-sm font-medium">M</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Full Stack Developer</h4>
                  <p className="text-sm text-gray-500">Microsoft • Seattle, WA</p>
                  <p className="text-sm text-green-600">92% match</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">$130k - $170k</p>
                  <p className="text-xs text-gray-500">Full-time</p>
                  <Button
                    size="sm"
                    className="bg-[#0a3141] hover:bg-[#1a4a5c] text-white"
                    onClick={() => console.log("Applied to job")}
                  >
                    Apply Now
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center">
                  <span className="text-sm font-medium">A</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Software Engineer III</h4>
                  <p className="text-sm text-gray-500">Apple • Cupertino, CA</p>
                  <p className="text-sm text-green-600">88% match</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">$140k - $180k</p>
                  <p className="text-xs text-gray-500">Full-time</p>
                  <Button
                    size="sm"
                    className="bg-[#0a3141] hover:bg-[#1a4a5c] text-white"
                    onClick={() => console.log("Applied to job")}
                  >
                    Apply Now
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center">
                  <span className="text-sm font-medium">N</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Backend Engineer</h4>
                  <p className="text-sm text-gray-500">Netflix • Los Gatos, CA</p>
                  <p className="text-sm text-green-600">85% match</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">$135k - $175k</p>
                  <p className="text-xs text-gray-500">Full-time</p>
                  <Button
                    size="sm"
                    className="bg-[#0a3141] hover:bg-[#1a4a5c] text-white"
                    onClick={() => console.log("Applied to job")}
                  >
                    Apply Now
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Application Status */}
        <Card>
          <CardHeader>
            <CardTitle>Application Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {statusData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm">
                    {item.name}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Applications & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Applications</CardTitle>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentApplications.map((application) => (
                <div key={application.id} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center">
                    <span className="text-sm font-medium">{application.company[0]}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{application.position}</h4>
                    <p className="text-sm text-gray-500">{application.company}</p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        application.status === "Interview Scheduled"
                          ? "default"
                          : application.status === "Under Review"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {application.status}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">{application.appliedDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Upcoming Events</CardTitle>
            <Button variant="outline" size="sm">
              View Calendar
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-[#d2f277] flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-[#0a3141]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-sm text-gray-500">{event.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{event.date}</p>
                    <p className="text-xs text-gray-500">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <FileText className="w-6 h-6" />
              <span className="text-sm">Apply to Jobs</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <MessageSquare className="w-6 h-6" />
              <span className="text-sm">Messages</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <TrendingUp className="w-6 h-6" />
              <span className="text-sm">Skill Assessment</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Users className="w-6 h-6" />
              <span className="text-sm">Book Coaching</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
