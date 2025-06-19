"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Building2,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  MapPin,
  Calendar,
  Users,
  Briefcase,
  Mail,
  Phone,
  Globe,
  Plus,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function CompanyManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [industryFilter, setIndustryFilter] = useState("all")
  const [selectedCompanies, setSelectedCompanies] = useState<number[]>([])
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [showRejectionModal, setShowRejectionModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<any>(null)
  const [approvalReason, setApprovalReason] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")
  const [showSuspendModal, setShowSuspendModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [suspendReason, setSuspendReason] = useState("")
  const [deleteReason, setDeleteReason] = useState("")
  const [editFormData, setEditFormData] = useState<any>({})
  const [createFormData, setCreateFormData] = useState({
    name: "",
    industry: "",
    location: "",
    email: "",
    phone: "",
    website: "",
    employees: "",
    description: "",
    adminContact: "",
    adminEmail: "",
    adminPhone: "",
  })

  const companies = [
    {
      id: 1,
      name: "TechCorp Inc.",
      industry: "Technology",
      location: "San Francisco, CA",
      email: "admin@techcorp.com",
      phone: "+1 (555) 123-4567",
      website: "www.techcorp.com",
      registrationDate: "2024-01-15",
      status: "pending",
      employees: "500-1000",
      jobsPosted: 0,
      applications: 0,
      description: "Leading technology company specializing in AI and machine learning solutions.",
      adminContact: "John Smith",
      adminEmail: "john.smith@techcorp.com",
      adminPhone: "+1 (555) 123-4567",
    },
    {
      id: 2,
      name: "DataSoft Solutions",
      industry: "Software",
      location: "New York, NY",
      email: "hr@datasoft.com",
      phone: "+1 (555) 987-6543",
      website: "www.datasoft.com",
      registrationDate: "2024-01-10",
      status: "approved",
      employees: "100-500",
      jobsPosted: 12,
      applications: 156,
      description: "Data analytics and software development company.",
      adminContact: "Sarah Johnson",
      adminEmail: "sarah.johnson@datasoft.com",
      adminPhone: "+1 (555) 987-6543",
    },
    {
      id: 3,
      name: "FakeCompany Ltd.",
      industry: "Unknown",
      location: "Unknown",
      email: "fake@fake.com",
      phone: "N/A",
      website: "N/A",
      registrationDate: "2024-01-20",
      status: "suspended",
      employees: "Unknown",
      jobsPosted: 0,
      applications: 0,
      description: "Suspicious company with incomplete information.",
      adminContact: "Unknown",
      adminEmail: "fake@fake.com",
      adminPhone: "N/A",
    },
    {
      id: 4,
      name: "InvalidCorp",
      industry: "Finance",
      location: "Chicago, IL",
      email: "info@invalidcorp.com",
      phone: "+1 (555) 456-7890",
      website: "www.invalidcorp.com",
      registrationDate: "2024-01-18",
      status: "rejected",
      employees: "50-100",
      jobsPosted: 0,
      applications: 0,
      description: "Financial services company - rejected due to incomplete documentation.",
      adminContact: "Mike Wilson",
      adminEmail: "mike.wilson@invalidcorp.com",
      adminPhone: "+1 (555) 456-7890",
    },
    {
      id: 5,
      name: "GreenTech Energy",
      industry: "Energy",
      location: "Austin, TX",
      email: "contact@greentech.com",
      phone: "+1 (555) 321-0987",
      website: "www.greentech.com",
      registrationDate: "2024-01-05",
      status: "approved",
      employees: "200-500",
      jobsPosted: 8,
      applications: 89,
      description: "Renewable energy solutions and consulting.",
      adminContact: "Lisa Chen",
      adminEmail: "lisa.chen@greentech.com",
      adminPhone: "+1 (555) 321-0987",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        )
      case "suspended":
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Suspended
          </Badge>
        )
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || company.status === statusFilter
    const matchesIndustry = industryFilter === "all" || company.industry === industryFilter

    return matchesSearch && matchesStatus && matchesIndustry
  })

  const handleApprove = (company: any) => {
    setSelectedCompany(company)
    setShowApprovalModal(true)
  }

  const handleReject = (company: any) => {
    setSelectedCompany(company)
    setShowRejectionModal(true)
  }

  const handleViewDetails = (company: any) => {
    setSelectedCompany(company)
    setShowDetailsModal(true)
  }

  const handleSuspend = (company: any) => {
    setSelectedCompany(company)
    setShowSuspendModal(true)
  }

  const handleDelete = (company: any) => {
    setSelectedCompany(company)
    setShowDeleteModal(true)
  }

  const handleEdit = (company: any) => {
    setSelectedCompany(company)
    setEditFormData({ ...company })
    setShowEditModal(true)
  }

  const confirmSuspension = () => {
    console.log(`Suspending company ${selectedCompany?.name} with reason: ${suspendReason}`)
    // Update company status to suspended
    setShowSuspendModal(false)
    setSuspendReason("")
    setSelectedCompany(null)
  }

  const confirmDeletion = () => {
    console.log(`Deleting company ${selectedCompany?.name} with reason: ${deleteReason}`)
    // Remove company from list
    setShowDeleteModal(false)
    setDeleteReason("")
    setSelectedCompany(null)
  }

  const handleCreateCompany = () => {
    console.log("Creating new company:", createFormData)
    // Add new company to list
    setShowCreateModal(false)
    setCreateFormData({
      name: "",
      industry: "",
      location: "",
      email: "",
      phone: "",
      website: "",
      employees: "",
      description: "",
      adminContact: "",
      adminEmail: "",
      adminPhone: "",
    })
  }

  const handleUpdateCompany = () => {
    console.log("Updating company:", editFormData)
    // Update company in list
    setShowEditModal(false)
    setEditFormData({})
    setSelectedCompany(null)
  }

  const confirmApproval = () => {
    console.log(`Approving company ${selectedCompany?.name} with reason: ${approvalReason}`)
    setShowApprovalModal(false)
    setApprovalReason("")
    setSelectedCompany(null)
  }

  const confirmRejection = () => {
    console.log(`Rejecting company ${selectedCompany?.name} with reason: ${rejectionReason}`)
    setShowRejectionModal(false)
    setRejectionReason("")
    setSelectedCompany(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Company Management</h1>
              <p className="text-gray-600 mt-1">Oversee and manage all registered companies</p>
            </div>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Company
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search companies by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Select value={industryFilter} onValueChange={setIndustryFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Software">Software</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Energy">Energy</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Companies List */}
        <div className="space-y-4">
          {filteredCompanies.map((company) => (
            <Card key={company.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {company.location}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {company.registrationDate}
                        </span>
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {company.employees}
                        </span>
                        <span className="flex items-center">
                          <Briefcase className="h-4 w-4 mr-1" />
                          {company.jobsPosted} jobs
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(company.status)}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(company)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        {company.status === "pending" && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleApprove(company)}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleReject(company)}>
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleEdit(company)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        {company.status === "approved" && (
                          <DropdownMenuItem onClick={() => handleSuspend(company)}>
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Suspend
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(company)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCompanies.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Approval Modal */}
      <Dialog open={showApprovalModal} onOpenChange={setShowApprovalModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Company</DialogTitle>
            <DialogDescription>
              You are about to approve {selectedCompany?.name}. Please provide a reason for approval.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="approval-reason">Approval Reason</Label>
              <Textarea
                id="approval-reason"
                placeholder="Enter reason for approval..."
                value={approvalReason}
                onChange={(e) => setApprovalReason(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowApprovalModal(false)}>
                Cancel
              </Button>
              <Button onClick={confirmApproval} disabled={!approvalReason.trim()}>
                Approve Company
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rejection Modal */}
      <Dialog open={showRejectionModal} onOpenChange={setShowRejectionModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Company</DialogTitle>
            <DialogDescription>
              You are about to reject {selectedCompany?.name}. Please provide a reason for rejection.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rejection-reason">Rejection Reason</Label>
              <Textarea
                id="rejection-reason"
                placeholder="Enter reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowRejectionModal(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmRejection} disabled={!rejectionReason.trim()}>
                Reject Company
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Company Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5" />
              <span>{selectedCompany?.name}</span>
            </DialogTitle>
            <DialogDescription>Complete company profile and activity overview</DialogDescription>
          </DialogHeader>
          {selectedCompany && (
            <div className="space-y-6">
              {/* Company Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Company Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      {selectedCompany.email}
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      {selectedCompany.phone}
                    </div>
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-gray-400" />
                      {selectedCompany.website}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      {selectedCompany.location}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Admin Contact</h4>
                  <div className="space-y-2 text-sm">
                    <div>{selectedCompany.adminContact}</div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      {selectedCompany.adminEmail}
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      {selectedCompany.adminPhone}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-semibold mb-3">Description</h4>
                <p className="text-sm text-gray-600">{selectedCompany.description}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{selectedCompany.jobsPosted}</div>
                  <div className="text-sm text-gray-600">Jobs Posted</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{selectedCompany.applications}</div>
                  <div className="text-sm text-gray-600">Applications</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{selectedCompany.employees}</div>
                  <div className="text-sm text-gray-600">Employees</div>
                </div>
              </div>

              {/* Status and Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Status:</span>
                  {getStatusBadge(selectedCompany.status)}
                </div>
                <div className="flex space-x-2">
                  {selectedCompany.status === "pending" && (
                    <>
                      <Button size="sm" onClick={() => handleApprove(selectedCompany)}>
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleReject(selectedCompany)}>
                        Reject
                      </Button>
                    </>
                  )}
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Suspend Modal */}
      <Dialog open={showSuspendModal} onOpenChange={setShowSuspendModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspend Company</DialogTitle>
            <DialogDescription>
              You are about to suspend {selectedCompany?.name}. Please provide a reason for suspension.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="suspend-reason">Suspension Reason</Label>
              <Textarea
                id="suspend-reason"
                placeholder="Enter reason for suspension..."
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowSuspendModal(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmSuspension} disabled={!suspendReason.trim()}>
                Suspend Company
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Company</DialogTitle>
            <DialogDescription>
              You are about to permanently delete {selectedCompany?.name}. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="delete-reason">Deletion Reason</Label>
              <Textarea
                id="delete-reason"
                placeholder="Enter reason for deletion..."
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDeletion} disabled={!deleteReason.trim()}>
                Delete Company
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Company Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Company</DialogTitle>
            <DialogDescription>Manually create a new company profile with all required information.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="create-name">Company Name *</Label>
                <Input
                  id="create-name"
                  value={createFormData.name}
                  onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })}
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <Label htmlFor="create-industry">Industry *</Label>
                <Select
                  value={createFormData.industry}
                  onValueChange={(value) => setCreateFormData({ ...createFormData, industry: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Software">Software</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Energy">Energy</SelectItem>
                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="Retail">Retail</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="create-email">Company Email *</Label>
                <Input
                  id="create-email"
                  type="email"
                  value={createFormData.email}
                  onChange={(e) => setCreateFormData({ ...createFormData, email: e.target.value })}
                  placeholder="company@example.com"
                />
              </div>
              <div>
                <Label htmlFor="create-phone">Phone Number</Label>
                <Input
                  id="create-phone"
                  value={createFormData.phone}
                  onChange={(e) => setCreateFormData({ ...createFormData, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <Label htmlFor="create-website">Website</Label>
                <Input
                  id="create-website"
                  value={createFormData.website}
                  onChange={(e) => setCreateFormData({ ...createFormData, website: e.target.value })}
                  placeholder="www.company.com"
                />
              </div>
              <div>
                <Label htmlFor="create-location">Location *</Label>
                <Input
                  id="create-location"
                  value={createFormData.location}
                  onChange={(e) => setCreateFormData({ ...createFormData, location: e.target.value })}
                  placeholder="City, State/Country"
                />
              </div>
              <div>
                <Label htmlFor="create-employees">Company Size</Label>
                <Select
                  value={createFormData.employees}
                  onValueChange={(value) => setCreateFormData({ ...createFormData, employees: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10 employees</SelectItem>
                    <SelectItem value="11-50">11-50 employees</SelectItem>
                    <SelectItem value="51-100">51-100 employees</SelectItem>
                    <SelectItem value="101-500">101-500 employees</SelectItem>
                    <SelectItem value="501-1000">501-1000 employees</SelectItem>
                    <SelectItem value="1000+">1000+ employees</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="create-admin-contact">Admin Contact Name *</Label>
                <Input
                  id="create-admin-contact"
                  value={createFormData.adminContact}
                  onChange={(e) => setCreateFormData({ ...createFormData, adminContact: e.target.value })}
                  placeholder="John Smith"
                />
              </div>
              <div>
                <Label htmlFor="create-admin-email">Admin Email *</Label>
                <Input
                  id="create-admin-email"
                  type="email"
                  value={createFormData.adminEmail}
                  onChange={(e) => setCreateFormData({ ...createFormData, adminEmail: e.target.value })}
                  placeholder="admin@company.com"
                />
              </div>
              <div>
                <Label htmlFor="create-admin-phone">Admin Phone</Label>
                <Input
                  id="create-admin-phone"
                  value={createFormData.adminPhone}
                  onChange={(e) => setCreateFormData({ ...createFormData, adminPhone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="create-description">Company Description</Label>
              <Textarea
                id="create-description"
                value={createFormData.description}
                onChange={(e) => setCreateFormData({ ...createFormData, description: e.target.value })}
                placeholder="Brief description of the company..."
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateCompany}
                disabled={
                  !createFormData.name ||
                  !createFormData.industry ||
                  !createFormData.email ||
                  !createFormData.location ||
                  !createFormData.adminContact ||
                  !createFormData.adminEmail
                }
              >
                Create Company
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Company Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
            <DialogDescription>Update company information and details.</DialogDescription>
          </DialogHeader>
          {editFormData && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Company Name *</Label>
                  <Input
                    id="edit-name"
                    value={editFormData.name || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-industry">Industry *</Label>
                  <Select
                    value={editFormData.industry || ""}
                    onValueChange={(value) => setEditFormData({ ...editFormData, industry: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Software">Software</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Energy">Energy</SelectItem>
                      <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="Retail">Retail</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-email">Company Email *</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editFormData.email || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    placeholder="company@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-phone">Phone Number</Label>
                  <Input
                    id="edit-phone"
                    value={editFormData.phone || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-website">Website</Label>
                  <Input
                    id="edit-website"
                    value={editFormData.website || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, website: e.target.value })}
                    placeholder="www.company.com"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-location">Location *</Label>
                  <Input
                    id="edit-location"
                    value={editFormData.location || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                    placeholder="City, State/Country"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-employees">Company Size</Label>
                  <Select
                    value={editFormData.employees || ""}
                    onValueChange={(value) => setEditFormData({ ...editFormData, employees: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="51-100">51-100 employees</SelectItem>
                      <SelectItem value="101-500">101-500 employees</SelectItem>
                      <SelectItem value="501-1000">501-1000 employees</SelectItem>
                      <SelectItem value="1000+">1000+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-admin-contact">Admin Contact Name *</Label>
                  <Input
                    id="edit-admin-contact"
                    value={editFormData.adminContact || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, adminContact: e.target.value })}
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-admin-email">Admin Email *</Label>
                  <Input
                    id="edit-admin-email"
                    type="email"
                    value={editFormData.adminEmail || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, adminEmail: e.target.value })}
                    placeholder="admin@company.com"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-admin-phone">Admin Phone</Label>
                  <Input
                    id="edit-admin-phone"
                    value={editFormData.adminPhone || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, adminPhone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-description">Company Description</Label>
                <Textarea
                  id="edit-description"
                  value={editFormData.description || ""}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  placeholder="Brief description of the company..."
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowEditModal(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateCompany}
                  disabled={
                    !editFormData.name ||
                    !editFormData.industry ||
                    !editFormData.email ||
                    !editFormData.location ||
                    !editFormData.adminContact ||
                    !editFormData.adminEmail
                  }
                >
                  Update Company
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
