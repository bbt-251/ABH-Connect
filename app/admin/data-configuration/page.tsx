"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  GraduationCap,
  Briefcase,
  School,
  Building2,
  Users,
  ScalingIcon as Resize,
  FolderOpen,
  Clock,
  MapPin,
  Monitor,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Filter,
} from "lucide-react"

interface DataItem {
  id: string
  value: string
  active: boolean
  createdAt: string
}

export default function DataConfiguration() {
  const [selectedCategory, setSelectedCategory] = useState("education")
  const [statusFilter, setStatusFilter] = useState("all") // all, active, inactive
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [newItem, setNewItem] = useState("")
  const [newItemActive, setNewItemActive] = useState(true)
  const [editingItem, setEditingItem] = useState({ id: "", value: "", active: true, category: "" })

  // Sample data with active status - in real app this would come from database
  const [configData, setConfigData] = useState<Record<string, DataItem[]>>({
    education: [
      { id: "1", value: "High School Diploma", active: true, createdAt: "2024-01-15" },
      { id: "2", value: "Associate Degree", active: true, createdAt: "2024-01-15" },
      { id: "3", value: "Bachelor's Degree", active: true, createdAt: "2024-01-15" },
      { id: "4", value: "Master's Degree", active: true, createdAt: "2024-01-15" },
      { id: "5", value: "Doctorate/PhD", active: true, createdAt: "2024-01-15" },
      { id: "6", value: "Professional Certificate", active: false, createdAt: "2024-01-15" },
      { id: "7", value: "Trade School Certificate", active: true, createdAt: "2024-01-15" },
    ],
    experience: [
      { id: "1", value: "Entry Level (0-1 years)", active: true, createdAt: "2024-01-15" },
      { id: "2", value: "Junior (1-3 years)", active: true, createdAt: "2024-01-15" },
      { id: "3", value: "Mid-Level (3-5 years)", active: true, createdAt: "2024-01-15" },
      { id: "4", value: "Senior (5-8 years)", active: true, createdAt: "2024-01-15" },
      { id: "5", value: "Lead (8-12 years)", active: false, createdAt: "2024-01-15" },
      { id: "6", value: "Principal (12+ years)", active: true, createdAt: "2024-01-15" },
    ],
    schools: [
      { id: "1", value: "Harvard University", active: true, createdAt: "2024-01-15" },
      { id: "2", value: "Stanford University", active: true, createdAt: "2024-01-15" },
      { id: "3", value: "MIT", active: true, createdAt: "2024-01-15" },
      { id: "4", value: "University of California", active: false, createdAt: "2024-01-15" },
      { id: "5", value: "New York University", active: true, createdAt: "2024-01-15" },
      { id: "6", value: "Columbia University", active: true, createdAt: "2024-01-15" },
      { id: "7", value: "Yale University", active: true, createdAt: "2024-01-15" },
    ],
    industry: [
      { id: "1", value: "Technology", active: true, createdAt: "2024-01-15" },
      { id: "2", value: "Healthcare", active: true, createdAt: "2024-01-15" },
      { id: "3", value: "Finance", active: true, createdAt: "2024-01-15" },
      { id: "4", value: "Education", active: true, createdAt: "2024-01-15" },
      { id: "5", value: "Manufacturing", active: false, createdAt: "2024-01-15" },
      { id: "6", value: "Retail", active: true, createdAt: "2024-01-15" },
      { id: "7", value: "Consulting", active: true, createdAt: "2024-01-15" },
      { id: "8", value: "Media & Entertainment", active: true, createdAt: "2024-01-15" },
    ],
    companyType: [
      { id: "1", value: "Startup", active: true, createdAt: "2024-01-15" },
      { id: "2", value: "Small Business", active: true, createdAt: "2024-01-15" },
      { id: "3", value: "Mid-size Company", active: true, createdAt: "2024-01-15" },
      { id: "4", value: "Large Corporation", active: true, createdAt: "2024-01-15" },
      { id: "5", value: "Non-profit", active: false, createdAt: "2024-01-15" },
      { id: "6", value: "Government", active: true, createdAt: "2024-01-15" },
      { id: "7", value: "Consulting Firm", active: true, createdAt: "2024-01-15" },
      { id: "8", value: "Agency", active: true, createdAt: "2024-01-15" },
    ],
    companySize: [
      { id: "1", value: "1-10 employees", active: true, createdAt: "2024-01-15" },
      { id: "2", value: "11-50 employees", active: true, createdAt: "2024-01-15" },
      { id: "3", value: "51-200 employees", active: true, createdAt: "2024-01-15" },
      { id: "4", value: "201-500 employees", active: true, createdAt: "2024-01-15" },
      { id: "5", value: "501-1000 employees", active: false, createdAt: "2024-01-15" },
      { id: "6", value: "1001-5000 employees", active: true, createdAt: "2024-01-15" },
      { id: "7", value: "5000+ employees", active: true, createdAt: "2024-01-15" },
    ],
    category: [
      { id: "1", value: "Software Development", active: true, createdAt: "2024-01-15" },
      { id: "2", value: "Data Science", active: true, createdAt: "2024-01-15" },
      { id: "3", value: "Marketing", active: true, createdAt: "2024-01-15" },
      { id: "4", value: "Sales", active: true, createdAt: "2024-01-15" },
      { id: "5", value: "Human Resources", active: false, createdAt: "2024-01-15" },
      { id: "6", value: "Finance", active: true, createdAt: "2024-01-15" },
      { id: "7", value: "Operations", active: true, createdAt: "2024-01-15" },
      { id: "8", value: "Customer Service", active: true, createdAt: "2024-01-15" },
    ],
    employmentType: [
      { id: "1", value: "Full-time", active: true, createdAt: "2024-01-15" },
      { id: "2", value: "Part-time", active: true, createdAt: "2024-01-15" },
      { id: "3", value: "Contract", active: true, createdAt: "2024-01-15" },
      { id: "4", value: "Temporary", active: false, createdAt: "2024-01-15" },
      { id: "5", value: "Internship", active: true, createdAt: "2024-01-15" },
      { id: "6", value: "Freelance", active: true, createdAt: "2024-01-15" },
      { id: "7", value: "Volunteer", active: false, createdAt: "2024-01-15" },
    ],
    location: [
      { id: "1", value: "New York, NY", active: true, createdAt: "2024-01-15" },
      { id: "2", value: "San Francisco, CA", active: true, createdAt: "2024-01-15" },
      { id: "3", value: "Los Angeles, CA", active: true, createdAt: "2024-01-15" },
      { id: "4", value: "Chicago, IL", active: false, createdAt: "2024-01-15" },
      { id: "5", value: "Boston, MA", active: true, createdAt: "2024-01-15" },
      { id: "6", value: "Seattle, WA", active: true, createdAt: "2024-01-15" },
      { id: "7", value: "Austin, TX", active: true, createdAt: "2024-01-15" },
      { id: "8", value: "Remote", active: true, createdAt: "2024-01-15" },
    ],
    workMode: [
      { id: "1", value: "Remote", active: true, createdAt: "2024-01-15" },
      { id: "2", value: "On-site", active: true, createdAt: "2024-01-15" },
      { id: "3", value: "Hybrid", active: true, createdAt: "2024-01-15" },
      { id: "4", value: "Flexible", active: false, createdAt: "2024-01-15" },
    ],
    jobLevel: [
      { id: "1", value: "Intern", active: true, createdAt: "2024-01-15" },
      { id: "2", value: "Entry Level", active: true, createdAt: "2024-01-15" },
      { id: "3", value: "Associate", active: true, createdAt: "2024-01-15" },
      { id: "4", value: "Mid-Level", active: true, createdAt: "2024-01-15" },
      { id: "5", value: "Senior", active: true, createdAt: "2024-01-15" },
      { id: "6", value: "Lead", active: false, createdAt: "2024-01-15" },
      { id: "7", value: "Manager", active: true, createdAt: "2024-01-15" },
      { id: "8", value: "Director", active: true, createdAt: "2024-01-15" },
      { id: "9", value: "VP", active: true, createdAt: "2024-01-15" },
      { id: "10", value: "C-Level", active: true, createdAt: "2024-01-15" },
    ],
  })

  const categories = [
    { id: "education", label: "Level of Education", icon: GraduationCap, color: "text-blue-600" },
    { id: "experience", label: "Years of Experience", icon: Briefcase, color: "text-green-600" },
    { id: "schools", label: "Schools", icon: School, color: "text-purple-600" },
    { id: "industry", label: "Company Industry", icon: Building2, color: "text-orange-600" },
    { id: "companyType", label: "Company Type", icon: Users, color: "text-red-600" },
    { id: "companySize", label: "Company Size", icon: Resize, color: "text-indigo-600" },
    { id: "category", label: "Job Category", icon: FolderOpen, color: "text-pink-600" },
    { id: "employmentType", label: "Employment Type", icon: Clock, color: "text-teal-600" },
    { id: "location", label: "Location", icon: MapPin, color: "text-cyan-600" },
    { id: "workMode", label: "Work Mode", icon: Monitor, color: "text-amber-600" },
    { id: "jobLevel", label: "Job Level", icon: TrendingUp, color: "text-emerald-600" },
  ]

  const handleAddItem = () => {
    if (newItem.trim()) {
      const newDataItem: DataItem = {
        id: Date.now().toString(),
        value: newItem.trim(),
        active: newItemActive,
        createdAt: new Date().toISOString().split("T")[0],
      }
      setConfigData((prev) => ({
        ...prev,
        [selectedCategory]: [...prev[selectedCategory], newDataItem],
      }))
      setNewItem("")
      setNewItemActive(true)
      setIsAddModalOpen(false)
    }
  }

  const handleEditItem = () => {
    if (editingItem.value.trim()) {
      setConfigData((prev) => ({
        ...prev,
        [editingItem.category]: prev[editingItem.category].map((item) =>
          item.id === editingItem.id ? { ...item, value: editingItem.value.trim(), active: editingItem.active } : item,
        ),
      }))
      setEditingItem({ id: "", value: "", active: true, category: "" })
      setIsEditModalOpen(false)
    }
  }

  const handleDeleteItem = (category: string, id: string) => {
    setConfigData((prev) => ({
      ...prev,
      [category]: prev[category].filter((item) => item.id !== id),
    }))
  }

  const handleToggleStatus = (category: string, id: string) => {
    setConfigData((prev) => ({
      ...prev,
      [category]: prev[category].map((item) => (item.id === id ? { ...item, active: !item.active } : item)),
    }))
  }

  const startEdit = (category: string, item: DataItem) => {
    setEditingItem({ id: item.id, value: item.value, active: item.active, category })
    setIsEditModalOpen(true)
  }

  const selectedCategoryData = categories.find((cat) => cat.id === selectedCategory)
  const Icon = selectedCategoryData?.icon || GraduationCap

  // Filter data based on status
  const filteredData =
    configData[selectedCategory]?.filter((item) => {
      if (statusFilter === "active") return item.active
      if (statusFilter === "inactive") return !item.active
      return true // all
    }) || []

  const getStatusCounts = (categoryId: string) => {
    const data = configData[categoryId] || []
    const active = data.filter((item) => item.active).length
    const inactive = data.filter((item) => !item.active).length
    return { total: data.length, active, inactive }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Data Configuration</h1>
              <p className="text-gray-600 mt-1">Configure dynamic data options for the platform</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Items</SelectItem>
                    <SelectItem value="active">Active Only</SelectItem>
                    <SelectItem value="inactive">Inactive Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Item
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Category Selector */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
                <CardDescription>Select a category to configure</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {categories.map((category) => {
                    const CategoryIcon = category.icon
                    const counts = getStatusCounts(category.id)
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                          selectedCategory === category.id ? "bg-blue-50 border-r-2 border-blue-500" : ""
                        }`}
                      >
                        <CategoryIcon className={`h-5 w-5 ${category.color}`} />
                        <div className="flex-1">
                          <span className="font-medium block">{category.label}</span>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span className="flex items-center">
                              <Eye className="h-3 w-3 mr-1" />
                              {counts.active}
                            </span>
                            <span className="flex items-center">
                              <EyeOff className="h-3 w-3 mr-1" />
                              {counts.inactive}
                            </span>
                          </div>
                        </div>
                        <Badge variant="secondary">{counts.total}</Badge>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Data Management */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon className={`h-6 w-6 ${selectedCategoryData?.color}`} />
                    <div>
                      <CardTitle>{selectedCategoryData?.label}</CardTitle>
                      <CardDescription>
                        Manage {selectedCategoryData?.label.toLowerCase()} options
                        {statusFilter !== "all" && (
                          <span className="ml-2 text-sm">
                            • Showing {statusFilter} items ({filteredData.length})
                          </span>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                  <Button onClick={() => setIsAddModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {filteredData.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[40%]">Item Name</TableHead>
                          <TableHead className="w-[15%]">Status</TableHead>
                          <TableHead className="w-[15%]">Created</TableHead>
                          <TableHead className="w-[15%]">Toggle</TableHead>
                          <TableHead className="w-[15%] text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredData.map((item) => (
                          <TableRow key={item.id} className={`${item.active ? "" : "opacity-60 bg-gray-50"}`}>
                            <TableCell className="font-medium">
                              <span className={item.active ? "text-gray-900" : "text-gray-500"}>{item.value}</span>
                            </TableCell>
                            <TableCell>
                              {item.active ? (
                                <Badge variant="default" className="bg-green-100 text-green-800">
                                  Active
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="bg-red-100 text-red-800">
                                  Inactive
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-gray-500 text-sm">{item.createdAt}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  checked={item.active}
                                  onCheckedChange={() => handleToggleStatus(selectedCategory, item.id)}
                                  className="data-[state=checked]:bg-green-600"
                                />
                                <span className="text-xs text-gray-500">{item.active ? "Active" : "Inactive"}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => startEdit(selectedCategory, item)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteItem(selectedCategory, item.id)}
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Icon className={`h-12 w-12 mx-auto ${selectedCategoryData?.color} opacity-50`} />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                      {statusFilter === "all" ? "No items configured" : `No ${statusFilter} items found`}
                    </h3>
                    <p className="mt-2 text-gray-600">
                      {statusFilter === "all"
                        ? `Add your first ${selectedCategoryData?.label.toLowerCase()} option to get started.`
                        : `Try changing the filter or add new ${selectedCategoryData?.label.toLowerCase()} options.`}
                    </p>
                    {statusFilter === "all" && (
                      <Button className="mt-4" onClick={() => setIsAddModalOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Item
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Add Item Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New {selectedCategoryData?.label}</DialogTitle>
            <DialogDescription>Add a new option for {selectedCategoryData?.label.toLowerCase()}.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="newItem">Item Name</Label>
              <Input
                id="newItem"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder={`Enter ${selectedCategoryData?.label.toLowerCase()} option`}
                onKeyPress={(e) => e.key === "Enter" && handleAddItem()}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="newItemActive"
                checked={newItemActive}
                onCheckedChange={setNewItemActive}
                className="data-[state=checked]:bg-green-600"
              />
              <Label htmlFor="newItemActive">Set as active (available for selection)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddItem} disabled={!newItem.trim()}>
              <Save className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Item Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {selectedCategoryData?.label}</DialogTitle>
            <DialogDescription>Update the {selectedCategoryData?.label.toLowerCase()} option.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editItem">Item Name</Label>
              <Input
                id="editItem"
                value={editingItem.value}
                onChange={(e) => setEditingItem((prev) => ({ ...prev, value: e.target.value }))}
                placeholder={`Enter ${selectedCategoryData?.label.toLowerCase()} option`}
                onKeyPress={(e) => e.key === "Enter" && handleEditItem()}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="editItemActive"
                checked={editingItem.active}
                onCheckedChange={(checked) => setEditingItem((prev) => ({ ...prev, active: checked }))}
                className="data-[state=checked]:bg-green-600"
              />
              <Label htmlFor="editItemActive">Set as active (available for selection)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditItem} disabled={!editingItem.value.trim()}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
