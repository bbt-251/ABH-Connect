"use client"

import type React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/context/authContext"
import { useToast } from "@/context/toastContext"
import { db } from "@/lib/api/firebase/init"
import ApplicantModel, { EducationExperience, ProfessionalExperience } from "@/models/applicant"
import { doc, onSnapshot } from "firebase/firestore"
import { AlertCircle, Award, CalendarIcon, Edit, Edit2, Plus, SaveIcon, Trash2, UploadCloudIcon, X } from "lucide-react"
import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Popover, PopoverContent } from "@/components/ui/popover"
import { PopoverTrigger } from "@radix-ui/react-popover"
import { Calendar } from "@/components/ui/calendar"
import { countryCodes, educationLevels, experienceYears } from "@/app/auth/register/page"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import dayjs from "dayjs"
import { dateFormat } from "@/lib/api/dayjs_format"
import { updateApplicant } from "@/lib/api/user/applicant-service"
import { uploadApplicantPhoto } from "@/lib/api/firebase/upload/uploadPhoto"
import CVUploadDialog from "@/components/cv-upload-dialog"
import LoadingComponent from "@/components/loading"

interface ProfessionalExperienceForm {
    id: string;
    companyName: string;
    title: string;
    startDate: Date | undefined;
    endDate: Date | undefined;
    currentlyWorking: boolean;
    mainActivities: string;
    reference: string;
}

interface EducationExperienceForm {
    id: string;
    startDate: Date | undefined;
    endDate: Date | undefined;
    currentlyStudying: boolean;
    educationLevel: string;
    title: string;
    school: string;
}

