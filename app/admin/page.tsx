"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Users,
  Building2,
  Briefcase,
  FileText,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Download,
  Settings,
  Eye,
} from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("")

  const stats = [
    {
      title: "Total Companies",
      value: "1,247",
      change: "+12%",
      icon: Building2,
      color: "text-blue-600",
    },
    {
      title: "Total Applicants",
      value: "8,932",
      change: "+8%",
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Active Jobs",
      value: "456",
      change: "+15%",
      icon: Briefcase,
      color: "text-purple-600",
    },
    {
      title: "Total Applications",
      value: "15,678",
      change: "+22%",
      icon: FileText,
      color: "text-orange-600",
    },
  ]

  const quickActions = [
    {
      title: "Approve Pending Companies",
      description: "23 companies awaiting approval",
      icon: CheckCircle,
      color: "bg-green-50 text-green-600 hover:bg-green-100",
      href: "/admin/companies?status=pending",
    },
    {
      title: "Review Flagged Content",
      description: "5 items need attention",
      icon: AlertTriangle,
      color: "bg-red-50 text-red-600 hover:bg-red-100",
      href: "/admin/flagged",
    },
    {
      title: "Generate Reports",
      description: "Create system reports",
      icon: Download,
      color: "bg-blue-50 text-blue-600 hover:bg-blue-100",
      href: "/admin/reports",
    },
    {
      title: "System Settings",
      description: "Configure platform settings",
      icon: Settings,
      color: "bg-gray-50 text-gray-600 hover:bg-gray-100",
      href: "/admin/settings",
    },
  ]

  const recentActivity = [
    {
      id: 1,
      type: "company_registration",
      message: "TechCorp Inc. registered for approval",
      time: "2 minutes ago",
      status: "pending",
    },
    {
      id: 2,
      type: "company_approved",
      message: "DataSoft Solutions approved by Admin",
      time: "15 minutes ago",
      status: "approved",
    },
    {
      id: 3,
      type: "company_suspended",
      message: "FakeCompany Ltd. suspended for violations",
      time: "1 hour ago",
      status: "suspended",
    },
    {
      id: 4,
      type: "bulk_action",
      message: "12 companies approved in bulk operation",
      time: "2 hours ago",
      status: "approved",
    },
    {
      id: 5,
      type: "company_rejected",
      message: "InvalidCorp rejected - incomplete information",
      time: "3 hours ago",
      status: "rejected",
    },
  ]

  const companyStatusDistribution = [
    { status: "Approved", count: 1089, color: "bg-green-500" },
    { status: "Pending", count: 23, color: "bg-yellow-500" },
    { status: "Suspended", count: 15, color: "bg-red-500" },
    { status: "Rejected", count: 120, color: "bg-gray-500" },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "suspended":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-gray-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your job portal platform</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
                    </div>
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon
                    return (
                      <Link key={index} href={action.href}>
                        <div
                          className={`p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors cursor-pointer ${action.color}`}
                        >
                          <div className="flex items-center space-x-3">
                            <Icon className="h-6 w-6" />
                            <div>
                              <h3 className="font-medium">{action.title}</h3>
                              <p className="text-sm opacity-75">{action.description}</p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Company Status Distribution */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Company Status Distribution</CardTitle>
                <CardDescription>Overview of company statuses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {companyStatusDistribution.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${item.color}`} />
                        <span className="font-medium">{item.status}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold">{item.count}</span>
                        <Link href={`/admin/companies?status=${item.status.toLowerCase()}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest system activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                      {getStatusIcon(activity.status)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Link href="/admin/activity">
                    <Button variant="ghost" className="w-full">
                      View All Activity
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/admin/companies">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Building2 className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-lg">Company Management</h3>
                    <p className="text-gray-600">Manage all registered companies</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/applicants">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Users className="h-8 w-8 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-lg">Applicant Management</h3>
                    <p className="text-gray-600">Oversee all job applicants</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/reports">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                  <div>
                    <h3 className="font-semibold text-lg">Analytics & Reports</h3>
                    <p className="text-gray-600">View platform analytics</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/admin/data-configuration">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Settings className="h-8 w-8 text-indigo-600" />
                  <div>
                    <h3 className="font-semibold text-lg">Data Configuration</h3>
                    <p className="text-gray-600">Configure dynamic data options</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
