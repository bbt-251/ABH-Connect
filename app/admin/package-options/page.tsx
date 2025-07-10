"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Package, Plus, MoreHorizontal, Edit, Trash2, DollarSign, Calendar, TrendingUp, Briefcase } from "lucide-react"

interface PackageOption {
  id: string
  name: string
  isActive: boolean
  cost: number
  jobPostCount: number
  featuresInTrending: boolean
  associateExpiration: boolean
  expirationDays?: number
}

export default function PackageOptionsPage() {
  const [packages, setPackages] = useState<PackageOption[]>([
    {
      id: "PKG001",
      name: "Basic Plan",
      isActive: true,
      cost: 29.99,
      jobPostCount: 5,
      featuresInTrending: false,
      associateExpiration: true,
      expirationDays: 30,
    },
    {
      id: "PKG002",
      name: "Professional Plan",
      isActive: true,
      cost: 79.99,
      jobPostCount: 15,
      featuresInTrending: true,
      associateExpiration: true,
      expirationDays: 60,
    },
    {
      id: "PKG003",
      name: "Enterprise Plan",
      isActive: true,
      cost: 199.99,
      jobPostCount: 50,
      featuresInTrending: true,
      associateExpiration: false,
    },
    {
      id: "PKG004",
      name: "Startup Plan",
      isActive: false,
      cost: 49.99,
      jobPostCount: 10,
      featuresInTrending: true,
      associateExpiration: true,
      expirationDays: 45,
    },
    {
      id: "PKG005",
      name: "Premium Plan",
      isActive: true,
      cost: 149.99,
      jobPostCount: 30,
      featuresInTrending: true,
      associateExpiration: true,
      expirationDays: 90,
    },
  ])

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingPackage, setEditingPackage] = useState<PackageOption | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    isActive: true,
    cost: 0,
    jobPostCount: 0,
    featuresInTrending: false,
    associateExpiration: false,
    expirationDays: 30,
  })

  const resetForm = () => {
    setFormData({
      name: "",
      isActive: true,
      cost: 0,
      jobPostCount: 0,
      featuresInTrending: false,
      associateExpiration: false,
      expirationDays: 30,
    })
  }

  const handleCreate = () => {
    const newPackage: PackageOption = {
      id: `PKG${String(packages.length + 1).padStart(3, "0")}`,
      ...formData,
      expirationDays: formData.associateExpiration ? formData.expirationDays : undefined,
    }
    setPackages([...packages, newPackage])
    setShowCreateModal(false)
    resetForm()
  }

  const handleEdit = (pkg: PackageOption) => {
    setEditingPackage(pkg)
    setFormData({
      name: pkg.name,
      isActive: pkg.isActive,
      cost: pkg.cost,
      jobPostCount: pkg.jobPostCount,
      featuresInTrending: pkg.featuresInTrending,
      associateExpiration: pkg.associateExpiration,
      expirationDays: pkg.expirationDays || 30,
    })
    setShowEditModal(true)
  }

  const handleUpdate = () => {
    if (!editingPackage) return

    const updatedPackages = packages.map((pkg) =>
      pkg.id === editingPackage.id
        ? {
            ...pkg,
            ...formData,
            expirationDays: formData.associateExpiration ? formData.expirationDays : undefined,
          }
        : pkg,
    )
    setPackages(updatedPackages)
    setShowEditModal(false)
    setEditingPackage(null)
    resetForm()
  }

  const handleDelete = (id: string) => {
    setPackages(packages.filter((pkg) => pkg.id !== id))
  }

  const toggleStatus = (id: string) => {
    setPackages(packages.map((pkg) => (pkg.id === id ? { ...pkg, isActive: !pkg.isActive } : pkg)))
  }

  const stats = [
    {
      title: "Total Packages",
      value: packages.length.toString(),
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Packages",
      value: packages.filter((pkg) => pkg.isActive).length.toString(),
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Average Cost",
      value: `$${(packages.reduce((sum, pkg) => sum + pkg.cost, 0) / packages.length).toFixed(0)}`,
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Total Job Posts",
      value: packages.reduce((sum, pkg) => sum + pkg.jobPostCount, 0).toString(),
      icon: Briefcase,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  const PackageForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Package Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter package name"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
        />
        <Label htmlFor="isActive">Active Package</Label>
      </div>

      <div>
        <Label htmlFor="cost">Package Cost ($)</Label>
        <Input
          id="cost"
          type="number"
          step="0.01"
          min="0"
          value={formData.cost}
          onChange={(e) => setFormData({ ...formData, cost: Number.parseFloat(e.target.value) || 0 })}
          placeholder="0.00"
        />
      </div>

      <div>
        <Label htmlFor="jobPostCount">Number of Job Posts</Label>
        <Input
          id="jobPostCount"
          type="number"
          min="0"
          value={formData.jobPostCount}
          onChange={(e) => setFormData({ ...formData, jobPostCount: Number.parseInt(e.target.value) || 0 })}
          placeholder="0"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="featuresInTrending"
          checked={formData.featuresInTrending}
          onCheckedChange={(checked) => setFormData({ ...formData, featuresInTrending: checked })}
        />
        <Label htmlFor="featuresInTrending">Features in Trending Jobs</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="associateExpiration"
          checked={formData.associateExpiration}
          onCheckedChange={(checked) => setFormData({ ...formData, associateExpiration: checked })}
        />
        <Label htmlFor="associateExpiration">Associate Expiration</Label>
      </div>

      {formData.associateExpiration && (
        <div>
          <Label htmlFor="expirationDays">Number of Days Before Expiration</Label>
          <Input
            id="expirationDays"
            type="number"
            min="1"
            value={formData.expirationDays}
            onChange={(e) => setFormData({ ...formData, expirationDays: Number.parseInt(e.target.value) || 30 })}
            placeholder="30"
          />
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Package Options</h1>
            <p className="text-gray-600 mt-1">Manage subscription packages and pricing plans</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Packages Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Package Management</CardTitle>
                <CardDescription>Create and manage subscription packages</CardDescription>
              </div>
              <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Package
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Package</DialogTitle>
                    <DialogDescription>Define a new subscription package with pricing and features.</DialogDescription>
                  </DialogHeader>
                  <PackageForm />
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreate} disabled={!formData.name.trim()}>
                      Create Package
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Package Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Job Posts</TableHead>
                  <TableHead>Trending</TableHead>
                  <TableHead>Expiration</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packages.map((pkg) => (
                  <TableRow key={pkg.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold">{pkg.name}</div>
                        <div className="text-sm text-gray-500">{pkg.id}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={pkg.isActive ? "default" : "secondary"}
                        className={pkg.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                      >
                        {pkg.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold">${pkg.cost}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-1 text-gray-400" />
                        {pkg.jobPostCount}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={pkg.featuresInTrending ? "default" : "outline"}>
                        {pkg.featuresInTrending ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {pkg.associateExpiration ? (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                          {pkg.expirationDays} days
                        </div>
                      ) : (
                        <Badge variant="outline">No Expiration</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(pkg)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleStatus(pkg.id)}>
                            <TrendingUp className="h-4 w-4 mr-2" />
                            {pkg.isActive ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(pkg.id)} className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Modal */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Package</DialogTitle>
              <DialogDescription>Update the package details and features.</DialogDescription>
            </DialogHeader>
            <PackageForm isEdit />
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate} disabled={!formData.name.trim()}>
                Update Package
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