export default function ApplicantProfilePage() {

    const { user, userData } = useAuth();
    const { showToast, hideToast } = useToast();

    const [loading, setLoading] = useState<boolean>(false);
    const [profile, setProfile] = useState<ApplicantModel | null>(null)

    // Skills state
    const [skills, setSkills] = useState<string[]>([])
    const [newSkill, setNewSkill] = useState("")

    const [languages, setLanguages] = useState<string[]>([])
    const [newLanguage, setNewLanguage] = useState("")

    const [certifications, setCertifications] = useState<string[]>([])
    const [newCertification, setNewCertification] = useState("")


    // New professional experience form state
    const [newProfessionalExperience, setNewProfessionalExperience] = useState<Omit<ProfessionalExperienceForm, "id">>({
        companyName: "",
        title: "",
        startDate: undefined,
        endDate: undefined,
        currentlyWorking: false,
        mainActivities: "",
        reference: "",
    })

    // New education experience form state
    const [newEducationExperience, setNewEducationExperience] = useState<Omit<EducationExperienceForm, "id">>({
        startDate: undefined,
        endDate: undefined,
        currentlyStudying: false,
        educationLevel: "",
        title: "",
        school: "",
    })

    const [applicantPhotoFile, setApplicantPhotoFile] = useState<File | null>(null);

    const [cvUploadDialogOpen, setCvUploadDialogOpen] = useState<boolean>(false);
    const [cvFile, setCvFile] = useState<File | null>(null);
    const handleCVUpload = async () => {
        if (cvFile && profile) {

            showToast("Please wait while we process your CV...", "Info", "default", 400000);

            const formData = new FormData();
            formData.append("file", cvFile);
            formData.append("yearsOfExperience", JSON.stringify(profile.yearsOfExperience));

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
                        ...professionalExperience.map(exp => ({
                            ...exp,
                            startDate: new Date(exp.startDate),
                            endDate: exp.endDate ? new Date(exp.endDate) : undefined,
                            id: Date.now().toString() + Math.random().toString(36).substring(2, 15), // Generate a unique ID
                        })),
                    ];

                    const updateForEducationalExperience = [
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
        }
    }

    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    useEffect(() => {
        // fetch using onSnapshot from firebase to actively listen for changes
        if (user && userData?.applicant) {
            setProfile(userData.applicant);
        } else {
            setProfile(null);
        }

        const applicantRef = doc(db, "applicant", userData?.applicant?.id || "");
        const unsubscribe = onSnapshot(applicantRef, (snapshot) => {
            if (snapshot.exists()) {
                const fetchedProfile = snapshot.data() as ApplicantModel;
                setProfile(fetchedProfile);
            } else {
                setProfile(null);
            }
        });

        return () => unsubscribe(); // Cleanup the listener on unmount
    }, []);

    useEffect(() => {
        if (profile) {
            // Update state with fetched profile data
            setSkills(profile.skills || []);
            setLanguages(profile.languages || []);
            setCertifications(profile.certifications || []);
        }

        return () => { }
    }, [profile]);

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

        const newExperience: ProfessionalExperienceForm = {
            ...newProfessionalExperience,
            id: Date.now().toString(),
        }

        if (profile) {
            handleInputChange("professionalExperiences", [...profile.professionalExperiences, newExperience]);
        }

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
        if (profile)
            handleInputChange(
                "professionalExperiences",
                profile.professionalExperiences.filter((exp) => exp.id !== id),
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

        const newExperience: EducationExperienceForm = {
            ...newEducationExperience,
            id: Date.now().toString(),
        }

        if (profile) handleInputChange("educationExperiences", [...profile.educationExperiences, newExperience])

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
        if (profile) handleInputChange(
            "educationExperiences",
            profile.educationExperiences.filter((exp) => exp.id !== id),
        )
    }

    // Skills functions
    const addSkill = () => {
        if (profile && newSkill.trim() && !skills.includes(newSkill.trim())) {
            handleInputChange("skills", [...profile.skills, newSkill.trim()])
            setSkills([...skills, newSkill.trim()])
            setNewSkill("")
        }
    }

    const removeSkill = (skillToRemove: string) => {
        if (profile) handleInputChange(
            "skills",
            profile.skills.filter((s) => s !== skillToRemove),
        )
        setSkills(skills.filter((skill) => skill !== skillToRemove))
    }

    const addLanguage = () => {
        if (profile && newLanguage.trim() && !languages.includes(newLanguage.trim())) {
            handleInputChange("languages", [...profile.languages, newLanguage.trim()])
            setLanguages([...languages, newLanguage.trim()])
            setNewLanguage("")
        }
    }

    const removeLanguage = (languageToRemove: string) => {
        if (profile) handleInputChange(
            "languages",
            profile.languages.filter((l) => l !== languageToRemove),
        )
        setLanguages(languages.filter((language) => language !== languageToRemove))
    }

    const addCertification = () => {
        if (profile && newCertification.trim() && !certifications.includes(newCertification.trim())) {
            handleInputChange("certifications", [...profile.certifications, newCertification.trim()])
            setCertifications([...certifications, newCertification.trim()])
            setNewCertification("")
        }
    }

    const removeCertification = (certificationToRemove: string) => {
        if (profile) handleInputChange(
            "certifications",
            profile.certifications.filter((c) => c !== certificationToRemove),
        )
        setCertifications(certifications.filter((certification) => certification !== certificationToRemove))
    }

    const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
        if (e.key === "Enter") {
            e.preventDefault()
            action()
        }
    }

    const handleInputChange = (field: keyof ApplicantModel, value: any) => {
        if (profile) {
            setProfile((prev) => (prev ? { ...prev, [field]: value } : prev));
        }
    }

    const handlePhoneNumberChange = (field: keyof ApplicantModel, value: string) => {
        const cleanedValue = value.replace(/[^\d\s-]/g, "")
        if (profile) {
            setProfile((prev) => (prev ? { ...prev, [field]: cleanedValue } : prev));
        }
    }

    const validatePhoneNumber = (countryCode: string, phoneNumber: string): boolean => {
        if (!phoneNumber.trim()) return false
        const countryInfo = countryCodes.find((c) => c.code === countryCode)
        if (!countryInfo) return false
        const cleanNumber = phoneNumber.replace(/[\s-]/g, "")
        return cleanNumber.length === countryInfo.length && /^\d+$/.test(cleanNumber)
    }

    const validateAge = (birthdate: Date | undefined): boolean => {
        if (!birthdate) return false
        const today = new Date()
        const age = today.getFullYear() - birthdate.getFullYear()
        const monthDiff = today.getMonth() - birthdate.getMonth()
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
            return age - 1 >= 18
        }
        return age >= 18
    }

    const validateApplicantData = (): boolean => {
        const errors: string[] = []
        if (profile) {
            const applicantData = profile

            if (!applicantData.firstName.trim()) errors.push("First Name is required")
            if (!applicantData.surname.trim()) errors.push("Surname is required")
            if (applicantData.birthdate && !validateAge(new Date(applicantData.birthdate))) {
                errors.push("You must be at least 18 years old to register")
            }
            if (!applicantData.gender) errors.push("Gender is required")
            if (!applicantData.levelOfEducation) errors.push("Level of Education is required")
            if (!applicantData.yearsOfExperience) errors.push("Years of Experience is required")
            if (!applicantData.phoneNumber.trim()) errors.push("Phone Number is required")
            if (!validatePhoneNumber(applicantData.phoneCountryCode, applicantData.phoneNumber)) {
                errors.push("Please enter a valid phone number for the selected country")
            }
            if (!applicantData.email.trim()) errors.push("Email Address is required")
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (applicantData.email && !emailRegex.test(applicantData.email)) {
                errors.push("Please enter a valid email address")
            }
            // if (!applicantData.password) errors.push("Password is required")
            // if (!applicantData.confirmPassword) errors.push("Confirm Password is required")
            // if (
            //     applicantData.password &&
            //     applicantData.confirmPassword &&
            //     applicantData.password !== applicantData.confirmPassword
            // ) {
            //     errors.push("Passwords do not match")
            // }
            // if (applicantData.password && applicantData.password.length < 6) {
            //     errors.push("Password must be at least 6 characters long")
            // }
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
        }

        setValidationErrors(errors)
        return errors.length === 0
    }

    const handleContinue = async () => {

        if (!validateApplicantData()) {
            return
        }

        setLoading(true);

        // const applicantProfile: Omit<ApplicantModel, "id" | "uid"> = {
        //     firstName: applicantData.firstName,
        //     surname: applicantData.surname,
        //     birthdate: dayjs(applicantData.birthdate).format(dateFormat),
        //     birthplace: applicantData.birthplace,
        //     gender: applicantData.gender as "Male" | "Female",
        //     levelOfEducation: applicantData.levelOfEducation,
        //     yearsOfExperience: applicantData.yearsOfExperience,
        //     email: applicantData.email,
        //     phoneCountryCode: applicantData.phoneCountryCode,
        //     phoneNumber: applicantData.phone,
        //     faydaNumber: applicantData.faydaNumber,
        //     tinNumber: applicantData.tinNumber,

        //     // step 2
        //     cvDocument: null,
        //     workExperienceSummary: applicantData.workExperience,
        //     desiredPosition: applicantData.desiredPosition,
        //     expectedSalary: applicantData.expectedSalary,
        //     professionalExperiences: applicantData.professionalExperiences.map(exp => ({
        //         ...exp,
        //         startDate: dayjs(exp.startDate).format(dateFormat),
        //         endDate: exp.currentlyWorking ? null : dayjs(exp.endDate).format(dateFormat),
        //     })),
        //     educationExperiences: applicantData.educationExperiences.map(exp => ({
        //         ...exp,
        //         startDate: dayjs(exp.startDate).format(dateFormat),
        //         endDate: exp.currentlyStudying ? null : dayjs(exp.endDate).format(dateFormat),
        //     })),
        //     skills: applicantData.skills,
        //     languages: applicantData.languages,
        //     certifications: applicantData.certifications,
        //     photo: null,
        // };

        // create applicant
        // await register({ email: applicantProfile.email, password: applicantData.password, applicant: applicantProfile })
        //     .then(async (a) => {
        //         console.log("registered applicant: ", a);
        //         if (a && a.id) {
        //             // upload files 
        //             if (cvFile) {
        //                 await uploadCV(a.id, cvFile)
        //             }
        //             if (applicantPhotoFile) {
        //                 await uploadApplicantPhoto(a.id, applicantPhotoFile)
        //             }
        //             showToast("Registration successful!", "Success", "success");
        //             router.push("/auth")
        //         }
        //         else {
        //             console.error("registration failed or registration was successful and file upload failed");
        //             showToast("Registration failed. Please try again.", "Error", "error");
        //         }

        //     });

        // change the startDate and endDate to string format
        if (profile) {

            const experiences = profile.professionalExperiences as unknown as ProfessionalExperienceForm[];
            const educations = profile.educationExperiences as unknown as EducationExperienceForm[];

            const formattedExperiences: ProfessionalExperience[] = experiences.map((exp) => ({
                ...exp,
                startDate: dayjs(exp.startDate).format(dateFormat),
                endDate: exp.currentlyWorking ? null : exp.endDate ? dayjs(exp.endDate).format(dateFormat) : null,
            }));

            const formattedEducations: EducationExperience[] = educations.map((exp) => ({
                ...exp,
                startDate: dayjs(exp.startDate).format(dateFormat),
                endDate: exp.currentlyStudying ? null : exp.endDate ? dayjs(exp.endDate).format(dateFormat) : null,
            }));

            const updatedProfile: ApplicantModel = {
                ...profile,
                professionalExperiences: formattedExperiences,
                educationExperiences: formattedEducations,
            };

            console.log("profile: ", updatedProfile);

            const res = await updateApplicant(updatedProfile);
            if (res) {
                showToast("Profile updated successfully!", "Success", "success");
                if (applicantPhotoFile) await uploadApplicantPhoto(updatedProfile.id, applicantPhotoFile);
                if (cvFile) {
                    // parse and set the states

                    // upload cv file
                }
            }
            else showToast("Failed to update profile. Please try again.", "Error", "error");
        }

        setLoading(false);
    }

    const handleEditProfessionalExperience = (id: string) => {
        if (profile) {
            const experience = profile.professionalExperiences.find((exp) => exp.id === id)
            if (experience) {
                setNewProfessionalExperience({
                    companyName: experience.companyName,
                    title: experience.title,
                    startDate: new Date(experience.startDate),
                    endDate: experience.endDate ? new Date(experience.endDate) : undefined,
                    currentlyWorking: !!experience.currentlyWorking,
                    mainActivities: experience.mainActivities,
                    reference: experience.reference || "",
                })
                removeProfessionalExperience(id)
            }
        }
    }

    const handleEditEducationalExperience = (id: string) => {
        if (profile) {
            const experience = profile.educationExperiences.find((exp) => exp.id === id)
            if (experience) {
                setNewEducationExperience({
                    startDate: new Date(experience.startDate),
                    endDate: experience.endDate ? new Date(experience.endDate) : undefined,
                    currentlyStudying: !!experience.currentlyStudying,
                    educationLevel: experience.educationLevel,
                    title: experience.title,
                    school: experience.school,
                })
                removeEducationExperience(id)
            }
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                    <p className="text-gray-600 mt-2">Update your profile by adding newly acquired experiences or skills</p>
                </div>

                <div className="flex lg:flex-row sm:flex-col gap-3">
                    <Button
                        className="bg-[#d2f277] text-black hover:bg-[#c2e267]"
                        onClick={handleContinue}
                        disabled={loading}
                    >
                        <SaveIcon className="h-4 w-4 mr-2" />
                        {loading ? "Saving ..." : "Save Profile"}
                    </Button>
                    <Button
                        className="bg-[#d2f277] text-black hover:bg-[#c2e267]"
                        onClick={() => setCvUploadDialogOpen(true)}
                    >
                        <UploadCloudIcon className="h-4 w-4 mr-2" />
                        Reset your profile by importing your CV
                    </Button>
                </div>
            </div>

            <div className="max-w p-3">
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
            </div>

            <Tabs defaultValue="personal" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="personal">Personal Info</TabsTrigger>
                    <TabsTrigger value="experience">Professional Experience</TabsTrigger>
                    <TabsTrigger value="education">Educational Experience</TabsTrigger>
                    <TabsTrigger value="skills">Skills</TabsTrigger>
                </TabsList>

                <TabsContent value="personal">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <p className="text-gray-600">Please provide your personal details.</p>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center space-x-6">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage src={profile?.photo ?? "/placeholder.svg"} alt="Profile" />
                                    <AvatarFallback>
                                        {profile?.firstName
                                            ? profile.firstName.charAt(0).toUpperCase()
                                            : ""}
                                    </AvatarFallback>
                                </Avatar>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">
                                        First Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        placeholder="Enter your first name"
                                        value={profile?.firstName ?? ""}
                                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                                        className="mt-1 h-12"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">
                                        Surname <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        placeholder="Enter your surname"
                                        value={profile?.surname ?? ""}
                                        onChange={(e) => handleInputChange("surname", e.target.value)}
                                        className="mt-1 h-12"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">Birth Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full h-12 mt-1 justify-start text-left font-normal",
                                                    !profile?.birthdate && "text-muted-foreground",
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {profile?.birthdate ? format(profile?.birthdate, "PPP") : "Select birth date"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 z-50" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={profile?.birthdate ? new Date(profile?.birthdate) : undefined}
                                                onSelect={(date) => handleInputChange("birthdate", date)}
                                                disabled={(date) => date > new Date(new Date().setFullYear(new Date().getFullYear() - 18)) || date < new Date("1900-01-01")}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <p className="text-xs text-gray-500 mt-1">Optional - Must be at least 18 years old if provided</p>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">Birth Place</Label>
                                    <Input
                                        placeholder="Enter birth place (optional)"
                                        value={profile?.birthplace ?? ""}
                                        onChange={(e) => handleInputChange("birthplace", e.target.value)}
                                        className="mt-1 h-12"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">
                                        Gender <span className="text-red-500">*</span>
                                    </Label>
                                    <Select value={profile?.gender ?? ""} onValueChange={(value) => handleInputChange("gender", value)}>
                                        <SelectTrigger className="mt-1 h-12">
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">
                                        Email Address <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        type="email"
                                        placeholder="your.email@example.com"
                                        value={profile?.email ?? ""}
                                        // onChange={(e) => handleInputChange("email", e.target.value)}
                                        className="mt-1 h-12"
                                        disabled
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">
                                        Phone Number <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="flex gap-2 mt-1">
                                        <Select
                                            value={profile?.phoneCountryCode ?? ""}
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
                                            value={profile?.phoneNumber ?? ""}
                                            onChange={(e) => handlePhoneNumberChange("phoneNumber", e.target.value)}
                                            className="flex-1 h-12"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Enter numbers only (spaces and hyphens allowed)</p>
                                </div>

                                {/* <div className="space-y-2">
                                    <Label htmlFor="password">
                                        Password <span className="text-red-500">*</span>
                                    </Label>
                                    <Input id="password" type="password" placeholder="Enter password" defaultValue="********" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">
                                        Confirm Password <span className="text-red-500">*</span>
                                    </Label>
                                    <Input id="confirmPassword" type="password" placeholder="Confirm password" defaultValue="********" />
                                </div> */}

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">Fayda Number</Label>
                                    <Input
                                        placeholder="Enter Fayda number (optional)"
                                        value={profile?.faydaNumber ?? ""}
                                        onChange={(e) => handleInputChange("faydaNumber", e.target.value)}
                                        className="mt-1 h-12"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">TIN Number</Label>
                                    <Input
                                        placeholder="Enter TIN number (optional)"
                                        value={profile?.tinNumber ?? ""}
                                        onChange={(e) => handleInputChange("tinNumber", e.target.value)}
                                        className="mt-1 h-12"
                                    />
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
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="experience">
                    <Card>
                        <CardHeader>
                            <CardTitle>Work Experience</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Level of Education */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">
                                    Years of Experience <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={profile?.yearsOfExperience ?? ""}
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

                            {/* Work ProfessionalExperience Summary */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Work Experience Summary</Label>
                                <Textarea
                                    placeholder="Briefly describe your work experience, achievements, and key responsibilities..."
                                    value={profile?.workExperienceSummary ?? ""}
                                    onChange={(e) => handleInputChange("workExperienceSummary", e.target.value)}
                                    className="mt-1 min-h-[120px]"
                                />
                            </div>

                            {/* Desired Position and Expected Salary */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Desired Position Title</Label>
                                    <Input
                                        placeholder="e.g. Software Developer"
                                        value={profile?.desiredPosition  ?? ""}
                                        onChange={(e) => handleInputChange("desiredPosition", e.target.value)}
                                        className="mt-1 h-12"
                                    />
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Expected Salary</Label>
                                    <Input
                                        placeholder="e.g. 2,000,000 TZS"
                                        value={profile?.expectedSalary  ?? ""}
                                        onChange={(e) => handleInputChange("expectedSalary", e.target.value)}
                                        className="mt-1 h-12"
                                    />
                                </div>
                            </div>

                            {/* Professional ProfessionalExperience */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-[#0a3141]">Professional Experience</h3>
                                </div>

                                {/* List of added professional experiences */}
                                {(profile?.professionalExperiences ?? []).length > 0 && (
                                    <div className="space-y-4 mb-6">
                                        {(profile?.professionalExperiences ?? []).map((exp) => (
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
                                                    value={newProfessionalExperience.companyName ?? ""}
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
                                                    value={newProfessionalExperience.title ?? ""}
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
                                                    value={newProfessionalExperience.reference ?? ""}
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
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="education">
                    <Card>
                        <CardHeader>
                            <CardTitle>Education</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Level of Education */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">
                                    Level of Education <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={profile?.levelOfEducation ?? ""}
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

                            {/* Education Entries */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-[#0a3141]">Educational Experience</h3>
                                </div>

                                {/* List of added education experiences */}
                                {(profile?.educationExperiences ?? []).length > 0 && (
                                    <div className="space-y-4 mb-6">
                                        {(profile?.educationExperiences ?? []).map((exp) => (
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
                                                    value={newEducationExperience.school ?? ""}
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
                                                    value={newEducationExperience.title ?? ""}
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
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="skills">
                    <Card>
                        <CardHeader>
                            <CardTitle>Skills & Expertise</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            {/* Skills Section */}
                            <div>
                                <Label className="text-base font-semibold">Skills</Label>
                                <div className="mt-3 flex items-center">
                                    <div className="flex-1 relative">
                                        <Input
                                            placeholder="Add a skill (e.g. JavaScript, Python)"
                                            value={newSkill ?? ""}
                                            onChange={(e) => setNewSkill(e.target.value)}
                                            onKeyPress={(e) => handleKeyPress(e, addSkill)}
                                        />
                                    </div>
                                    <Button
                                        className="ml-2 h-10 w-10 rounded-md bg-lime-400 hover:bg-lime-500 text-gray-900 flex items-center justify-center p-0"
                                        onClick={addSkill}
                                    >
                                        <Plus className="h-5 w-5" />
                                    </Button>
                                </div>
                                <p className="text-sm text-gray-500 mt-2">Press Enter or click + to add skills</p>

                                <div className="flex flex-wrap gap-2 mt-4">
                                    {skills.map((skill) => (
                                        <Badge key={skill} variant="secondary" className="text-sm py-1 px-3 pr-1 flex items-center gap-1">
                                            {skill}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-4 w-4 p-0 hover:bg-transparent"
                                                onClick={() => removeSkill(skill)}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Languages Section */}
                            <div>
                                <Label className="text-base font-semibold">Languages</Label>
                                <div className="mt-3 flex items-center">
                                    <div className="flex-1 relative">
                                        <Input
                                            placeholder="Add a language (e.g. English, Swahili)"
                                            value={newLanguage ?? ""}
                                            onChange={(e) => setNewLanguage(e.target.value)}
                                            onKeyPress={(e) => handleKeyPress(e, addLanguage)}
                                        />
                                    </div>
                                    <Button
                                        className="ml-2 h-10 w-10 rounded-md bg-lime-400 hover:bg-lime-500 text-gray-900 flex items-center justify-center p-0"
                                        onClick={addLanguage}
                                    >
                                        <Plus className="h-5 w-5" />
                                    </Button>
                                </div>

                                <div className="flex flex-wrap gap-2 mt-4">
                                    {languages.map((language) => (
                                        <Badge
                                            key={language}
                                            variant="secondary"
                                            className="text-sm py-1 px-3 pr-1 flex items-center gap-1"
                                        >
                                            {language}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-4 w-4 p-0 hover:bg-transparent"
                                                onClick={() => removeLanguage(language)}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Certifications Section */}
                            <div>
                                <Label className="text-base font-semibold">Certifications</Label>
                                <div className="mt-3 flex items-center">
                                    <div className="flex-1 relative">
                                        <Input
                                            placeholder="Add a certification"
                                            value={newCertification}
                                            onChange={(e) => setNewCertification(e.target.value)}
                                            onKeyPress={(e) => handleKeyPress(e, addCertification)}
                                        />
                                    </div>
                                    <Button
                                        className="ml-2 h-10 w-10 rounded-md bg-lime-400 hover:bg-lime-500 text-gray-900 flex items-center justify-center p-0"
                                        onClick={addCertification}
                                    >
                                        <Plus className="h-5 w-5" />
                                    </Button>
                                </div>

                                <div className="space-y-3 mt-4">
                                    {certifications.map((certification, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <Award className={`h-5 w-5 ${"text-blue-500"}`} />
                                                <div>
                                                    <h4 className="font-medium">{certification}</h4>
                                                    {/* <p className="text-sm text-gray-500">
                                                        {index === 0 ? "Amazon Web Services • Expires Dec 2024" : "Meta • Issued Jan 2023"}
                                                    </p> */}
                                                </div>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => removeCertification(certification)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <CVUploadDialog
                open={cvUploadDialogOpen}
                setOpen={setCvUploadDialogOpen}
                setFile={setCvFile}
                onSubmit={handleCVUpload}
            />
        </div>
    )

}