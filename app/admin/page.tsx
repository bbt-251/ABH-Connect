"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Building2, BarChart3, Brain, Package } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const stats = [
    {
      title: "Total Users",
      value: "2,847",
      description: "Active users on the platform",
      icon: Users,
      href: "/admin/users",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Companies",
      value: "156",
      description: "Registered companies",
      icon: Building2,
      href: "/admin/companies",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Applicants",
      value: "2,691",
      description: "Job seekers registered",
      icon: Users,
      href: "/admin/applicants",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Data Configuration",
      value: "Active",
      description: "System configuration status",
      icon: BarChart3,
      href: "/admin/data-configuration",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Skill Base",
      value: "124",
      description: "Skills and competencies",
      icon: Brain,
      href: "/admin/skill-base",
      color: "text-pink-600",
      bgColor: "bg-pink-100",
    },
    {
      title: "Package Options",
      value: "5",
      description: "Subscription packages",
      icon: Package,
      href: "/admin/package-options",
      color: "text-cyan-600",
      bgColor: "bg-cyan-100",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage users, companies, and system configuration</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Link key={stat.title} href={stat.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <CardDescription className="text-xs text-muted-foreground">{stat.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest system activities and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New company registration</p>
                    <p className="text-xs text-gray-500">TechCorp Solutions registered 2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">System update completed</p>
                    <p className="text-xs text-gray-500">Database optimization finished 4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Bulk user import</p>
                    <p className="text-xs text-gray-500">245 new applicants imported 6 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
