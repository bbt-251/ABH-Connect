"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, User, Briefcase, Building, Shield, Check, CalendarIcon, X, Plus, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import CompanyModel from "@/models/company"
import { useRegister } from "@/hooks/auth/useRegister"
import { uploadBusinessLicense } from "@/lib/api/firebase/upload/uploadBusinessDocuments"
import { uploadCompanyLogo } from "@/lib/api/firebase/upload/uploadCompanyLogo"

// Interfaces
interface ApplicantRegistrationData {
    // Personal Information
    firstName: string
    surname: string
    birthDate: Date | undefined
    birthPlace: string
    gender: string
    levelOfEducation: string
    yearsOfExperience: string
    phoneCountryCode: string
    phone: string
    email: string
    faydaNumber: string
    tinNumber: string

    // Professional Experience
    currentPosition: string
    currentCompany: string
    currentSalary: string
    expectedSalary: string
    skills: string[]
    languages: string[]
    certifications: string[]
    workExperience: string
}

interface CompanyRegistrationData {
    companyName: string
    companyType: string
    companySize: string
    country: string
    cityLocation: string
    officialEmail: string
    officialPhoneCountryCode: string
    officialPhone: string
    websiteUrl: string
    fullName: string
    adminEmail: string
    adminPhoneCountryCode: string
    adminPhone: string
    password: string
    confirmPassword: string
    tinNumber: string
}

const applicantSteps = [
    {
        id: 1,
        title: "Personal Information",
        subtitle: "Provide your personal details",
        icon: User,
    },
    {
        id: 2,
        title: "Professional Experience",
        subtitle: "Share your professional background",
        icon: Briefcase,
    },
]

const companySteps = [
    {
        id: 1,
        title: "Company Information",
        subtitle: "Provide your company details",
        icon: Building,
    },
    {
        id: 2,
        title: "Administrator Details",
        subtitle: "Setup administrator account",
        icon: User,
    },
    {
        id: 3,
        title: "Business Verification",
        subtitle: "Verify your business credentials",
        icon: Shield,
    },
]

// Reference data
const educationLevels = [
    "Primary Education",
    "Secondary Education",
    "Certificate",
    "Diploma",
    "Bachelor's Degree",
    "Master's Degree",
    "PhD/Doctorate",
    "Professional Certification",
    "Other",
]

const experienceYears = [
    "Fresh Graduate (0 years)",
    "1-2 years",
    "3-5 years",
    "6-10 years",
    "11-15 years",
    "16-20 years",
    "20+ years",
]

const countryCodes = [
    { code: "+255", country: "Tanzania", flag: "🇹🇿", length: 9 },
    { code: "+254", country: "Kenya", flag: "🇰🇪", length: 9 },
    { code: "+256", country: "Uganda", flag: "🇺🇬", length: 9 },
    { code: "+250", country: "Rwanda", flag: "🇷🇼", length: 9 },
    { code: "+257", country: "Burundi", flag: "🇧🇮", length: 8 },
    { code: "+1", country: "United States", flag: "🇺🇸", length: 10 },
    { code: "+44", country: "United Kingdom", flag: "🇬🇧", length: 10 },
    { code: "+1", country: "Canada", flag: "🇨🇦", length: 10 },
]

const companyTypes = [
    "Private Limited Company",
    "Public Limited Company",
    "Partnership",
    "Sole Proprietorship",
    "NGO/Non-Profit",
    "Government Agency",
    "Startup",
    "Corporation",
    "Other",
]

const companySizes = [
    "1-10 employees",
    "11-50 employees",
    "51-200 employees",
    "201-500 employees",
    "501-1000 employees",
    "1000+ employees",
]

const countries = [
    "Tanzania",
    "Kenya",
    "Uganda",
    "Rwanda",
    "Burundi",
    "United States",
    "United Kingdom",
    "Canada",
    "Other",
]

