"use client"

import { companySizes, companyTypes, countries, countryCodes } from "@/app/auth/register/page"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/context/authContext"
import { useToast } from "@/context/toastContext"
import { db } from "@/lib/api/firebase/init"
import { uploadBusinessLicense } from "@/lib/api/firebase/upload/uploadBusinessDocuments"
import { uploadCompanyLogo } from "@/lib/api/firebase/upload/uploadCompanyLogo"
import { updateCompany } from "@/lib/api/user/company-service"
import CompanyModel from "@/models/company"
import { doc, onSnapshot } from "firebase/firestore"
import { AlertCircle, Building2, SaveIcon, Settings, Shield, Upload } from "lucide-react"
import { useEffect, useState } from "react"

export default function CompanyProfilePage() {

    const { user, userData } = useAuth();
    const company = userData?.company;

    const { showToast, hideToast } = useToast();

    const [loading, setLoading] = useState<boolean>(false);

    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [businessLicenseFile, setBusinessLicenseFile] = useState<File | null>(null);
    const [companyLogoFile, setCompanyLogoFile] = useState<File | null>(null);

    const [profile, setProfile] = useState<CompanyModel | null>(null);
    useEffect(() => {
        // fetch using onSnapshot from firebase to actively listen for changes
        if (user && userData?.company) {
            setProfile(userData.company);
        } else {
            setProfile(null);
        }

        const applicantRef = doc(db, "company", userData?.company?.id || "");
        const unsubscribe = onSnapshot(applicantRef, (snapshot) => {
            if (snapshot.exists()) {
                const fetchedProfile = snapshot.data() as CompanyModel;
                setProfile(fetchedProfile);
            } else {
                setProfile(null);
            }
        });

        return () => unsubscribe(); // Cleanup the listener on unmount
    }, []);

    const [activeTab, setActiveTab] = useState("company-info");

    const calculateProgress = () => {
        if (profile) {
            const fields = Object.values(profile)
            const filledFields = fields.filter((field) => field !== "" && field !== null).length
            return Math.round((filledFields / fields.length) * 100)
        }

        return 0;
    }

    const handleCompanyInputChange = (field: keyof Omit<CompanyModel, "id">, value: string) => {
        if (profile) {
            setProfile((prev) => (prev ? { ...prev, [field]: value } : prev));
        }
    }

    const validatePhoneNumber = (countryCode: string, phoneNumber: string): boolean => {
        if (!phoneNumber.trim()) return false
        const countryInfo = countryCodes.find((c) => c.code === countryCode)
        if (!countryInfo) return false
        const cleanNumber = phoneNumber.replace(/[\s-]/g, "")
        return cleanNumber.length === countryInfo.length && /^\d+$/.test(cleanNumber)
    }

    const validateCompanyData = (): boolean => {
        const errors: string[] = []
        if (profile) {
            if (!profile.companyName.trim()) errors.push("Company Name is required")
            if (!profile.companyType) errors.push("Company Type is required")
            if (!profile.companySize) errors.push("Company Size is required")
            if (!profile.country) errors.push("Country is required")
            if (
                profile.officialPhone &&
                !validatePhoneNumber(profile.officialPhoneCountryCode, profile.officialPhone)
            ) {
                errors.push("Please enter a valid phone number for the selected country")
            }

            if (!profile.fullName.trim()) errors.push("Full Name is required")
            // if (!profile.adminEmail.trim()) errors.push("Email Address is required")
            if (!profile.adminPhone.trim()) errors.push("Phone Number is required")
            if (!validatePhoneNumber(profile.adminPhoneCountryCode, profile.adminPhone)) {
                errors.push("Please enter a valid phone number for the selected country")
            }
            // if (!profile.password) errors.push("Password is required")
            // if (!profile.confirmPassword) errors.push("Confirm Password is required")
            // if (
            //     profile.password &&
            //     profile.confirmPassword &&
            //     profile.password !== profile.confirmPassword
            // ) {
            //     errors.push("Passwords do not match")
            // }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            // if (profile.adminEmail && !emailRegex.test(profile.adminEmail)) {
            //     errors.push("Please enter a valid email address")
            // }
            if (!profile.tinNumber.trim()) errors.push("TIN Number is required")
        }

        setValidationErrors(errors)
        return errors.length === 0
    }

    const handleContinue = async () => {

        if (!validateCompanyData()) {
            return
        }

        setLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        if (profile) {
            console.log("updatedProfile: ", profile);
            const res = await updateCompany(profile);
            if (res) {
                showToast("Saved!", "Success", "success");
                if (businessLicenseFile) {
                    hideToast();
                    showToast("Uploading business license document...", "Please wait", "default");
                    await uploadBusinessLicense(profile.id, businessLicenseFile);
                    showToast("Business license uploaded!", "Success", "success");
                }
                if (companyLogoFile) {
                    showToast("Uploading company logo...", "Please wait", "default");
                    await uploadCompanyLogo(profile.id, companyLogoFile);
                    showToast("Company logo uploaded!", "Success", "success");
                }
            }
        }

        setLoading(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Company Profile</h1>
                    <p className="text-gray-600">Manage your company information and settings</p>
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
                </div>
            </div>

            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Profile Completion</span>
                    <span className="text-sm font-medium text-gray-700">{calculateProgress()}% Complete</span>
                </div>
                <Progress value={calculateProgress()} className="h-2" />
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div className="md:col-span-2">
                                    <Label className="text-sm font-medium text-gray-700">
                                        Company Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        placeholder="Enter company name"
                                        value={profile?.companyName ?? ""}
                                        onChange={(e) => handleCompanyInputChange("companyName", e.target.value)}
                                        className="mt-1 h-12"
                                    />
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700">
                                        Company Type <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={profile?.companyType ?? ""}
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
                                        value={profile?.companySize ?? ""}
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
                                        value={profile?.country ?? ""}
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
                                        value={profile?.cityLocation ?? ""}
                                        onChange={(e) => handleCompanyInputChange("cityLocation", e.target.value)}
                                        className="mt-1 h-12"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <Label className="text-sm font-medium text-gray-700">Official Business Email</Label>
                                    <Input
                                        type="email"
                                        placeholder="company@example.com"
                                        value={profile?.officialEmail ?? ""}
                                        onChange={(e) => handleCompanyInputChange("officialEmail", e.target.value)}
                                        className="mt-1 h-12"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <Label className="text-sm font-medium text-gray-700">Official Phone Number</Label>
                                    <div className="flex gap-2 mt-1">
                                        <Select
                                            value={profile?.officialPhoneCountryCode ?? ""}
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
                                            value={profile?.officialPhone ?? ""}
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
                                        value={profile?.websiteUrl ?? ""}
                                        onChange={(e) => handleCompanyInputChange("websiteUrl", e.target.value)}
                                        className="mt-1 h-12"
                                    />
                                </div>
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <Label className="text-sm font-medium text-gray-700">
                                        Full Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        placeholder="Enter full name"
                                        value={profile?.fullName ?? ""}
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
                                        value={profile?.email ?? ""}
                                        // onChange={(e) => handleCompanyInputChange("email", e.target.value)}
                                        className="mt-1 h-12"
                                        disabled
                                    />
                                    <p className="text-xs text-gray-500 mt-1">This email will be used for login</p>
                                </div>

                                <div className="md:col-span-2">
                                    <Label className="text-sm font-medium text-gray-700">
                                        Phone Number <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="flex gap-2 mt-1">
                                        <Select
                                            value={profile?.adminPhoneCountryCode ?? ""}
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
                                            value={profile?.adminPhone ?? ""}
                                            onChange={(e) => {
                                                const cleanedValue = e.target.value.replace(/[^\d\s-]/g, "")
                                                handleCompanyInputChange("adminPhone", cleanedValue)
                                            }}
                                            className="flex-1 h-12"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Enter numbers only (spaces and hyphens allowed)</p>
                                </div>

                                {/* <div className="md:col-span-2">
                                    <Label className="text-sm font-medium text-gray-700">
                                        Password <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        type="password"
                                        placeholder="••••••••••••"
                                        value={profile?.password ?? ""}
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
                                        value={profile?.confirmPassword ?? ""}
                                        onChange={(e) => handleCompanyInputChange("confirmPassword", e.target.value)}
                                        className="mt-1 h-12"
                                    />
                                </div> */}
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
                            <div>
                                <Label className="text-sm font-medium text-gray-700">
                                    TIN Number <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    placeholder="Enter TIN number"
                                    value={profile?.tinNumber ?? ""}
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
                </TabsContent>
            </Tabs>
        </div>
    )
}
