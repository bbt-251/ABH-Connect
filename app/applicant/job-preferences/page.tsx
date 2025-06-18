"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2, MapPin, DollarSign, Building, Users, Clock, Target, Bell, Save, X } from "lucide-react"

// Sample data for dropdowns
const industries = [
  "Information Technology",
  "Finance & Banking",
  "Healthcare & Medical",
  "Education",
  "Manufacturing",
  "Retail & E-commerce",
  "Marketing & Advertising",
  "Construction",
  "Transportation",
  "Government",
  "Non-profit",
  "Entertainment & Media",
]

const countries = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Netherlands",
  "Singapore",
  "Japan",
  "South Korea",
]

const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
]

const contractTypes = ["Full-time", "Part-time", "Contract", "Freelance", "Internship"]
const workModes = ["On-site", "Remote", "Hybrid"]
const companySizes = ["Startup (1-50)", "SME (51-500)", "Large Enterprise (500+)", "Government", "Non-profit"]
const jobLevels = ["Entry-level", "Mid-level", "Senior", "Executive", "Director"]

// Sample existing preferences
const samplePreferences = [
  {
    id: 1,
    name: "Software Development Roles",
    industries: ["Information Technology"],
    jobRoles: ["Software Engineer", "Full Stack Developer", "Backend Developer"],
    locations: ["United States", "Canada"],
    remoteAllowed: true,
    salaryRange: { min: 80000, max: 150000, currency: "USD", period: "annual" },
    contractTypes: ["Full-time"],
    workModes: ["Remote", "Hybrid"],
    companySizes: ["Startup (1-50)", "SME (51-500)"],
    jobLevels: ["Mid-level", "Senior"],
    isActive: true,
    alertsEnabled: true,
  },
  {
    id: 2,
    name: "Finance Opportunities",
    industries: ["Finance & Banking"],
    jobRoles: ["Financial Analyst", "Investment Banker", "Risk Manager"],
    locations: ["United Kingdom", "Germany"],
    remoteAllowed: false,
    salaryRange: { min: 60000, max: 120000, currency: "EUR", period: "annual" },
    contractTypes: ["Full-time", "Contract"],
    workModes: ["On-site", "Hybrid"],
    companySizes: ["Large Enterprise (500+)"],
    jobLevels: ["Mid-level", "Senior"],
    isActive: true,
    alertsEnabled: false,
  },
]