export default function RegisterPage() {
    const searchParams = useSearchParams()
    const router = useRouter() // Add this line to get the router
    const userType = searchParams.get("type") || "applicant"
    const [currentStep, setCurrentStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [validationErrors, setValidationErrors] = useState<string[]>([])
    const [newSkill, setNewSkill] = useState("")
    const [newLanguage, setNewLanguage] = useState("")
    const [newCertification, setNewCertification] = useState("")
    const [businessLicenseFile, setBusinessLicenseFile] = useState<File | null>(null);
    const [companyLogoFile, setCompanyLogoFile] = useState<File | null>(null);

    const { register } = useRegister()

    const steps = userType === "applicant" ? applicantSteps : companySteps

    const [applicantData, setApplicantData] = useState<ApplicantRegistrationData>({
        firstName: "",
        surname: "",
        birthDate: undefined,
        birthPlace: "",
        gender: "",
        levelOfEducation: "",
        yearsOfExperience: "",
        phoneCountryCode: "+255",
        phone: "",
        email: "",
        faydaNumber: "",
        tinNumber: "",
        currentPosition: "",
        currentCompany: "",
        currentSalary: "",
        expectedSalary: "",
        skills: [],
        languages: [],
        certifications: [],
        workExperience: "",
    })

    const [companyData, setCompanyData] = useState<CompanyRegistrationData>({
        companyName: "",
        companyType: "",
        companySize: "",
        country: "",
        cityLocation: "",
        officialEmail: "",
        officialPhoneCountryCode: "+255",
        officialPhone: "",
        websiteUrl: "",
        fullName: "",
        adminEmail: "",
        adminPhoneCountryCode: "+255",
        adminPhone: "",
        password: "",
        confirmPassword: "",
        tinNumber: "",
    })

    const handleInputChange = (field: keyof ApplicantRegistrationData, value: any) => {
        setApplicantData((prev) => ({ ...prev, [field]: value }))
    }

    const handleCompanyInputChange = (field: keyof CompanyRegistrationData, value: string) => {
        setCompanyData((prev) => ({ ...prev, [field]: value }))
    }

    const handlePhoneNumberChange = (field: keyof ApplicantRegistrationData, value: string) => {
        const cleanedValue = value.replace(/[^\d\s-]/g, "")
        setApplicantData((prev) => ({ ...prev, [field]: cleanedValue }))
    }

    const validatePhoneNumber = (countryCode: string, phoneNumber: string): boolean => {
        if (!phoneNumber.trim()) return false
        const countryInfo = countryCodes.find((c) => c.code === countryCode)
        if (!countryInfo) return false
        const cleanNumber = phoneNumber.replace(/[\s-]/g, "")
        return cleanNumber.length === countryInfo.length && /^\d+$/.test(cleanNumber)
    }

    const validateAge = (birthDate: Date | undefined): boolean => {
        if (!birthDate) return false
        const today = new Date()
        const age = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            return age - 1 >= 18
        }
        return age >= 18
    }

    const addSkill = () => {
        if (newSkill.trim() && !applicantData.skills.includes(newSkill.trim())) {
            handleInputChange("skills", [...applicantData.skills, newSkill.trim()])
            setNewSkill("")
        }
    }

    const removeSkill = (skill: string) => {
        handleInputChange(
            "skills",
            applicantData.skills.filter((s) => s !== skill),
        )
    }

    const addLanguage = () => {
        if (newLanguage.trim() && !applicantData.languages.includes(newLanguage.trim())) {
            handleInputChange("languages", [...applicantData.languages, newLanguage.trim()])
            setNewLanguage("")
        }
    }

    const removeLanguage = (language: string) => {
        handleInputChange(
            "languages",
            applicantData.languages.filter((l) => l !== language),
        )
    }

    const addCertification = () => {
        if (newCertification.trim() && !applicantData.certifications.includes(newCertification.trim())) {
            handleInputChange("certifications", [...applicantData.certifications, newCertification.trim()])
            setNewCertification("")
        }
    }

    const removeCertification = (certification: string) => {
        handleInputChange(
            "certifications",
            applicantData.certifications.filter((c) => c !== certification),
        )
    }

    const validateCurrentStep = (): boolean => {
        const errors: string[] = []

        if (userType === "applicant") {
            switch (currentStep) {
                case 1:
                    if (!applicantData.firstName.trim()) errors.push("First Name is required")
                    if (!applicantData.surname.trim()) errors.push("Surname is required")
                    if (!applicantData.birthDate) errors.push("Birth Date is required")
                    if (applicantData.birthDate && !validateAge(applicantData.birthDate)) {
                        errors.push("You must be at least 18 years old to register")
                    }
                    if (!applicantData.gender) errors.push("Gender is required")
                    if (!applicantData.levelOfEducation) errors.push("Level of Education is required")
                    if (!applicantData.yearsOfExperience) errors.push("Years of Experience is required")
                    if (!applicantData.phone.trim()) errors.push("Phone Number is required")
                    if (!validatePhoneNumber(applicantData.phoneCountryCode, applicantData.phone)) {
                        errors.push("Please enter a valid phone number for the selected country")
                    }
                    if (!applicantData.email.trim()) errors.push("Email Address is required")
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                    if (applicantData.email && !emailRegex.test(applicantData.email)) {
                        errors.push("Please enter a valid email address")
                    }
                    break

                case 2:
                    // Professional experience step - no mandatory fields for now
                    break
            }
        } else if (userType === "company") {
            switch (currentStep) {
                case 1:
                    if (!companyData.companyName.trim()) errors.push("Company Name is required")
                    if (!companyData.companyType) errors.push("Company Type is required")
                    if (!companyData.companySize) errors.push("Company Size is required")
                    if (!companyData.country) errors.push("Country is required")
                    if (
                        companyData.officialPhone &&
                        !validatePhoneNumber(companyData.officialPhoneCountryCode, companyData.officialPhone)
                    ) {
                        errors.push("Please enter a valid phone number for the selected country")
                    }
                    break

                case 2:
                    if (!companyData.fullName.trim()) errors.push("Full Name is required")
                    if (!companyData.adminEmail.trim()) errors.push("Email Address is required")
                    if (!companyData.adminPhone.trim()) errors.push("Phone Number is required")
                    if (!validatePhoneNumber(companyData.adminPhoneCountryCode, companyData.adminPhone)) {
                        errors.push("Please enter a valid phone number for the selected country")
                    }
                    if (!companyData.password) errors.push("Password is required")
                    if (!companyData.confirmPassword) errors.push("Confirm Password is required")
                    if (
                        companyData.password &&
                        companyData.confirmPassword &&
                        companyData.password !== companyData.confirmPassword
                    ) {
                        errors.push("Passwords do not match")
                    }
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                    if (companyData.adminEmail && !emailRegex.test(companyData.adminEmail)) {
                        errors.push("Please enter a valid email address")
                    }
                    break

                case 3:
                    if (!companyData.tinNumber.trim()) errors.push("TIN Number is required")
                    // Add file validation here if needed
                    break
            }
        }

        setValidationErrors(errors)
        return errors.length === 0
    }

    const handleContinue = async () => {
        if (!validateCurrentStep()) {
            return
        }

        // setLoading(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        if (currentStep < steps.length) {
            setCurrentStep((prev) => prev + 1)
            setValidationErrors([])
        } else {
            // Registration complete
            // console.log("Registration completed:", userType === "applicant" ? applicantData : companyData)

            if (userType !== "applicant") {
                const companyProfile: Omit<CompanyModel, "id" | "uid"> = {
                    companyName: companyData.companyName,
                    companyType: companyData.companyType,
                    companySize: companyData.companySize,
                    country: companyData.country,
                    cityLocation: companyData.cityLocation,
                    officialEmail: companyData.officialEmail,
                    officialPhoneCountryCode: companyData.officialPhoneCountryCode,
                    officialPhone: companyData.officialPhone,
                    websiteUrl: companyData.websiteUrl,
                    fullName: companyData.fullName,
                    email: companyData.adminEmail,
                    adminPhoneCountryCode: companyData.adminPhoneCountryCode,
                    adminPhone: companyData.adminPhone,
                    tinNumber: companyData.tinNumber,
                    businessLicenseDocument: null,
                    companyLogoDocument: null,
                    companyLogoUrl: null,
                };

                // create company
                await register({ email: companyProfile.email, password: companyData.password, company: companyProfile })
                    .then(async (c) => {
                        // upload files 
                        if (businessLicenseFile) {
                            await uploadBusinessLicense(c.id, businessLicenseFile)
                        }
                        if (companyLogoFile) {
                            await uploadCompanyLogo(c.id, companyLogoFile)
                        }
                    });
            }

            // Show success message and redirect to login page
            setLoading(false)
            alert("Registration completed successfully! You will be redirected to the login page.")
            router.push("/auth")
        }
        setLoading(false)
    }

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1)
            setValidationErrors([])
        }
    }

    const renderApplicantStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl text-[#0a3141]">Personal Information</CardTitle>
                            <p className="text-gray-600">Please provide your personal details.</p>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium text-gray-700">
                                        First Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        placeholder="Enter your first name"
                                        value={applicantData.firstName}
                                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                                        className="mt-1 h-12"
                                    />
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700">
                                        Surname <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        placeholder="Enter your surname"
                                        value={applicantData.surname}
                                        onChange={(e) => handleInputChange("surname", e.target.value)}
                                        className="mt-1 h-12"
                                    />
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700">
                                        Birth Date <span className="text-red-500">*</span>
                                    </Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className={cn(
                                                    "w-full h-12 mt-1 justify-start text-left font-normal relative",
                                                    !applicantData.birthDate && "text-muted-foreground",
                                                )}
                                                onClick={(e) => e.preventDefault()}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {applicantData.birthDate ? format(applicantData.birthDate, "PPP") : "Select birth date"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 z-[100]" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={applicantData.birthDate}
                                                onSelect={(date) => handleInputChange("birthDate", date)}
                                                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <p className="text-xs text-gray-500 mt-1">You must be at least 18 years old</p>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Birth Place</Label>
                                    <Input
                                        placeholder="Enter birth place (optional)"
                                        value={applicantData.birthPlace}
                                        onChange={(e) => handleInputChange("birthPlace", e.target.value)}
                                        className="mt-1 h-12"
                                    />
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700">
                                        Gender <span className="text-red-500">*</span>
                                    </Label>
                                    <Select value={applicantData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                                        <SelectTrigger className="mt-1 h-12">
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700">
                                        Level of Education <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={applicantData.levelOfEducation}
                                        onValueChange={(value) => handleInputChange("levelOfEducation", value)}
                                    >
                                        <SelectTrigger className="mt-1 h-12">
                                            <SelectValue placeholder="Select education level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {educationLevels.map((level) => (
                                                <SelectItem key={level} value={level}>
                                                    {level}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700">
                                        Years of Experience <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={applicantData.yearsOfExperience}
                                        onValueChange={(value) => handleInputChange("yearsOfExperience", value)}
                                    >
                                        <SelectTrigger className="mt-1 h-12">
                                            <SelectValue placeholder="Select experience level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {experienceYears.map((years) => (
                                                <SelectItem key={years} value={years}>
                                                    {years}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700">
                                        Email Address <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        type="email"
                                        placeholder="your.email@example.com"
                                        value={applicantData.email}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                        className="mt-1 h-12"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <Label className="text-sm font-medium text-gray-700">
                                        Phone Number <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="flex gap-2 mt-1">
                                        <Select
                                            value={applicantData.phoneCountryCode}
                                            onValueChange={(value) => handleInputChange("phoneCountryCode", value)}
                                        >
                                            <SelectTrigger className="w-32 h-12">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {countryCodes.map((country) => (
                                                    <SelectItem key={`${country.code}-${country.country}`} value={country.code}>
                                                        {country.flag} {country.code}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Input
                                            placeholder="712 000 000"
                                            value={applicantData.phone}
                                            onChange={(e) => handlePhoneNumberChange("phone", e.target.value)}
                                            className="flex-1 h-12"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Enter numbers only (spaces and hyphens allowed)</p>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Fayda Number</Label>
                                    <Input
                                        placeholder="Enter Fayda number (optional)"
                                        value={applicantData.faydaNumber}
                                        onChange={(e) => handleInputChange("faydaNumber", e.target.value)}
                                        className="mt-1 h-12"
                                    />
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700">TIN Number</Label>
                                    <Input
                                        placeholder="Enter TIN number (optional)"
                                        value={applicantData.tinNumber}
                                        onChange={(e) => handleInputChange("tinNumber", e.target.value)}
                                        className="mt-1 h-12"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )

            case 2:
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl text-[#0a3141]">Professional Experience</CardTitle>
                            <p className="text-gray-600">Share your professional background and experience.</p>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Current Position</Label>
                                    <Input
                                        placeholder="e.g. Software Developer"
                                        value={applicantData.currentPosition}
                                        onChange={(e) => handleInputChange("currentPosition", e.target.value)}
                                        className="mt-1 h-12"
                                    />
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Current Company</Label>
                                    <Input
                                        placeholder="e.g. ABC Company Ltd"
                                        value={applicantData.currentCompany}
                                        onChange={(e) => handleInputChange("currentCompany", e.target.value)}
                                        className="mt-1 h-12"
                                    />
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Current Salary</Label>
                                    <Input
                                        placeholder="e.g. 1,500,000 TZS"
                                        value={applicantData.currentSalary}
                                        onChange={(e) => handleInputChange("currentSalary", e.target.value)}
                                        className="mt-1 h-12"
                                    />
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Expected Salary</Label>
                                    <Input
                                        placeholder="e.g. 2,000,000 TZS"
                                        value={applicantData.expectedSalary}
                                        onChange={(e) => handleInputChange("expectedSalary", e.target.value)}
                                        className="mt-1 h-12"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-gray-700">Skills</Label>
                                <div className="flex gap-2 mt-1">
                                    <Input
                                        placeholder="Add a skill (e.g. JavaScript, Python)"
                                        value={newSkill}
                                        onChange={(e) => setNewSkill(e.target.value)}
                                        onKeyPress={(e) => e.key === "Enter" && addSkill()}
                                        className="flex-1 h-12"
                                    />
                                    <Button onClick={addSkill} className="h-12 px-4 bg-[#d2f277] text-black hover:bg-[#c2e267]">
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {applicantData.skills.map((skill, index) => (
                                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                            {skill}
                                            <button onClick={() => removeSkill(skill)} className="ml-1 hover:text-red-500">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Press Enter or click + to add skills</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Languages</Label>
                                    <div className="flex gap-2 mt-1">
                                        <Input
                                            placeholder="Add a language (e.g. English, Swahili)"
                                            value={newLanguage}
                                            onChange={(e) => setNewLanguage(e.target.value)}
                                            onKeyPress={(e) => e.key === "Enter" && addLanguage()}
                                            className="flex-1 h-12"
                                        />
                                        <Button onClick={addLanguage} className="h-12 px-4 bg-[#d2f277] text-black hover:bg-[#c2e267]">
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {applicantData.languages.map((language, index) => (
                                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                                {language}
                                                <button onClick={() => removeLanguage(language)} className="ml-1 hover:text-red-500">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Certifications</Label>
                                    <div className="flex gap-2 mt-1">
                                        <Input
                                            placeholder="Add a certification"
                                            value={newCertification}
                                            onChange={(e) => setNewCertification(e.target.value)}
                                            onKeyPress={(e) => e.key === "Enter" && addCertification()}
                                            className="flex-1 h-12"
                                        />
                                        <Button onClick={addCertification} className="h-12 px-4 bg-[#d2f277] text-black hover:bg-[#c2e267]">
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {applicantData.certifications.map((certification, index) => (
                                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                                {certification}
                                                <button onClick={() => removeCertification(certification)} className="ml-1 hover:text-red-500">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-gray-700">Work Experience Summary</Label>
                                <Textarea
                                    placeholder="Briefly describe your work experience, achievements, and key responsibilities..."
                                    value={applicantData.workExperience}
                                    onChange={(e) => handleInputChange("workExperience", e.target.value)}
                                    className="mt-1 min-h-[120px]"
                                />
                            </div>
                        </CardContent>
                    </Card>
                )

            default:
                return null
        }
    }

    const renderCompanyStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl text-[#0a3141]">Company Information</CardTitle>
                            <p className="text-gray-600">Please provide your company details.</p>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <Label className="text-sm font-medium text-gray-700">
                                        Company Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        placeholder="Enter company name"
                                        value={companyData.companyName}
                                        onChange={(e) => handleCompanyInputChange("companyName", e.target.value)}
                                        className="mt-1 h-12"
                                    />
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700">
                                        Company Type <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={companyData.companyType}
                                        onValueChange={(value) => handleCompanyInputChange("companyType", value)}
                                    >
                                        <SelectTrigger className="mt-1 h-12">
                                            <SelectValue placeholder="Select company type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {companyTypes.map((type) => (
                                                <SelectItem key={type} value={type}>
                                                    {type}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700">
                                        Company Size <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={companyData.companySize}
                                        onValueChange={(value) => handleCompanyInputChange("companySize", value)}
                                    >
                                        <SelectTrigger className="mt-1 h-12">
                                            <SelectValue placeholder="Select company size" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {companySizes.map((size) => (
                                                <SelectItem key={size} value={size}>
                                                    {size}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700">
                                        Country <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={companyData.country}
                                        onValueChange={(value) => handleCompanyInputChange("country", value)}
                                    >
                                        <SelectTrigger className="mt-1 h-12">
                                            <SelectValue placeholder="Select country" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {countries.map((country) => (
                                                <SelectItem key={country} value={country}>
                                                    {country}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700">City / Location</Label>
                                    <Input
                                        placeholder="Enter city or location"
                                        value={companyData.cityLocation}
                                        onChange={(e) => handleCompanyInputChange("cityLocation", e.target.value)}
                                        className="mt-1 h-12"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <Label className="text-sm font-medium text-gray-700">Official Business Email</Label>
                                    <Input
                                        type="email"
                                        placeholder="company@example.com"
                                        value={companyData.officialEmail}
                                        onChange={(e) => handleCompanyInputChange("officialEmail", e.target.value)}
                                        className="mt-1 h-12"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <Label className="text-sm font-medium text-gray-700">Official Phone Number</Label>
                                    <div className="flex gap-2 mt-1">
                                        <Select
                                            value={companyData.officialPhoneCountryCode}
                                            onValueChange={(value) => handleCompanyInputChange("officialPhoneCountryCode", value)}
                                        >
                                            <SelectTrigger className="w-32 h-12">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {countryCodes.map((country) => (
                                                    <SelectItem key={`${country.code}-${country.country}`} value={country.code}>
                                                        {country.flag} {country.code}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Input
                                            placeholder="712 000 000"
                                            value={companyData.officialPhone}
                                            onChange={(e) => {
                                                const cleanedValue = e.target.value.replace(/[^\d\s-]/g, "")
                                                handleCompanyInputChange("officialPhone", cleanedValue)
                                            }}
                                            className="flex-1 h-12"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Enter numbers only (spaces and hyphens allowed)</p>
                                </div>

                                <div className="md:col-span-2">
                                    <Label className="text-sm font-medium text-gray-700">Website URL</Label>
                                    <Input
                                        placeholder="https://www.company.com"
                                        value={companyData.websiteUrl}
                                        onChange={(e) => handleCompanyInputChange("websiteUrl", e.target.value)}
                                        className="mt-1 h-12"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )

            case 2:
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl text-[#0a3141]">Account Administrator Details</CardTitle>
                            <p className="text-gray-600">Setup the administrator account for your company.</p>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <Label className="text-sm font-medium text-gray-700">
                                        Full Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        placeholder="Enter full name"
                                        value={companyData.fullName}
                                        onChange={(e) => handleCompanyInputChange("fullName", e.target.value)}
                                        className="mt-1 h-12"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <Label className="text-sm font-medium text-gray-700">
                                        Email Address <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        type="email"
                                        placeholder="admin@company.com"
                                        value={companyData.adminEmail}
                                        onChange={(e) => handleCompanyInputChange("adminEmail", e.target.value)}
                                        className="mt-1 h-12"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">This email will be used for login</p>
                                </div>

                                <div className="md:col-span-2">
                                    <Label className="text-sm font-medium text-gray-700">
                                        Phone Number <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="flex gap-2 mt-1">
                                        <Select
                                            value={companyData.adminPhoneCountryCode}
                                            onValueChange={(value) => handleCompanyInputChange("adminPhoneCountryCode", value)}
                                        >
                                            <SelectTrigger className="w-32 h-12">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {countryCodes.map((country) => (
                                                    <SelectItem key={`${country.code}-${country.country}`} value={country.code}>
                                                        {country.flag} {country.code}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Input
                                            placeholder="712 000 000"
                                            value={companyData.adminPhone}
                                            onChange={(e) => {
                                                const cleanedValue = e.target.value.replace(/[^\d\s-]/g, "")
                                                handleCompanyInputChange("adminPhone", cleanedValue)
                                            }}
                                            className="flex-1 h-12"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Enter numbers only (spaces and hyphens allowed)</p>
                                </div>

                                <div className="md:col-span-2">
                                    <Label className="text-sm font-medium text-gray-700">
                                        Password <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        type="password"
                                        placeholder="••••••••••••"
                                        value={companyData.password}
                                        onChange={(e) => handleCompanyInputChange("password", e.target.value)}
                                        className="mt-1 h-12"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Use 8+ characters with uppercase, lowercase, numbers & symbols
                                    </p>
                                </div>

                                <div className="md:col-span-2">
                                    <Label className="text-sm font-medium text-gray-700">
                                        Confirm Password <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        type="password"
                                        placeholder="••••••••••••"
                                        value={companyData.confirmPassword}
                                        onChange={(e) => handleCompanyInputChange("confirmPassword", e.target.value)}
                                        className="mt-1 h-12"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )

            case 3:
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl text-[#0a3141]">Business Verification</CardTitle>
                            <p className="text-gray-600">Verify your business credentials to complete registration.</p>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <Label className="text-sm font-medium text-gray-700">
                                    TIN Number <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    placeholder="Enter TIN number"
                                    value={companyData.tinNumber}
                                    onChange={(e) => handleCompanyInputChange("tinNumber", e.target.value)}
                                    className="mt-1 h-12"
                                />
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-gray-700">
                                    Business License <span className="text-red-500">*</span>
                                </Label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors bg-gray-50 mt-1">
                                    <input
                                        type="file"
                                        id="business-license"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0]
                                            if (file) {
                                                console.log("Business license selected:", file.name)
                                                setBusinessLicenseFile(file)
                                            }
                                        }}
                                    />
                                    <label htmlFor="business-license" className="cursor-pointer">
                                        <div className="flex flex-col items-center space-y-2">
                                            <div className="w-10 h-10 text-gray-400">
                                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                    />
                                                </svg>
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {
                                                    businessLicenseFile ?
                                                        <>
                                                            <span className="font-medium">
                                                                {businessLicenseFile.name}
                                                            </span>
                                                        </>
                                                        :
                                                        <>
                                                            <span className="font-medium">
                                                                Click to upload
                                                            </span> or drag and drop
                                                        </>
                                                }
                                            </div>
                                            <div className="text-xs text-gray-400">PDF, JPG, PNG (max 10MB)</div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-gray-700">Company Logo</Label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors bg-gray-50 mt-1">
                                    <input
                                        type="file"
                                        id="company-logo"
                                        accept=".jpg,.jpeg,.png,.svg"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0]
                                            if (file) {
                                                console.log("Company logo selected:", file.name)
                                                setCompanyLogoFile(file);
                                            }
                                        }}
                                    />
                                    <label htmlFor="company-logo" className="cursor-pointer">
                                        <div className="flex flex-col items-center space-y-2">
                                            <div className="w-10 h-10 text-gray-400">
                                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                    />
                                                </svg>
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {
                                                    companyLogoFile ?
                                                        <>
                                                            <span className="font-medium">
                                                                {companyLogoFile.name}
                                                            </span>
                                                        </>
                                                        :
                                                        <>
                                                            <span className="font-medium">
                                                                Click to upload
                                                            </span> or drag and drop
                                                        </>
                                                }
                                            </div>
                                            <div className="text-xs text-gray-400">JPG, PNG, SVG (max 5MB) - Optional</div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )

            default:
                return null
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#f5f7fa] to-white">
            <div className="flex">
                {/* Sidebar */}
                <div className="w-80 bg-white border-r border-gray-200 min-h-screen p-6">
                    <div className="mb-8">
                        <Link href="/" className="flex items-center gap-3">
                            <Image
                                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-9xNdd6tEqppxZ2JNyyzzlibUNBOJ99.png"
                                alt="ABH Connect Logo"
                                width={40}
                                height={40}
                            />
                            <span className="text-xl font-bold text-[#0a3141]">ABH Connect</span>
                        </Link>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-lg font-semibold text-gray-900">
                            {userType === "applicant" ? "Applicant Registration" : "Company Registration"}
                        </h1>
                    </div>

                    <div className="space-y-4">
                        {steps.map((step, index) => {
                            const Icon = step.icon
                            const isActive = currentStep === step.id
                            const isCompleted = currentStep > step.id

                            return (
                                <div key={step.id} className="flex items-start gap-3">
                                    <div className="flex flex-col items-center">
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center ${isActive
                                                ? "bg-[#d2f277] text-[#0a3141]"
                                                : isCompleted
                                                    ? "bg-[#0a3141] text-white"
                                                    : "bg-gray-200 text-gray-400"
                                                }`}
                                        >
                                            {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                                        </div>
                                        {index < steps.length - 1 && <div className="w-px h-8 bg-gray-200 mt-2" />}
                                    </div>
                                    <div className="flex-1 pb-8">
                                        <h3 className={`font-medium ${isActive ? "text-[#0a3141]" : "text-gray-600"}`}>{step.title}</h3>
                                        <p className="text-sm text-gray-500">{step.subtitle}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className="mt-8">
                        <Link href="/auth" className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#0a3141]">
                            <ChevronLeft className="w-4 h-4" />
                            Back to login
                        </Link>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-8">
                    <div className="max-w-2xl mx-auto">
                        {/* Progress Bar */}
                        <div className="mb-8">
                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                                <span>
                                    Step {currentStep} of {steps.length}
                                </span>
                                <span>{Math.round((currentStep / steps.length) * 100)}% Complete</span>
                            </div>
                            <Progress value={(currentStep / steps.length) * 100} className="h-2" />
                        </div>

                        {userType === "applicant" ? renderApplicantStepContent() : renderCompanyStepContent()}

                        <div className="mt-8">
                            {/* Validation Errors */}
                            {validationErrors.length > 0 && (
                                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <h4 className="text-sm font-medium text-red-800 mb-2 flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" />
                                        Please fix the following errors:
                                    </h4>
                                    <ul className="text-sm text-red-700 space-y-1">
                                        {validationErrors.map((error, index) => (
                                            <li key={index} className="flex items-center gap-2">
                                                <div className="w-1 h-1 bg-red-500 rounded-full flex-shrink-0" />
                                                {error}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <Separator className="mb-6" />

                            <div className="flex justify-between">
                                <div>
                                    {currentStep > 1 && (
                                        <Button
                                            onClick={handleBack}
                                            variant="outline"
                                            className="px-6 h-12 border-[#0a3141] text-[#0a3141] hover:bg-[#0a3141] hover:text-white"
                                        >
                                            <ChevronLeft className="w-4 h-4 mr-2" />
                                            Back
                                        </Button>
                                    )}
                                </div>
                                <Button
                                    onClick={handleContinue}
                                    disabled={loading}
                                    className="px-8 h-12 bg-[#d2f277] text-black hover:bg-[#c2e267] font-medium"
                                >
                                    {loading ? "Processing..." : currentStep === steps.length ? "Complete Registration" : "Continue"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
