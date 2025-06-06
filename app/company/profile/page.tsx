"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Building2, Shield, Settings } from "lucide-react"

export default function CompanyProfilePage() {
  const [activeTab, setActiveTab] = useState("company-info")
  const [formData, setFormData] = useState({
    companyName: "",
    companyType: "",
    companySize: "",
    country: "",
    cityLocation: "",
    businessEmail: "",
    phoneNumber: "",
    website: "",
    tinNumber: "",
    businessLicense: null,
    companyLogo: null,
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData((prev) => ({ ...prev, [field]: file }))
  }

  const calculateProgress = () => {
    const fields = Object.values(formData)
    const filledFields = fields.filter((field) => field !== "" && field !== null).length
    return Math.round((filledFields / fields.length) * 100)
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Company Profile</h1>
        <p className="text-gray-600">Manage your company information and settings</p>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Profile Completion</span>
          <span className="text-sm font-medium text-gray-700">{calculateProgress()}% Complete</span>
        </div>
        <Progress value={calculateProgress()} className="h-2" />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="company-info" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Company Information
          </TabsTrigger>
          <TabsTrigger value="account-admin" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Account Administration
          </TabsTrigger>
          <TabsTrigger value="business-verification" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Business Verification
          </TabsTrigger>
        </TabsList>

        <TabsContent value="company-info">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Please provide your company details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="companyName">
                  Company Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="companyName"
                  placeholder="Enter company name"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange("companyName", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyType">
                    Company Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.companyType}
                    onValueChange={(value) => handleInputChange("companyType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select company type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="corporation">Corporation</SelectItem>
                      <SelectItem value="llc">LLC</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="sole-proprietorship">Sole Proprietorship</SelectItem>
                      <SelectItem value="nonprofit">Non-Profit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companySize">
                    Company Size <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.companySize}
                    onValueChange={(value) => handleInputChange("companySize", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="51-200">51-200 employees</SelectItem>
                      <SelectItem value="201-500">201-500 employees</SelectItem>
                      <SelectItem value="501-1000">501-1000 employees</SelectItem>
                      <SelectItem value="1000+">1000+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">
                    Country <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="de">Germany</SelectItem>
                      <SelectItem value="fr">France</SelectItem>
                      <SelectItem value="au">Australia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cityLocation">City / Location</Label>
                  <Input
                    id="cityLocation"
                    placeholder="Enter city or location"
                    value={formData.cityLocation}
                    onChange={(e) => handleInputChange("cityLocation", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessEmail">Official Business Email</Label>
                <Input
                  id="businessEmail"
                  type="email"
                  placeholder="company@example.com"
                  value={formData.businessEmail}
                  onChange={(e) => handleInputChange("businessEmail", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Official Phone Number</Label>
                <div className="flex gap-2">
                  <Select defaultValue="+1">
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+1">🇺🇸 +1</SelectItem>
                      <SelectItem value="+44">🇬🇧 +44</SelectItem>
                      <SelectItem value="+49">🇩🇪 +49</SelectItem>
                      <SelectItem value="+33">🇫🇷 +33</SelectItem>
                      <SelectItem value="+61">🇦🇺 +61</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    id="phoneNumber"
                    placeholder="712 000 000"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-gray-500">Enter numbers only (spaces and hyphens allowed)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website URL</Label>
                <Input
                  id="website"
                  placeholder="https://www.company.com"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setActiveTab("account-admin")}>Continue</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account-admin">
          <Card>
            <CardHeader>
              <CardTitle>Account Administration</CardTitle>
              <CardDescription>Manage your account settings and permissions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Administrator Email</Label>
                  <Input id="adminEmail" type="email" placeholder="admin@company.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="billingEmail">Billing Contact Email</Label>
                  <Input id="billingEmail" type="email" placeholder="billing@company.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="est">Eastern Time (EST)</SelectItem>
                      <SelectItem value="cst">Central Time (CST)</SelectItem>
                      <SelectItem value="mst">Mountain Time (MST)</SelectItem>
                      <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Default Currency</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD - US Dollar</SelectItem>
                      <SelectItem value="eur">EUR - Euro</SelectItem>
                      <SelectItem value="gbp">GBP - British Pound</SelectItem>
                      <SelectItem value="cad">CAD - Canadian Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("company-info")}>
                  Back
                </Button>
                <Button onClick={() => setActiveTab("business-verification")}>Continue</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business-verification">
          <Card>
            <CardHeader>
              <CardTitle>Business Verification</CardTitle>
              <CardDescription>Verify your business credentials to complete registration.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="tinNumber">
                  TIN Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="tinNumber"
                  placeholder="Enter TIN number"
                  value={formData.tinNumber}
                  onChange={(e) => handleInputChange("tinNumber", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>
                  Business License <span className="text-red-500">*</span>
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700 mb-1">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500">PDF, JPG, PNG (max 10MB)</p>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload("businessLicense", e.target.files?.[0] || null)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Company Logo</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700 mb-1">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500">JPG, PNG, SVG (max 5MB) - Optional</p>
                  <input
                    type="file"
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.svg"
                    onChange={(e) => handleFileUpload("companyLogo", e.target.files?.[0] || null)}
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("account-admin")}>
                  Back
                </Button>
                <Button className="bg-green-500 hover:bg-green-600">Save Profile</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
