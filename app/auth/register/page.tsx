"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/context/toastContext"
import { useRegister } from "@/hooks/auth/useRegister"
import { dateFormat } from "@/lib/api/dayjs_format"
import { uploadBusinessLicense } from "@/lib/api/firebase/upload/uploadBusinessDocuments"
import { uploadCompanyLogo } from "@/lib/api/firebase/upload/uploadCompanyLogo"
import { uploadCV } from "@/lib/api/firebase/upload/uploadCV"
import { uploadApplicantPhoto } from "@/lib/api/firebase/upload/uploadPhoto"
import { cn } from "@/lib/utils"
import ApplicantModel from "@/models/applicant"
import CompanyModel from "@/models/company"
import { format } from "date-fns"
import dayjs from "dayjs"
import { AlertCircle, Briefcase, Building, CalendarIcon, Check, ChevronLeft, Edit2, Plus, Shield, Trash2, User, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

// Interfaces
interface ProfessionalExperience {
    id: string
    companyName: string
    title: string
    startDate: Date | undefined
    endDate: Date | undefined
    currentlyWorking: boolean
    mainActivities: string
    reference: string
}

interface EducationExperience {
    id: string
    startDate: Date | undefined
    endDate: Date | undefined
    currentlyStudying: boolean
    educationLevel: string
    title: string
    school: string
}

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
    password: string
    confirmPassword: string

    // Professional Experience
    desiredPosition: string
    expectedSalary: string
    professionalExperiences: ProfessionalExperience[]
    educationExperiences: EducationExperience[]
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
export const educationLevels = [
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

export const experienceYears = [
    "Fresh Graduate (0 years)",
    "1-2 years",
    "3-5 years",
    "6-10 years",
    "11-15 years",
    "16-20 years",
    "20+ years",
]

export const countryCodes = [
    { code: "+93", country: "Afghanistan", flag: "🇦🇫", length: 9 },
    { code: "+355", country: "Albania", flag: "🇦🇱", length: 9 },
    { code: "+213", country: "Algeria", flag: "🇩🇿", length: 9 },
    { code: "+1", country: "United States", flag: "🇺🇸", length: 10 },
    { code: "+376", country: "Andorra", flag: "🇦🇩", length: 6 },
    { code: "+244", country: "Angola", flag: "🇦🇴", length: 9 },
    { code: "+54", country: "Argentina", flag: "🇦🇷", length: 10 },
    { code: "+374", country: "Armenia", flag: "🇦🇲", length: 8 },
    { code: "+61", country: "Australia", flag: "🇦🇺", length: 9 },
    { code: "+43", country: "Austria", flag: "🇦🇹", length: 10 },
    { code: "+994", country: "Azerbaijan", flag: "🇦🇿", length: 9 },
    { code: "+973", country: "Bahrain", flag: "🇧🇭", length: 8 },
    { code: "+880", country: "Bangladesh", flag: "🇧🇩", length: 10 },
    { code: "+375", country: "Belarus", flag: "🇧🇾", length: 9 },
    { code: "+32", country: "Belgium", flag: "🇧🇪", length: 9 },
    { code: "+501", country: "Belize", flag: "🇧🇿", length: 7 },
    { code: "+229", country: "Benin", flag: "🇧🇯", length: 8 },
    { code: "+975", country: "Bhutan", flag: "🇧🇹", length: 8 },
    { code: "+591", country: "Bolivia", flag: "🇧🇴", length: 8 },
    { code: "+387", country: "Bosnia and Herzegovina", flag: "🇧🇦", length: 8 },
    { code: "+267", country: "Botswana", flag: "🇧🇼", length: 8 },
    { code: "+55", country: "Brazil", flag: "🇧🇷", length: 11 },
    { code: "+673", country: "Brunei", flag: "🇧🇳", length: 7 },
    { code: "+359", country: "Bulgaria", flag: "🇧🇬", length: 9 },
    { code: "+226", country: "Burkina Faso", flag: "🇧🇫", length: 8 },
    { code: "+257", country: "Burundi", flag: "🇧🇮", length: 8 },
    { code: "+855", country: "Cambodia", flag: "🇰🇭", length: 9 },
    { code: "+237", country: "Cameroon", flag: "🇨🇲", length: 9 },
    { code: "+1", country: "Canada", flag: "🇨🇦", length: 10 },
    { code: "+238", country: "Cape Verde", flag: "🇨🇻", length: 7 },
    { code: "+236", country: "Central African Republic", flag: "🇨🇫", length: 8 },
    { code: "+235", country: "Chad", flag: "🇹🇩", length: 8 },
    { code: "+56", country: "Chile", flag: "🇨🇱", length: 9 },
    { code: "+86", country: "China", flag: "🇨🇳", length: 11 },
    { code: "+57", country: "Colombia", flag: "🇨🇴", length: 10 },
    { code: "+269", country: "Comoros", flag: "🇰🇲", length: 7 },
    { code: "+242", country: "Congo", flag: "🇨🇬", length: 9 },
    { code: "+243", country: "Democratic Republic of Congo", flag: "🇨🇩", length: 9 },
    { code: "+506", country: "Costa Rica", flag: "🇨🇷", length: 8 },
    { code: "+385", country: "Croatia", flag: "🇭🇷", length: 9 },
    { code: "+53", country: "Cuba", flag: "🇨🇺", length: 8 },
    { code: "+357", country: "Cyprus", flag: "🇨🇾", length: 8 },
    { code: "+420", country: "Czech Republic", flag: "🇨🇿", length: 9 },
    { code: "+45", country: "Denmark", flag: "🇩🇰", length: 8 },
    { code: "+253", country: "Djibouti", flag: "🇩🇯", length: 8 },
    { code: "+593", country: "Ecuador", flag: "🇪🇨", length: 9 },
    { code: "+20", country: "Egypt", flag: "🇪🇬", length: 10 },
    { code: "+503", country: "El Salvador", flag: "🇸🇻", length: 8 },
    { code: "+240", country: "Equatorial Guinea", flag: "🇬🇶", length: 9 },
    { code: "+291", country: "Eritrea", flag: "🇪🇷", length: 7 },
    { code: "+372", country: "Estonia", flag: "🇪🇪", length: 8 },
    { code: "+251", country: "Ethiopia", flag: "🇪🇹", length: 9 },
    { code: "+358", country: "Finland", flag: "🇫🇮", length: 9 },
    { code: "+33", country: "France", flag: "🇫🇷", length: 10 },
    { code: "+241", country: "Gabon", flag: "🇬🇦", length: 8 },
    { code: "+220", country: "Gambia", flag: "🇬🇲", length: 7 },
    { code: "+995", country: "Georgia", flag: "🇬🇪", length: 9 },
    { code: "+49", country: "Germany", flag: "🇩🇪", length: 11 },
    { code: "+233", country: "Ghana", flag: "🇬🇭", length: 9 },
    { code: "+30", country: "Greece", flag: "🇬🇷", length: 10 },
    { code: "+502", country: "Guatemala", flag: "🇬🇹", length: 8 },
    { code: "+224", country: "Guinea", flag: "🇬🇳", length: 9 },
    { code: "+245", country: "Guinea-Bissau", flag: "🇬🇼", length: 7 },
    { code: "+592", country: "Guyana", flag: "🇬🇾", length: 7 },
    { code: "+509", country: "Haiti", flag: "🇭🇹", length: 8 },
    { code: "+504", country: "Honduras", flag: "🇭🇳", length: 8 },
    { code: "+36", country: "Hungary", flag: "🇭🇺", length: 9 },
    { code: "+354", country: "Iceland", flag: "🇮🇸", length: 7 },
    { code: "+91", country: "India", flag: "🇮🇳", length: 10 },
    { code: "+62", country: "Indonesia", flag: "🇮🇩", length: 10 },
    { code: "+98", country: "Iran", flag: "🇮🇷", length: 10 },
    { code: "+964", country: "Iraq", flag: "🇮🇶", length: 10 },
    { code: "+353", country: "Ireland", flag: "🇮🇪", length: 9 },
    { code: "+972", country: "Israel", flag: "🇮🇱", length: 9 },
    { code: "+39", country: "Italy", flag: "🇮🇹", length: 10 },
    { code: "+225", country: "Ivory Coast", flag: "🇨🇮", length: 8 },
    { code: "+81", country: "Japan", flag: "🇯🇵", length: 10 },
    { code: "+962", country: "Jordan", flag: "🇯🇴", length: 9 },
    { code: "+7", country: "Kazakhstan", flag: "🇰🇿", length: 10 },
    { code: "+254", country: "Kenya", flag: "🇰🇪", length: 9 },
    { code: "+965", country: "Kuwait", flag: "🇰🇼", length: 8 },
    { code: "+996", country: "Kyrgyzstan", flag: "🇰🇬", length: 9 },
    { code: "+856", country: "Laos", flag: "🇱🇦", length: 8 },
    { code: "+371", country: "Latvia", flag: "🇱🇻", length: 8 },
    { code: "+961", country: "Lebanon", flag: "🇱🇧", length: 8 },
    { code: "+266", country: "Lesotho", flag: "🇱🇸", length: 8 },
    { code: "+231", country: "Liberia", flag: "🇱🇷", length: 8 },
    { code: "+218", country: "Libya", flag: "🇱🇾", length: 9 },
    { code: "+370", country: "Lithuania", flag: "🇱🇹", length: 8 },
    { code: "+352", country: "Luxembourg", flag: "🇱🇺", length: 9 },
    { code: "+261", country: "Madagascar", flag: "🇲🇬", length: 9 },
    { code: "+265", country: "Malawi", flag: "🇲🇼", length: 9 },
    { code: "+60", country: "Malaysia", flag: "🇲🇾", length: 9 },
    { code: "+960", country: "Maldives", flag: "🇲🇻", length: 7 },
    { code: "+223", country: "Mali", flag: "🇲🇱", length: 8 },
    { code: "+356", country: "Malta", flag: "🇲🇹", length: 8 },
    { code: "+222", country: "Mauritania", flag: "🇲🇷", length: 8 },
    { code: "+230", country: "Mauritius", flag: "🇲🇺", length: 8 },
    { code: "+52", country: "Mexico", flag: "🇲🇽", length: 10 },
    { code: "+373", country: "Moldova", flag: "🇲🇩", length: 8 },
    { code: "+377", country: "Monaco", flag: "🇲🇨", length: 8 },
    { code: "+976", country: "Mongolia", flag: "🇲🇳", length: 8 },
    { code: "+382", country: "Montenegro", flag: "🇲🇪", length: 8 },
    { code: "+212", country: "Morocco", flag: "🇲🇦", length: 9 },
    { code: "+258", country: "Mozambique", flag: "🇲🇿", length: 9 },
    { code: "+95", country: "Myanmar", flag: "🇲🇲", length: 9 },
    { code: "+264", country: "Namibia", flag: "🇳🇦", length: 9 },
    { code: "+977", country: "Nepal", flag: "🇳🇵", length: 10 },
    { code: "+31", country: "Netherlands", flag: "🇳🇱", length: 9 },
    { code: "+64", country: "New Zealand", flag: "🇳🇿", length: 9 },
    { code: "+505", country: "Nicaragua", flag: "🇳🇮", length: 8 },
    { code: "+227", country: "Niger", flag: "🇳🇪", length: 8 },
    { code: "+234", country: "Nigeria", flag: "🇳🇬", length: 10 },
    { code: "+47", country: "Norway", flag: "🇳🇴", length: 8 },
    { code: "+968", country: "Oman", flag: "🇴🇲", length: 8 },
    { code: "+92", country: "Pakistan", flag: "🇵🇰", length: 10 },
    { code: "+507", country: "Panama", flag: "🇵🇦", length: 8 },
    { code: "+675", country: "Papua New Guinea", flag: "🇵🇬", length: 8 },
    { code: "+595", country: "Paraguay", flag: "🇵🇾", length: 9 },
    { code: "+51", country: "Peru", flag: "🇵🇪", length: 9 },
    { code: "+63", country: "Philippines", flag: "🇵🇭", length: 10 },
    { code: "+48", country: "Poland", flag: "🇵🇱", length: 9 },
    { code: "+351", country: "Portugal", flag: "🇵🇹", length: 9 },
    { code: "+974", country: "Qatar", flag: "🇶🇦", length: 8 },
    { code: "+40", country: "Romania", flag: "🇷🇴", length: 9 },
    { code: "+7", country: "Russia", flag: "🇷🇺", length: 10 },
    { code: "+250", country: "Rwanda", flag: "🇷🇼", length: 9 },
    { code: "+966", country: "Saudi Arabia", flag: "🇸🇦", length: 9 },
    { code: "+221", country: "Senegal", flag: "🇸🇳", length: 9 },
    { code: "+381", country: "Serbia", flag: "🇷🇸", length: 9 },
    { code: "+248", country: "Seychelles", flag: "🇸🇨", length: 7 },
    { code: "+232", country: "Sierra Leone", flag: "🇸🇱", length: 8 },
    { code: "+65", country: "Singapore", flag: "🇸🇬", length: 8 },
    { code: "+421", country: "Slovakia", flag: "🇸🇰", length: 9 },
    { code: "+386", country: "Slovenia", flag: "🇸🇮", length: 8 },
    { code: "+252", country: "Somalia", flag: "🇸🇴", length: 8 },
    { code: "+27", country: "South Africa", flag: "🇿🇦", length: 9 },
    { code: "+82", country: "South Korea", flag: "🇰🇷", length: 10 },
    { code: "+211", country: "South Sudan", flag: "🇸🇸", length: 9 },
    { code: "+34", country: "Spain", flag: "🇪🇸", length: 9 },
    { code: "+94", country: "Sri Lanka", flag: "🇱🇰", length: 9 },
    { code: "+249", country: "Sudan", flag: "🇸🇩", length: 9 },
    { code: "+597", country: "Suriname", flag: "🇸🇷", length: 7 },
    { code: "+268", country: "Eswatini", flag: "🇸🇿", length: 8 },
    { code: "+46", country: "Sweden", flag: "🇸🇪", length: 9 },
    { code: "+41", country: "Switzerland", flag: "🇨🇭", length: 9 },
    { code: "+963", country: "Syria", flag: "🇸🇾", length: 9 },
    { code: "+992", country: "Tajikistan", flag: "🇹🇯", length: 9 },
    { code: "+255", country: "Tanzania", flag: "🇹🇿", length: 9 },
    { code: "+66", country: "Thailand", flag: "🇹🇭", length: 9 },
    { code: "+228", country: "Togo", flag: "🇹🇬", length: 8 },
    { code: "+216", country: "Tunisia", flag: "🇹🇳", length: 8 },
    { code: "+90", country: "Turkey", flag: "🇹🇷", length: 10 },
    { code: "+993", country: "Turkmenistan", flag: "🇹🇲", length: 8 },
    { code: "+256", country: "Uganda", flag: "🇺🇬", length: 9 },
    { code: "+380", country: "Ukraine", flag: "🇺🇦", length: 9 },
    { code: "+971", country: "United Arab Emirates", flag: "🇦🇪", length: 9 },
    { code: "+44", country: "United Kingdom", flag: "🇬🇧", length: 10 },
    { code: "+598", country: "Uruguay", flag: "🇺🇾", length: 8 },
    { code: "+998", country: "Uzbekistan", flag: "🇺🇿", length: 9 },
    { code: "+58", country: "Venezuela", flag: "🇻🇪", length: 10 },
    { code: "+84", country: "Vietnam", flag: "🇻🇳", length: 9 },
    { code: "+967", country: "Yemen", flag: "🇾🇪", length: 9 },
    { code: "+260", country: "Zambia", flag: "🇿🇲", length: 9 },
    { code: "+263", country: "Zimbabwe", flag: "🇿🇼", length: 9 },
]

export const countries = countryCodes.map(c => c.country);

export const companyTypes = [
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

export const companySizes = [
    "1-10 employees",
    "11-50 employees",
    "51-200 employees",
    "201-500 employees",
    "501-1000 employees",
    "1000+ employees",
]

export default function RegisterPage() {
    const searchParams = useSearchParams()
    const router = useRouter() // Add this line to get the router
    const userType = searchParams?.get("type") || "applicant"
    const [currentStep, setCurrentStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [validationErrors, setValidationErrors] = useState<string[]>([])
    const [newSkill, setNewSkill] = useState("")
    const [newLanguage, setNewLanguage] = useState("")
    const [newCertification, setNewCertification] = useState("")

    const [businessLicenseFile, setBusinessLicenseFile] = useState<File | null>(null);
    const [companyLogoFile, setCompanyLogoFile] = useState<File | null>(null);

    const [applicantPhotoFile, setApplicantPhotoFile] = useState<File | null>(null);
    const [cvFile, setCvFile] = useState<File | null>(null);

    const { register } = useRegister()
    const { showToast, hideToast } = useToast();

    const steps = userType === "applicant" ? applicantSteps : companySteps

    const [applicantData, setApplicantData] = useState<ApplicantRegistrationData>({
        firstName: "",
        surname: "",
        birthDate: new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
        birthPlace: "",
        gender: "",
        levelOfEducation: "",
        yearsOfExperience: "",
        phoneCountryCode: "+251",
        phone: "",
        email: "",
        faydaNumber: "",
        tinNumber: "",
        password: "",
        confirmPassword: "",
        desiredPosition: "",
        expectedSalary: "",
        professionalExperiences: [],
        educationExperiences: [],
        skills: [],
        languages: [],
        certifications: [],
        workExperience: "",
    })

    // New professional experience form state
    const [newProfessionalExperience, setNewProfessionalExperience] = useState<Omit<ProfessionalExperience, "id">>({
        companyName: "",
        title: "",
        startDate: undefined,
        endDate: undefined,
        currentlyWorking: false,
        mainActivities: "",
        reference: "",
    })

    // New education experience form state
    const [newEducationExperience, setNewEducationExperience] = useState<Omit<EducationExperience, "id">>({
        startDate: undefined,
        endDate: undefined,
        currentlyStudying: false,
        educationLevel: "",
        title: "",
        school: "",
    })

    const [companyData, setCompanyData] = useState<CompanyRegistrationData>({
        companyName: "",
        companyType: "",
        companySize: "",
        country: "",
        cityLocation: "",
        officialEmail: "",
        officialPhoneCountryCode: "+251",
        officialPhone: "",
        websiteUrl: "",
        fullName: "",
        adminEmail: "",
        adminPhoneCountryCode: "+251",
        adminPhone: "",
        password: "",
        confirmPassword: "",
        tinNumber: "",
    })

    // useEffect(() => {
    //     if (cvFile) {
    //         const callCvRatingApi = async () => {
    //             try {
    //                 const formData = new FormData();
    //                 formData.append("file", cvFile);
    //                 formData.append(
    //                     "position",
    //                     JSON.stringify({
    //                         name: "Software Developer",
    //                         positionDescription: "Develop and maintain software applications",
    //                     })
    //                 );

    //                 const response = await fetch("/api/cv-rating", {
    //                     method: "POST",
    //                     body: formData,
    //                 });

    //                 const data = await response.json();
    //                 console.log("CV Rating Result:", data.result);
    //             } catch (error) {
    //                 console.error("Error calling CV Rating API:", error);
    //             }
    //         };

    //         callCvRatingApi();
    //     }
    // }, [cvFile]);

    useEffect(() => {
        if (cvFile) {
            const callCVAutofillAPI = async () => {
                showToast("Please wait while we process your CV...", "Info", "default", 400000);

                const formData = new FormData();
                formData.append("file", cvFile);
                formData.append("yearsOfExperience", JSON.stringify(applicantData.yearsOfExperience));

                try {
                    const res = await fetch("/api/cv-autofill", {
                        method: "POST",
                        body: formData,
                    });

                    if (!res.ok) {
                        const error = await res.json();
                        console.error("API error:", error);
                        return;
                    }

                    const data = await res.json();
                    const result = JSON.parse(data.result);
                    console.log("result: ", result);

                    if (typeof result === typeof {}) {
                        const professionalExperience: any[] = result.professionalExperience;
                        const educationalExperience: any[] = result.educationalExperience;

                        const updateForProfessionalExperience = [
                            ...applicantData.professionalExperiences,
                            ...professionalExperience.map(exp => ({
                                ...exp,
                                startDate: new Date(exp.startDate),
                                endDate: exp.endDate ? new Date(exp.endDate) : undefined,
                                id: Date.now().toString() + Math.random().toString(36).substring(2, 15), // Generate a unique ID
                            })),
                        ];

                        const updateForEducationalExperience = [
                            ...applicantData.educationExperiences,
                            ...educationalExperience.map(exp => ({
                                ...exp,
                                startDate: new Date(exp.startDate),
                                endDate: exp.endDate ? new Date(exp.endDate) : undefined,
                                id: Date.now().toString() + Math.random().toString(36).substring(2, 15), // Generate a unique ID
                            })),
                        ];

                        handleInputChange("professionalExperiences", updateForProfessionalExperience);
                        handleInputChange("educationExperiences", updateForEducationalExperience);
                    }

                } catch (err) {
                    console.error("Fetch error:", err);
                }

                hideToast();
            };

            callCVAutofillAPI();
        }
    }, [cvFile]);

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

    // Professional Experience handlers
    const handleProfessionalExperienceChange = (field: keyof Omit<ProfessionalExperience, "id">, value: any) => {
        setNewProfessionalExperience((prev) => ({ ...prev, [field]: value }))
    }

    const addProfessionalExperience = () => {
        // Validate required fields
        if (
            !newProfessionalExperience.companyName.trim() ||
            !newProfessionalExperience.title.trim() ||
            !newProfessionalExperience.startDate ||
            (!newProfessionalExperience.endDate && !newProfessionalExperience.currentlyWorking) ||
            !newProfessionalExperience.mainActivities.trim()
        ) {
            return
        }

        const newExperience: ProfessionalExperience = {
            ...newProfessionalExperience,
            id: Date.now().toString(),
        }

        handleInputChange("professionalExperiences", [...applicantData.professionalExperiences, newExperience])

        // Reset form
        setNewProfessionalExperience({
            companyName: "",
            title: "",
            startDate: undefined,
            endDate: undefined,
            currentlyWorking: false,
            mainActivities: "",
            reference: "",
        })
    }

    const removeProfessionalExperience = (id: string) => {
        handleInputChange(
            "professionalExperiences",
            applicantData.professionalExperiences.filter((exp) => exp.id !== id),
        )
    }

    // Education Experience handlers
    const handleEducationExperienceChange = (field: keyof Omit<EducationExperience, "id">, value: any) => {
        setNewEducationExperience((prev) => ({ ...prev, [field]: value }))
    }

    const addEducationExperience = () => {
        // Validate required fields
        if (
            !newEducationExperience.startDate ||
            (!newEducationExperience.endDate && !newEducationExperience.currentlyStudying) ||
            !newEducationExperience.educationLevel ||
            !newEducationExperience.title.trim() ||
            !newEducationExperience.school.trim()
        ) {
            return
        }

        const newExperience: EducationExperience = {
            ...newEducationExperience,
            id: Date.now().toString(),
        }

        handleInputChange("educationExperiences", [...applicantData.educationExperiences, newExperience])

        // Reset form
        setNewEducationExperience({
            startDate: undefined,
            endDate: undefined,
            currentlyStudying: false,
            educationLevel: "",
            title: "",
            school: "",
        })
    }

    const removeEducationExperience = (id: string) => {
        handleInputChange(
            "educationExperiences",
            applicantData.educationExperiences.filter((exp) => exp.id !== id),
        )
    }

    const validateCurrentStep = (): boolean => {
        const errors: string[] = []

        if (userType === "applicant") {
            switch (currentStep) {
                case 1:
                    if (!applicantData.firstName.trim()) errors.push("First Name is required")
                    if (!applicantData.surname.trim()) errors.push("Surname is required")
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
                    if (!applicantData.password) errors.push("Password is required")
                    if (!applicantData.confirmPassword) errors.push("Confirm Password is required")
                    if (
                        applicantData.password &&
                        applicantData.confirmPassword &&
                        applicantData.password !== applicantData.confirmPassword
                    ) {
                        errors.push("Passwords do not match")
                    }
                    if (applicantData.password && applicantData.password.length < 6) {
                        errors.push("Password must be at least 6 characters long")
                    }
                    break

                case 2:
                    // Validate Professional Experience step
                    if (applicantData.professionalExperiences.length === 0) {
                        errors.push("At least one professional experience is required");
                    } else {
                        applicantData.professionalExperiences.forEach((exp, index) => {
                            if (!exp.companyName.trim()) errors.push(`Professional Experience ${index + 1}: Company Name is required`);
                            if (!exp.title.trim()) errors.push(`Professional Experience ${index + 1}: Title is required`);
                            if (!exp.startDate) errors.push(`Professional Experience ${index + 1}: Start Date is required`);
                            if (!exp.currentlyWorking && (!exp.endDate || isNaN(new Date(exp.endDate).getTime()))) {
                                errors.push(`Professional Experience ${index + 1}: End Date is required if not currently working`);
                            }
                            if (!exp.mainActivities.trim()) errors.push(`Professional Experience ${index + 1}: Main Activities are required`);
                        });
                    }

                    if (applicantData.educationExperiences.length === 0) {
                        errors.push("At least one educational experience is required");
                    } else {
                        applicantData.educationExperiences.forEach((exp, index) => {
                            if (!exp.startDate) errors.push(`Educational Experience ${index + 1}: Start Date is required`);
                            if (!exp.currentlyStudying && (!exp.endDate || isNaN(new Date(exp.endDate).getTime()))) {
                                errors.push(`Professional Experience ${index + 1}: End Date is required if not currently working`);
                            }
                            if (!exp.educationLevel) errors.push(`Educational Experience ${index + 1}: Education Level is required`);
                            if (!exp.title.trim()) errors.push(`Educational Experience ${index + 1}: Title is required`);
                            if (!exp.school.trim()) errors.push(`Educational Experience ${index + 1}: School is required`);
                        });
                    }

                    if (cvFile === null) {
                        errors.push("CV file is required")
                    }

                    break;
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
                    if (businessLicenseFile === null) errors.push("Business license file is required")
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

        setLoading(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        if (currentStep < steps.length) {
            setCurrentStep((prev) => prev + 1)
            setValidationErrors([])
        } else {
            // registering as company
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
                        console.log("registered company: ", c)
                        if (c && c.id) {
                            // upload files 
                            if (businessLicenseFile) {
                                await uploadBusinessLicense(c.id, businessLicenseFile)
                            }
                            if (companyLogoFile) {
                                await uploadCompanyLogo(c.id, companyLogoFile)
                            }

                            showToast("Registration successful!", "Success", "success");
                            router.push("/auth")
                        }
                        else {
                            console.error("registration failed or registration was successful and file upload failed");
                            showToast("Registration failed. Please try again.", "Error", "error");
                        }
                    });
            }

            // registering as applicant
            if (userType === "applicant") {
                const applicantProfile: Omit<ApplicantModel, "id" | "uid"> = {
                    firstName: applicantData.firstName,
                    surname: applicantData.surname,
                    birthdate: dayjs(applicantData.birthDate).format(dateFormat),
                    birthplace: applicantData.birthPlace,
                    gender: applicantData.gender as "Male" | "Female",
                    levelOfEducation: applicantData.levelOfEducation,
                    yearsOfExperience: applicantData.yearsOfExperience,
                    email: applicantData.email,
                    phoneCountryCode: applicantData.phoneCountryCode,
                    phoneNumber: applicantData.phone,
                    faydaNumber: applicantData.faydaNumber,
                    tinNumber: applicantData.tinNumber,

                    // step 2
                    cvDocument: null,
                    workExperienceSummary: applicantData.workExperience,
                    desiredPosition: applicantData.desiredPosition,
                    expectedSalary: applicantData.expectedSalary,
                    professionalExperiences: applicantData.professionalExperiences.map(exp => ({
                        ...exp,
                        startDate: dayjs(exp.startDate).format(dateFormat),
                        endDate: exp.currentlyWorking ? null : dayjs(exp.endDate).format(dateFormat),
                    })),
                    educationExperiences: applicantData.educationExperiences.map(exp => ({
                        ...exp,
                        startDate: dayjs(exp.startDate).format(dateFormat),
                        endDate: exp.currentlyStudying ? null : dayjs(exp.endDate).format(dateFormat),
                    })),
                    skills: applicantData.skills,
                    languages: applicantData.languages,
                    certifications: applicantData.certifications,
                    photo: null,
                };

                // create applicant
                await register({ email: applicantProfile.email, password: applicantData.password, applicant: applicantProfile })
                    .then(async (a) => {
                        console.log("registered applicant: ", a);
                        if (a && a.id) {
                            // upload files 
                            if (cvFile) {
                                await uploadCV(a.id, cvFile)
                            }
                            if (applicantPhotoFile) {
                                await uploadApplicantPhoto(a.id, applicantPhotoFile)
                            }
                            showToast("Registration successful!", "Success", "success");
                            router.push("/auth")
                        }
                        else {
                            console.error("registration failed or registration was successful and file upload failed");
                            showToast("Registration failed. Please try again.", "Error", "error");
                        }

                    });
                setLoading(false)
            }
        }
        setLoading(false)
    }

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1)
            setValidationErrors([])
            setLoading(false);
        }
    }

    const handleEditProfessionalExperience = (id: string) => {
        const experience = applicantData.professionalExperiences.find((exp) => exp.id === id)
        if (experience) {
            setNewProfessionalExperience({
                companyName: experience.companyName,
                title: experience.title,
                startDate: experience.startDate,
                endDate: experience.endDate ? new Date(experience.endDate) : undefined,
                currentlyWorking: !!experience.currentlyWorking,
                mainActivities: experience.mainActivities,
                reference: experience.reference || "",
            })
            removeProfessionalExperience(id)
        }
    }

    const handleEditEducationalExperience = (id: string) => {
        const experience = applicantData.educationExperiences.find((exp) => exp.id === id)
        if (experience) {
            setNewEducationExperience({
                startDate: experience.startDate,
                endDate: experience.endDate ? new Date(experience.endDate) : undefined,
                currentlyStudying: !!experience.currentlyStudying,
                educationLevel: experience.educationLevel,
                title: experience.title,
                school: experience.school,
            })
            removeEducationExperience(id)
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
                                    <Label className="text-sm font-medium text-gray-700">Birth Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full h-12 mt-1 justify-start text-left font-normal",
                                                    !applicantData.birthDate && "text-muted-foreground",
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {applicantData.birthDate ? format(applicantData.birthDate, "PPP") : "Select birth date"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 z-50" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={applicantData.birthDate}
                                                onSelect={(date) => handleInputChange("birthDate", date)}
                                                disabled={(date) => date > new Date(new Date().setFullYear(new Date().getFullYear() - 18)) || date < new Date("1900-01-01")}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <p className="text-xs text-gray-500 mt-1">Optional - Must be at least 18 years old if provided</p>
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
                                    <Label className="text-sm font-medium text-gray-700">
                                        Password <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        type="password"
                                        placeholder="Enter password"
                                        value={applicantData.password || ""}
                                        onChange={(e) => handleInputChange("password", e.target.value)}
                                        className="mt-1 h-12"
                                    />
                                    {applicantData.password && (
                                        <div className="mt-2">
                                            <div className="flex items-center gap-2 text-xs">
                                                <span className="text-gray-600">Strength:</span>
                                                <div className="flex gap-1">
                                                    <div
                                                        className={`w-6 h-1 rounded ${applicantData.password.length >= 1 ? (applicantData.password.length >= 8 && /[A-Z]/.test(applicantData.password) && /[0-9]/.test(applicantData.password) && /[^A-Za-z0-9]/.test(applicantData.password) ? "bg-green-500" : applicantData.password.length >= 6 && (/[A-Z]/.test(applicantData.password) || /[0-9]/.test(applicantData.password)) ? "bg-yellow-500" : "bg-red-500") : "bg-gray-200"}`}
                                                    ></div>
                                                    <div
                                                        className={`w-6 h-1 rounded ${applicantData.password.length >= 6 && (/[A-Z]/.test(applicantData.password) || /[0-9]/.test(applicantData.password)) ? (applicantData.password.length >= 8 && /[A-Z]/.test(applicantData.password) && /[0-9]/.test(applicantData.password) && /[^A-Za-z0-9]/.test(applicantData.password) ? "bg-green-500" : "bg-yellow-500") : "bg-gray-200"}`}
                                                    ></div>
                                                    <div
                                                        className={`w-6 h-1 rounded ${applicantData.password.length >= 8 && /[A-Z]/.test(applicantData.password) && /[0-9]/.test(applicantData.password) && /[^A-Za-z0-9]/.test(applicantData.password) ? "bg-green-500" : "bg-gray-200"}`}
                                                    ></div>
                                                </div>
                                                <span
                                                    className={`text-xs ${applicantData.password.length >= 8 && /[A-Z]/.test(applicantData.password) && /[0-9]/.test(applicantData.password) && /[^A-Za-z0-9]/.test(applicantData.password) ? "text-green-600" : applicantData.password.length >= 6 && (/[A-Z]/.test(applicantData.password) || /[0-9]/.test(applicantData.password)) ? "text-yellow-600" : "text-red-600"}`}
                                                >
                                                    {applicantData.password.length >= 8 &&
                                                        /[A-Z]/.test(applicantData.password) &&
                                                        /[0-9]/.test(applicantData.password) &&
                                                        /[^A-Za-z0-9]/.test(applicantData.password)
                                                        ? "Strong"
                                                        : applicantData.password.length >= 6 &&
                                                            (/[A-Z]/.test(applicantData.password) || /[0-9]/.test(applicantData.password))
                                                            ? "Medium"
                                                            : "Weak"}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Password should be at least 8 characters with uppercase, number, and special character
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700">
                                        Confirm Password <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        type="password"
                                        placeholder="Confirm password"
                                        value={applicantData.confirmPassword || ""}
                                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                                        className="mt-1 h-12"
                                    />
                                    {applicantData.confirmPassword && (
                                        <p
                                            className={`text-xs mt-1 ${applicantData.password === applicantData.confirmPassword ? "text-green-600" : "text-red-600"}`}
                                        >
                                            {applicantData.password === applicantData.confirmPassword
                                                ? "✓ Passwords match"
                                                : "✗ Passwords do not match"}
                                        </p>
                                    )}
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

                            {/* Photo Upload Section */}
                            <div>
                                <Label className="text-sm font-medium text-gray-700">
                                    Upload Photo
                                </Label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors bg-gray-50 mt-1">
                                    <input
                                        type="file"
                                        id="photo-upload"
                                        accept=".png, .jpg, .jpeg"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0]
                                            if (file) {
                                                console.log("Photo selected:", file.name);

                                                // check file extension to make sure it is either pdf, doc or docx
                                                const validExtensions = [".png", ".jpg", ".jpeg"];
                                                const fileExtension = file.name.split('.').pop()?.toLowerCase();

                                                if (!validExtensions.includes(`.${fileExtension}`)) {
                                                    showToast("Invalid file type. Please upload a image file.", "Error", "error");
                                                    setApplicantPhotoFile(null);
                                                    return;
                                                }
                                                setApplicantPhotoFile(file);
                                            }
                                        }}
                                    />
                                    <label htmlFor="photo-upload" className="cursor-pointer">
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
                                                    applicantPhotoFile ?
                                                        <>
                                                            <span className="font-medium">
                                                                {applicantPhotoFile.name}
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
                                            <div className="text-xs text-gray-400">PNG, JPG, JPEG (max 5MB)</div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                        </CardContent>
                    </Card>
                )

            case 2:
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl text-[#0a3141]">Professional Experience & CV</CardTitle>
                            <p className="text-gray-600">Upload your CV and provide your professional background.</p>
                        </CardHeader>
                        <CardContent className="space-y-6">

                            {/* CV Upload Section */}
                            <div>
                                <Label className="text-sm font-medium text-gray-700">
                                    Upload CV/Resume <span className="text-red-500">*</span>
                                </Label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors bg-gray-50 mt-1">
                                    <input
                                        type="file"
                                        id="cv-upload"
                                        accept=".pdf"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0]
                                            if (file) {
                                                console.log("CV file selected:", file.name);

                                                // check file extension to make sure it is either pdf, doc or docx
                                                const validExtensions = [".pdf",];
                                                const fileExtension = file.name.split('.').pop()?.toLowerCase();

                                                if (!validExtensions.includes(`.${fileExtension}`)) {
                                                    showToast("Invalid file type. Please upload a PDF file.", "Error", "error");
                                                    setCvFile(null);
                                                    return;
                                                }
                                                setCvFile(file);
                                            }
                                        }}
                                    />
                                    <label htmlFor="cv-upload" className="cursor-pointer">
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
                                                    cvFile ?
                                                        <>
                                                            <span className="font-medium">
                                                                {cvFile.name}
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
                                            <div className="text-xs text-gray-400">PDF (max 5MB)</div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Work Experience Summary */}
                            <div>
                                <Label className="text-sm font-medium text-gray-700">Work Experience Summary</Label>
                                <Textarea
                                    placeholder="Briefly describe your work experience, achievements, and key responsibilities..."
                                    value={applicantData.workExperience}
                                    onChange={(e) => handleInputChange("workExperience", e.target.value)}
                                    className="mt-1 min-h-[120px]"
                                />
                            </div>

                            {/* Desired Position and Expected Salary */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Desired Position Title</Label>
                                    <Input
                                        placeholder="e.g. Software Developer"
                                        value={applicantData.desiredPosition}
                                        onChange={(e) => handleInputChange("desiredPosition", e.target.value)}
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

                            {/* Professional Experience Section */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-[#0a3141]">Professional Experience</h3>
                                </div>

                                {/* List of added professional experiences */}
                                {applicantData.professionalExperiences.length > 0 && (
                                    <div className="space-y-4 mb-6">
                                        {applicantData.professionalExperiences.map((exp) => (
                                            <div key={exp.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative">
                                                <div className="absolute top-2 right-2 gap-2 flex">
                                                    <button
                                                        onClick={() => handleEditProfessionalExperience(exp.id)}
                                                        className="text-gray-400 hover:text-red-500"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => removeProfessionalExperience(exp.id)}
                                                        className="text-gray-400 hover:text-red-500"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                                                    <div>
                                                        <span className="text-sm font-medium text-gray-700">Company:</span>{" "}
                                                        <span className="text-sm">{exp.companyName}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-medium text-gray-700">Title:</span>{" "}
                                                        <span className="text-sm">{exp.title}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-medium text-gray-700">Period:</span>{" "}
                                                        <span className="text-sm">
                                                            {format(exp.startDate!, "MMM yyyy")} -{" "}
                                                            {exp.currentlyWorking ? "Present" : exp.endDate && !isNaN(new Date(exp.endDate).getTime()) ? format(new Date(exp.endDate), "MMM yyyy") : "Present"}                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="mt-2">
                                                    <span className="text-sm font-medium text-gray-700">Main Activities:</span>
                                                    <p className="text-sm mt-1">{exp.mainActivities}</p>
                                                </div>
                                                {exp.reference && (
                                                    <div className="mt-2">
                                                        <span className="text-sm font-medium text-gray-700">Reference:</span>
                                                        <p className="text-sm mt-1">{exp.reference}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Add new professional experience form */}
                                <Card className="border border-gray-200">
                                    <CardContent className="pt-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label className="text-sm font-medium text-gray-700">
                                                    Company Name <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    placeholder="Enter company name"
                                                    value={newProfessionalExperience.companyName}
                                                    onChange={(e) => handleProfessionalExperienceChange("companyName", e.target.value)}
                                                    className="mt-1 h-12"
                                                />
                                            </div>

                                            <div>
                                                <Label className="text-sm font-medium text-gray-700">
                                                    Title <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    placeholder="Enter job title"
                                                    value={newProfessionalExperience.title}
                                                    onChange={(e) => handleProfessionalExperienceChange("title", e.target.value)}
                                                    className="mt-1 h-12"
                                                />
                                            </div>

                                            <div>
                                                <Label className="text-sm font-medium text-gray-700">
                                                    Start Date <span className="text-red-500">*</span>
                                                </Label>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className={cn(
                                                                "w-full h-12 mt-1 justify-start text-left font-normal",
                                                                !newProfessionalExperience.startDate && "text-muted-foreground",
                                                            )}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {newProfessionalExperience.startDate
                                                                ? format(newProfessionalExperience.startDate, "MMM yyyy")
                                                                : "Select start date"}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0 z-50" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={newProfessionalExperience.startDate}
                                                            onSelect={(date) => handleProfessionalExperienceChange("startDate", date)}
                                                            disabled={(date) => date > new Date()}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </div>

                                            <div>
                                                <div className="flex items-center justify-between">
                                                    <Label className="text-sm font-medium text-gray-700">
                                                        End Date{" "}
                                                        {!newProfessionalExperience.currentlyWorking && <span className="text-red-500">*</span>}
                                                    </Label>
                                                    <div className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            id="currently-working"
                                                            checked={newProfessionalExperience.currentlyWorking}
                                                            onChange={(e) => handleProfessionalExperienceChange("currentlyWorking", e.target.checked)}
                                                            className="mr-2"
                                                        />
                                                        <label htmlFor="currently-working" className="text-xs text-gray-600">
                                                            Currently working here
                                                        </label>
                                                    </div>
                                                </div>
                                                {!newProfessionalExperience.currentlyWorking && (
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                className={cn(
                                                                    "w-full h-12 mt-1 justify-start text-left font-normal",
                                                                    !newProfessionalExperience.endDate && "text-muted-foreground",
                                                                )}
                                                            >
                                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                                {newProfessionalExperience.endDate
                                                                    ? format(newProfessionalExperience.endDate, "MMM yyyy")
                                                                    : "Select end date"}
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0 z-50" align="start">
                                                            <Calendar
                                                                mode="single"
                                                                selected={newProfessionalExperience.endDate}
                                                                onSelect={(date) => handleProfessionalExperienceChange("endDate", date)}
                                                                disabled={(date) =>
                                                                    date > new Date() ||
                                                                    (newProfessionalExperience.startDate && date < newProfessionalExperience.startDate) || false
                                                                }
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                )}
                                            </div>

                                            <div className="md:col-span-2">
                                                <Label className="text-sm font-medium text-gray-700">
                                                    Main Activities <span className="text-red-500">*</span>
                                                </Label>
                                                <Textarea
                                                    placeholder="Describe your main responsibilities and achievements..."
                                                    value={newProfessionalExperience.mainActivities}
                                                    onChange={(e) => handleProfessionalExperienceChange("mainActivities", e.target.value)}
                                                    className="mt-1 min-h-[80px]"
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <Label className="text-sm font-medium text-gray-700">Reference</Label>
                                                <Input
                                                    placeholder="Enter reference contact (optional)"
                                                    value={newProfessionalExperience.reference}
                                                    onChange={(e) => handleProfessionalExperienceChange("reference", e.target.value)}
                                                    className="mt-1 h-12"
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-4 flex justify-end">
                                            <Button
                                                onClick={addProfessionalExperience}
                                                className="bg-[#d2f277] text-black hover:bg-[#c2e267]"
                                            >
                                                <Plus className="w-4 h-4 mr-2" /> Add Experience
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Education Experience Section */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-[#0a3141]">Education</h3>
                                </div>

                                {/* List of added education experiences */}
                                {applicantData.educationExperiences.length > 0 && (
                                    <div className="space-y-4 mb-6">
                                        {applicantData.educationExperiences.map((exp) => (
                                            <div key={exp.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative">
                                                <div className="absolute top-2 right-2 gap-2 flex">
                                                    <button
                                                        onClick={() => handleEditEducationalExperience(exp.id)}
                                                        className="text-gray-400 hover:text-red-500"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => removeEducationExperience(exp.id)}
                                                        className="text-gray-400 hover:text-red-500"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                                                    <div>
                                                        <span className="text-sm font-medium text-gray-700">School:</span>{" "}
                                                        <span className="text-sm">{exp.school}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-medium text-gray-700">Title:</span>{" "}
                                                        <span className="text-sm">{exp.title}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-medium text-gray-700">Level:</span>{" "}
                                                        <span className="text-sm">{exp.educationLevel}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-medium text-gray-700">Period:</span>{" "}
                                                        <span className="text-sm">
                                                            {format(exp.startDate!, "MMM yyyy")} -{" "}
                                                            {exp.currentlyStudying ? "Present" : exp.endDate && !isNaN(new Date(exp.endDate).getTime()) ? format(new Date(exp.endDate), "MMM yyyy") : "Present"}                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Add new education experience form */}
                                <Card className="border border-gray-200">
                                    <CardContent className="pt-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label className="text-sm font-medium text-gray-700">
                                                    School <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    placeholder="Enter school or institution name"
                                                    value={newEducationExperience.school}
                                                    onChange={(e) => handleEducationExperienceChange("school", e.target.value)}
                                                    className="mt-1 h-12"
                                                />
                                            </div>

                                            <div>
                                                <Label className="text-sm font-medium text-gray-700">
                                                    Education Level <span className="text-red-500">*</span>
                                                </Label>
                                                <Select
                                                    value={newEducationExperience.educationLevel}
                                                    onValueChange={(value) => handleEducationExperienceChange("educationLevel", value)}
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
                                                    Title <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    placeholder="Enter degree or certificate title"
                                                    value={newEducationExperience.title}
                                                    onChange={(e) => handleEducationExperienceChange("title", e.target.value)}
                                                    className="mt-1 h-12"
                                                />
                                            </div>

                                            <div>
                                                <Label className="text-sm font-medium text-gray-700">
                                                    Start Date <span className="text-red-500">*</span>
                                                </Label>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className={cn(
                                                                "w-full h-12 mt-1 justify-start text-left font-normal",
                                                                !newEducationExperience.startDate && "text-muted-foreground",
                                                            )}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {newEducationExperience.startDate
                                                                ? format(newEducationExperience.startDate, "MMM yyyy")
                                                                : "Select start date"}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0 z-50" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={newEducationExperience.startDate}
                                                            onSelect={(date) => handleEducationExperienceChange("startDate", date)}
                                                            disabled={(date) => date > new Date()}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </div>

                                            <div>
                                                <div className="flex items-center justify-between">
                                                    <Label className="text-sm font-medium text-gray-700">
                                                        End Date{" "}
                                                        {!newEducationExperience.currentlyStudying && <span className="text-red-500">*</span>}
                                                    </Label>
                                                    <div className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            id="currently-studying"
                                                            checked={newEducationExperience.currentlyStudying}
                                                            onChange={(e) => handleEducationExperienceChange("currentlyStudying", e.target.checked)}
                                                            className="mr-2"
                                                        />
                                                        <label htmlFor="currently-studying" className="text-xs text-gray-600">
                                                            Currently studying here
                                                        </label>
                                                    </div>
                                                </div>
                                                {!newEducationExperience.currentlyStudying && (
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                className={cn(
                                                                    "w-full h-12 mt-1 justify-start text-left font-normal",
                                                                    !newEducationExperience.endDate && "text-muted-foreground",
                                                                )}
                                                            >
                                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                                {newEducationExperience.endDate
                                                                    ? format(newEducationExperience.endDate, "MMM yyyy")
                                                                    : "Select end date"}
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0 z-50" align="start">
                                                            <Calendar
                                                                mode="single"
                                                                selected={newEducationExperience.endDate}
                                                                onSelect={(date) => handleEducationExperienceChange("endDate", date)}
                                                                disabled={(date) =>
                                                                    date > new Date() ||
                                                                    (newEducationExperience.startDate && date < newEducationExperience.startDate) || false
                                                                }
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-4 flex justify-end">
                                            <Button onClick={addEducationExperience} className="bg-[#d2f277] text-black hover:bg-[#c2e267]">
                                                <Plus className="w-4 h-4 mr-2" /> Add Education
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Skills Section */}
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

                            {/* Languages and Certifications */}
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
                        </CardContent>
                    </Card>
                )
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
