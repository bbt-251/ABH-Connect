"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell,
} from "recharts"
import { FileText, Users, TrendingUp, Calendar, MessageSquare, UserCheck } from "lucide-react"
import { useAuth } from "@/context/authContext"

// Sample data
const applicationData = [
    { month: "Jan", applications: 45, hired: 8 },
    { month: "Feb", applications: 52, hired: 12 },
    { month: "Mar", applications: 38, hired: 6 },
    { month: "Apr", applications: 67, hired: 15 },
    { month: "May", applications: 71, hired: 18 },
    { month: "Jun", applications: 84, hired: 22 },
]

const jobStatusData = [
    { name: "Active", value: 12, color: "#0a3141" },
    { name: "Draft", value: 5, color: "#d2f277" },
    { name: "Closed", value: 8, color: "#f59e0b" },
    { name: "Paused", value: 3, color: "#ef4444" },
]

const recentApplications = [
    {
        id: 1,
        candidate: "Sarah Johnson",
        position: "Senior Software Engineer",
        status: "Interview Scheduled",
        appliedDate: "2024-01-15",
        avatar: "/placeholder.svg?height=40&width=40",
    },
    {
        id: 2,
        candidate: "Michael Chen",
        position: "Product Manager",
        status: "Under Review",
        appliedDate: "2024-01-14",
        avatar: "/placeholder.svg?height=40&width=40",
    },
    {
        id: 3,
        candidate: "Emily Rodriguez",
        position: "UX Designer",
        status: "Shortlisted",
        appliedDate: "2024-01-13",
        avatar: "/placeholder.svg?height=40&width=40",
    },
]

const upcomingInterviews = [
    {
        id: 1,
        candidate: "Sarah Johnson",
        position: "Senior Software Engineer",
        date: "2024-01-20",
        time: "10:00 AM",
        type: "Technical Interview",
    },
    {
        id: 2,
        candidate: "David Kim",
        position: "Marketing Manager",
        date: "2024-01-20",
        time: "2:00 PM",
        type: "Final Interview",
    },
    {
        id: 3,
        candidate: "Lisa Wang",
        position: "Data Scientist",
        date: "2024-01-21",
        time: "11:00 AM",
        type: "HR Interview",
    },
]

const getStatusColor = (status: string) => {
    switch (status) {
        case "Interview Scheduled":
            return "bg-blue-100 text-blue-800"
        case "Under Review":
            return "bg-yellow-100 text-yellow-800"
        case "Shortlisted":
            return "bg-green-100 text-green-800"
        case "Rejected":
            return "bg-red-100 text-red-800"
        default:
            return "bg-gray-100 text-gray-800"
    }
}

export default function CompanyDashboard() {
    const { userData } = useAuth();
    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-[#0a3141] to-[#1a4a5c] rounded-lg p-6 text-white">
                <h1 className="text-2xl font-bold mb-2">Welcome back, {userData?.company?.fullName}</h1>
                <p className="text-gray-200">Here's an overview of your recruitment activities today.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Job Posts</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">+2 from last month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">284</div>
                        <p className="text-xs text-muted-foreground">+18% from last month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Interviews Scheduled</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">15</div>
                        <p className="text-xs text-muted-foreground">8 this week</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Hired This Month</CardTitle>
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">22</div>
                        <p className="text-xs text-muted-foreground">+5 from target</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Application Trends */}
                <Card>
                    <CardHeader>
                        <CardTitle>Application Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={applicationData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="applications" stroke="#0a3141" strokeWidth={2} />
                                <Line type="monotone" dataKey="hired" stroke="#d2f277" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Job Status Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Job Status Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={jobStatusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={120}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {jobStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            {jobStatusData.map((item, index) => (
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

            {/* Recent Applications & Upcoming Interviews */}
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
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                        <span className="text-sm font-medium">
                                            {application.candidate
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium">{application.candidate}</h4>
                                        <p className="text-sm text-gray-500">{application.position}</p>
                                    </div>
                                    <div className="text-right">
                                        <Badge className={getStatusColor(application.status)}>{application.status}</Badge>
                                        <p className="text-xs text-gray-500 mt-1">{application.appliedDate}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Upcoming Interviews */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Upcoming Interviews</CardTitle>
                        <Button variant="outline" size="sm">
                            View Calendar
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {upcomingInterviews.map((interview) => (
                                <div key={interview.id} className="flex items-center gap-4 p-3 border rounded-lg">
                                    <div className="w-10 h-10 rounded-full bg-[#d2f277] flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-[#0a3141]" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium">{interview.candidate}</h4>
                                        <p className="text-sm text-gray-500">{interview.position}</p>
                                        <p className="text-xs text-gray-400">{interview.type}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium">{interview.date}</p>
                                        <p className="text-xs text-gray-500">{interview.time}</p>
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
                            <span className="text-sm">Post New Job</span>
                        </Button>
                        <Button variant="outline" className="h-20 flex flex-col gap-2">
                            <Users className="w-6 h-6" />
                            <span className="text-sm">Browse Candidates</span>
                        </Button>
                        <Button variant="outline" className="h-20 flex flex-col gap-2">
                            <MessageSquare className="w-6 h-6" />
                            <span className="text-sm">Send Messages</span>
                        </Button>
                        <Button variant="outline" className="h-20 flex flex-col gap-2">
                            <TrendingUp className="w-6 h-6" />
                            <span className="text-sm">View Reports</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