export default function JobPreferences() {
  const [preferences, setPreferences] = useState(samplePreferences)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingPreference, setEditingPreference] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    industries: [],
    jobRoles: [],
    locations: [],
    remoteAllowed: false,
    salaryRange: { min: "", max: "", currency: "USD", period: "annual" },
    contractTypes: [],
    workModes: [],
    companySizes: [],
    jobLevels: [],
    isActive: true,
    alertsEnabled: true,
  })

  const resetForm = () => {
    setFormData({
      name: "",
      industries: [],
      jobRoles: [],
      locations: [],
      remoteAllowed: false,
      salaryRange: { min: "", max: "", currency: "USD", period: "annual" },
      contractTypes: [],
      workModes: [],
      companySizes: [],
      jobLevels: [],
      isActive: true,
      alertsEnabled: true,
    })
  }

  const handleCreate = () => {
    setEditingPreference(null)
    resetForm()
    setShowCreateModal(true)
  }

  const handleEdit = (preference) => {
    setEditingPreference(preference)
    setFormData({ ...preference })
    setShowCreateModal(true)
  }

  const handleSave = () => {
    if (editingPreference) {
      setPreferences(preferences.map((p) => (p.id === editingPreference.id ? { ...formData, id: p.id } : p)))
    } else {
      setPreferences([...preferences, { ...formData, id: Date.now() }])
    }
    setShowCreateModal(false)
    resetForm()
  }

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this preference?")) {
      setPreferences(preferences.filter((p) => p.id !== id))
    }
  }

  const toggleActive = (id) => {
    setPreferences(preferences.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p)))
  }

  const toggleAlerts = (id) => {
    setPreferences(preferences.map((p) => (p.id === id ? { ...p, alertsEnabled: !p.alertsEnabled } : p)))
  }

  const handleMultiSelect = (field, value, checked) => {
    if (checked) {
      setFormData({ ...formData, [field]: [...formData[field], value] })
    } else {
      setFormData({ ...formData, [field]: formData[field].filter((item) => item !== value) })
    }
  }

  const handleJobRoleAdd = (value) => {
    if (value.trim() && !formData.jobRoles.includes(value.trim())) {
      setFormData({ ...formData, jobRoles: [...formData.jobRoles, value.trim()] })
    }
  }

  const handleJobRoleRemove = (role) => {
    setFormData({ ...formData, jobRoles: formData.jobRoles.filter((r) => r !== role) })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Preferences</h1>
          <p className="text-gray-600 mt-1">
            Manage your job preferences to get better matches and personalized recommendations
          </p>
        </div>
        <Button onClick={handleCreate} className="bg-[#0a3141] hover:bg-[#1a4a5c] text-white">
          <Plus className="w-4 h-4 mr-2" />
          Create Preference
        </Button>
      </div>

      {/* Preferences List */}
      <div className="space-y-4">
        {preferences.map((preference) => (
          <Card key={preference.id} className={`${!preference.isActive ? "opacity-60" : ""}`}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-lg">{preference.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant={preference.isActive ? "default" : "secondary"}>
                      {preference.isActive ? "Active" : "Inactive"}
                    </Badge>
                    {preference.alertsEnabled && (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        <Bell className="w-3 h-3 mr-1" />
                        Alerts On
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={preference.isActive}
                    onCheckedChange={() => toggleActive(preference.id)}
                    className="data-[state=checked]:bg-[#0a3141]"
                  />
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(preference)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(preference.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Industries */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Industries</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {preference.industries.map((industry) => (
                    <Badge key={industry} variant="outline">
                      {industry}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Job Roles */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Job Roles</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {preference.jobRoles.map((role) => (
                    <Badge key={role} variant="outline" className="bg-blue-50">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Locations & Salary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Locations</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {preference.locations.map((location) => (
                      <Badge key={location} variant="outline" className="bg-green-50">
                        <MapPin className="w-3 h-3 mr-1" />
                        {location}
                      </Badge>
                    ))}
                    {preference.remoteAllowed && (
                      <Badge variant="outline" className="bg-purple-50">
                        Remote OK
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Salary Range</Label>
                  <div className="mt-1">
                    <Badge variant="outline" className="bg-yellow-50">
                      <DollarSign className="w-3 h-3 mr-1" />
                      {currencies.find((c) => c.code === preference.salaryRange.currency)?.symbol}
                      {preference.salaryRange.min.toLocaleString()} -{" "}
                      {currencies.find((c) => c.code === preference.salaryRange.currency)?.symbol}
                      {preference.salaryRange.max.toLocaleString()} {preference.salaryRange.period}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Contract & Work Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Contract Types</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {preference.contractTypes.map((type) => (
                      <Badge key={type} variant="outline">
                        <Clock className="w-3 h-3 mr-1" />
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Work Modes</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {preference.workModes.map((mode) => (
                      <Badge key={mode} variant="outline">
                        {mode}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Company Sizes</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {preference.companySizes.map((size) => (
                      <Badge key={size} variant="outline">
                        <Building className="w-3 h-3 mr-1" />
                        {size}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Job Levels */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Job Levels</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {preference.jobLevels.map((level) => (
                    <Badge key={level} variant="outline">
                      <Users className="w-3 h-3 mr-1" />
                      {level}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`alerts-${preference.id}`} className="text-sm">
                      Email Alerts
                    </Label>
                    <Switch
                      id={`alerts-${preference.id}`}
                      checked={preference.alertsEnabled}
                      onCheckedChange={() => toggleAlerts(preference.id)}
                      className="data-[state=checked]:bg-[#0a3141]"
                    />
                  </div>
                </div>
                <div className="text-xs text-gray-500">Last updated: {new Date().toLocaleDateString()}</div>
              </div>
            </CardContent>
          </Card>
        ))}

        {preferences.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No job preferences yet</h3>
              <p className="text-gray-600 mb-4">
                Create your first job preference to get personalized job recommendations and alerts.
              </p>
              <Button onClick={handleCreate} className="bg-[#0a3141] hover:bg-[#1a4a5c] text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Preference
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPreference ? "Edit Job Preference" : "Create Job Preference"}</DialogTitle>
            <DialogDescription>
              Define your job preferences to get better matches and personalized recommendations.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Preference Name */}
            <div>
              <Label htmlFor="name">Preference Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Software Development Roles"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1"
              />
            </div>

            {/* Industries */}
            <div>
              <Label>Industries *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 max-h-32 overflow-y-auto border rounded-md p-3">
                {industries.map((industry) => (
                  <div key={industry} className="flex items-center space-x-2">
                    <Checkbox
                      id={`industry-${industry}`}
                      checked={formData.industries.includes(industry)}
                      onCheckedChange={(checked) => handleMultiSelect("industries", industry, checked)}
                    />
                    <Label htmlFor={`industry-${industry}`} className="text-sm">
                      {industry}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Job Roles */}
            <div>
              <Label>Job Roles / Titles *</Label>
              <div className="mt-2">
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Enter job role and press Enter"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleJobRoleAdd(e.target.value)
                        e.target.value = ""
                      }
                    }}
                  />
                </div>
                <div className="flex flex-wrap gap-1">
                  {formData.jobRoles.map((role) => (
                    <Badge key={role} variant="outline" className="bg-blue-50">
                      {role}
                      <button
                        onClick={() => handleJobRoleRemove(role)}
                        className="ml-1 text-red-500 hover:text-red-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Locations */}
            <div>
              <Label>Locations *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 max-h-32 overflow-y-auto border rounded-md p-3">
                {countries.map((country) => (
                  <div key={country} className="flex items-center space-x-2">
                    <Checkbox
                      id={`country-${country}`}
                      checked={formData.locations.includes(country)}
                      onCheckedChange={(checked) => handleMultiSelect("locations", country, checked)}
                    />
                    <Label htmlFor={`country-${country}`} className="text-sm">
                      {country}
                    </Label>
                  </div>
                ))}
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                  id="remote-allowed"
                  checked={formData.remoteAllowed}
                  onCheckedChange={(checked) => setFormData({ ...formData, remoteAllowed: checked })}
                />
                <Label htmlFor="remote-allowed">Allow remote work</Label>
              </div>
            </div>

            {/* Salary Range */}
            <div>
              <Label>Expected Salary Range</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                <div>
                  <Label className="text-xs">Minimum</Label>
                  <Input
                    type="number"
                    placeholder="Min salary"
                    value={formData.salaryRange.min}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        salaryRange: { ...formData.salaryRange, min: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <Label className="text-xs">Maximum</Label>
                  <Input
                    type="number"
                    placeholder="Max salary"
                    value={formData.salaryRange.max}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        salaryRange: { ...formData.salaryRange, max: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <Label className="text-xs">Currency</Label>
                  <Select
                    value={formData.salaryRange.currency}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        salaryRange: { ...formData.salaryRange, currency: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.symbol} {currency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Period</Label>
                  <Select
                    value={formData.salaryRange.period}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        salaryRange: { ...formData.salaryRange, period: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="annual">Annual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Contract Types */}
            <div>
              <Label>Contract Types *</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {contractTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`contract-${type}`}
                      checked={formData.contractTypes.includes(type)}
                      onCheckedChange={(checked) => handleMultiSelect("contractTypes", type, checked)}
                    />
                    <Label htmlFor={`contract-${type}`} className="text-sm">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Work Modes */}
            <div>
              <Label>Work Modes *</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {workModes.map((mode) => (
                  <div key={mode} className="flex items-center space-x-2">
                    <Checkbox
                      id={`work-${mode}`}
                      checked={formData.workModes.includes(mode)}
                      onCheckedChange={(checked) => handleMultiSelect("workModes", mode, checked)}
                    />
                    <Label htmlFor={`work-${mode}`} className="text-sm">
                      {mode}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Company Sizes */}
            <div>
              <Label>Company Sizes</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {companySizes.map((size) => (
                  <div key={size} className="flex items-center space-x-2">
                    <Checkbox
                      id={`company-${size}`}
                      checked={formData.companySizes.includes(size)}
                      onCheckedChange={(checked) => handleMultiSelect("companySizes", size, checked)}
                    />
                    <Label htmlFor={`company-${size}`} className="text-sm">
                      {size}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Job Levels */}
            <div>
              <Label>Job Levels</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {jobLevels.map((level) => (
                  <div key={level} className="flex items-center space-x-2">
                    <Checkbox
                      id={`level-${level}`}
                      checked={formData.jobLevels.includes(level)}
                      onCheckedChange={(checked) => handleMultiSelect("jobLevels", level, checked)}
                    />
                    <Label htmlFor={`level-${level}`} className="text-sm">
                      {level}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-3 border-t pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Active Preference</Label>
                  <p className="text-xs text-gray-500">Enable this preference for job matching</p>
                </div>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  className="data-[state=checked]:bg-[#0a3141]"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Alerts</Label>
                  <p className="text-xs text-gray-500">Receive notifications for matching jobs</p>
                </div>
                <Switch
                  checked={formData.alertsEnabled}
                  onCheckedChange={(checked) => setFormData({ ...formData, alertsEnabled: checked })}
                  className="data-[state=checked]:bg-[#0a3141]"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!formData.name || formData.industries.length === 0 || formData.jobRoles.length === 0}
              className="bg-[#0a3141] hover:bg-[#1a4a5c] text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {editingPreference ? "Update Preference" : "Create Preference"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
