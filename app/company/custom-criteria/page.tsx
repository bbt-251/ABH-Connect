"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  FileText,
  CalendarIcon,
  Upload,
  Star,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  Building,
  Save,
  Send,
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface CustomCriteria {
  id: string
  title: string
  description: string
  type: "text" | "number" | "date" | "multiple_choice" | "checkbox" | "rating" | "file_upload" | "long_text"
  required: boolean
  options?: string[]
  minValue?: number
  maxValue?: number
  placeholder?: string
  helpText?: string
}

interface FormResponse {
  criteriaId: string
  value: any
}

const customCriteria: CustomCriteria[] = [
  {
    id: "1",
    title: "Years of Relevant Experience",
    description: "How many years of relevant work experience do you have in this field?",
    type: "number",
    required: true,
    minValue: 0,
    maxValue: 50,
    placeholder: "Enter years of experience",
    helpText: "Include internships and part-time work experience",
  },
  {
    id: "2",
    title: "Technical Skills",
    description: "Which of the following technical skills do you possess?",
    type: "checkbox",
    required: true,
    options: ["JavaScript", "Python", "React", "Node.js", "SQL", "AWS", "Docker", "Git"],
    helpText: "Select all that apply to your skill set",
  },
  {
    id: "3",
    title: "Availability Start Date",
    description: "When would you be available to start working?",
    type: "date",
    required: true,
    helpText: "Please provide your earliest available start date",
  },
  {
    id: "4",
    title: "Work Arrangement Preference",
    description: "What is your preferred work arrangement?",
    type: "multiple_choice",
    required: true,
    options: ["Fully Remote", "Hybrid (2-3 days in office)", "Mostly On-site", "Flexible/Open to Discussion"],
    helpText: "Choose the option that best describes your preference",
  },
  {
    id: "5",
    title: "Portfolio or Work Samples",
    description: "Please upload your portfolio, work samples, or relevant documents",
    type: "file_upload",
    required: false,
    helpText: "Accepted formats: PDF, DOC, DOCX, ZIP (Max 10MB per file)",
  },
  {
    id: "6",
    title: "Rate Your Overall Technical Proficiency",
    description: "On a scale of 1-5, how would you rate your overall technical skills?",
    type: "rating",
    required: true,
    minValue: 1,
    maxValue: 5,
    helpText: "1 = Beginner, 2 = Basic, 3 = Intermediate, 4 = Advanced, 5 = Expert",
  },
  {
    id: "7",
    title: "Why are you interested in this position?",
    description: "Please explain your motivation for applying to this role and what interests you about our company.",
    type: "long_text",
    required: true,
    placeholder: "Share your thoughts and motivations...",
    helpText: "Minimum 100 characters required",
  },
  {
    id: "8",
    title: "Expected Salary Range",
    description: "What is your expected annual salary range (in USD)?",
    type: "text",
    required: false,
    placeholder: "e.g., $80,000 - $100,000",
    helpText: "This information helps us ensure our offer aligns with your expectations",
  },
]

export default function CustomCriteriaForm() {
  const [responses, setResponses] = useState<FormResponse[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File[] }>({})
  const [ratings, setRatings] = useState<{ [key: string]: number }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDraft, setIsDraft] = useState(false)

  const updateResponse = (criteriaId: string, value: any) => {
    setResponses((prev) => {
      const existing = prev.find((r) => r.criteriaId === criteriaId)
      if (existing) {
        return prev.map((r) => (r.criteriaId === criteriaId ? { ...r, value } : r))
      }
      return [...prev, { criteriaId, value }]
    })
  }

  const getResponse = (criteriaId: string) => {
    return responses.find((r) => r.criteriaId === criteriaId)?.value
  }

  const handleFileUpload = (criteriaId: string, files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files)
      setUploadedFiles((prev) => ({ ...prev, [criteriaId]: fileArray }))
      updateResponse(criteriaId, fileArray)
    }
  }

  const handleRating = (criteriaId: string, rating: number) => {
    setRatings((prev) => ({ ...prev, [criteriaId]: rating }))
    updateResponse(criteriaId, rating)
  }

  const isFormValid = () => {
    const requiredCriteria = customCriteria.filter((c) => c.required)
    return requiredCriteria.every((criteria) => {
      const response = getResponse(criteria.id)
      if (!response) return false
      if (Array.isArray(response)) return response.length > 0
      if (typeof response === "string") return response.trim().length > 0
      return true
    })
  }

  const getCompletionPercentage = () => {
    const totalCriteria = customCriteria.length
    const completedCriteria = customCriteria.filter((criteria) => {
      const response = getResponse(criteria.id)
      if (!response) return false
      if (Array.isArray(response)) return response.length > 0
      if (typeof response === "string") return response.trim().length > 0
      return true
    }).length
    return Math.round((completedCriteria / totalCriteria) * 100)
  }

  const handleSubmit = async (asDraft = false) => {
    setIsSubmitting(true)
    setIsDraft(asDraft)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("Form submitted:", { responses, asDraft })
    setIsSubmitting(false)

    // Show success message or redirect
    alert(asDraft ? "Draft saved successfully!" : "Application submitted successfully!")
  }

  const renderCriteriaInput = (criteria: CustomCriteria) => {
    const response = getResponse(criteria.id)

    switch (criteria.type) {
      case "text":
        return (
          <Input
            placeholder={criteria.placeholder}
            value={response || ""}
            onChange={(e) => updateResponse(criteria.id, e.target.value)}
            className="w-full"
          />
        )

      case "long_text":
        return (
          <Textarea
            placeholder={criteria.placeholder}
            value={response || ""}
            onChange={(e) => updateResponse(criteria.id, e.target.value)}
            rows={4}
            className="w-full"
          />
        )

      case "number":
        return (
          <Input
            type="number"
            placeholder={criteria.placeholder}
            value={response || ""}
            onChange={(e) => updateResponse(criteria.id, e.target.value)}
            min={criteria.minValue}
            max={criteria.maxValue}
            className="w-full"
          />
        )

      case "date":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !response && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {response ? format(new Date(response), "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={response ? new Date(response) : undefined}
                onSelect={(date) => {
                  if (date) {
                    updateResponse(criteria.id, date.toISOString())
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        )

      case "multiple_choice":
        return (
          <RadioGroup
            value={response || ""}
            onValueChange={(value) => updateResponse(criteria.id, value)}
            className="space-y-2"
          >
            {criteria.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${criteria.id}-${option}`} />
                <Label htmlFor={`${criteria.id}-${option}`} className="font-normal">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )

      case "checkbox":
        return (
          <div className="space-y-2">
            {criteria.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`${criteria.id}-${option}`}
                  checked={(response || []).includes(option)}
                  onCheckedChange={(checked) => {
                    const currentValues = response || []
                    if (checked) {
                      updateResponse(criteria.id, [...currentValues, option])
                    } else {
                      updateResponse(
                        criteria.id,
                        currentValues.filter((v: string) => v !== option),
                      )
                    }
                  }}
                />
                <Label htmlFor={`${criteria.id}-${option}`} className="font-normal">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        )

      case "rating":
        return (
          <div className="flex items-center space-x-1">
            {Array.from({ length: criteria.maxValue || 5 }, (_, i) => i + 1).map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRating(criteria.id, star)}
                className={cn(
                  "p-1 rounded transition-colors",
                  (ratings[criteria.id] || response || 0) >= star
                    ? "text-yellow-400 hover:text-yellow-500"
                    : "text-gray-300 hover:text-gray-400",
                )}
              >
                <Star className="w-6 h-6 fill-current" />
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {ratings[criteria.id] || response || 0} / {criteria.maxValue || 5}
            </span>
          </div>
        )

      case "file_upload":
        return (
          <div className="space-y-2">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <div className="text-sm text-gray-600 mb-2">
                <label htmlFor={`file-${criteria.id}`} className="cursor-pointer text-blue-600 hover:text-blue-500">
                  Click to upload files
                </label>
                <span> or drag and drop</span>
              </div>
              <input
                id={`file-${criteria.id}`}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => handleFileUpload(criteria.id, e.target.files)}
                accept=".pdf,.doc,.docx,.zip"
              />
            </div>
            {uploadedFiles[criteria.id] && uploadedFiles[criteria.id].length > 0 && (
              <div className="space-y-1">
                {uploadedFiles[criteria.id].map((file, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    <FileText className="w-4 h-4" />
                    <span>{file.name}</span>
                    <span className="text-xs">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0a3141] to-[#1a4a5c] rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Custom Application Criteria</h1>
            <p className="text-gray-200">
              Please complete the following criteria to help us better understand your qualifications.
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-200 mb-1">Progress</div>
            <div className="text-2xl font-bold">{getCompletionPercentage()}%</div>
          </div>
        </div>
        <div className="mt-4">
          <Progress value={getCompletionPercentage()} className="h-2 bg-white/20" />
        </div>
      </div>

      {/* Form Instructions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Instructions</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Fields marked with an asterisk (*) are required</li>
                <li>• You can save your progress as a draft and return later</li>
                <li>• Make sure to review all your answers before final submission</li>
                <li>• Contact us if you need help with any questions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Building className="w-8 h-8 text-[#0a3141]" />
            <div>
              <div className="font-medium">TechCorp Inc.</div>
              <div className="text-sm text-gray-600">Senior Software Engineer</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <User className="w-8 h-8 text-[#0a3141]" />
            <div>
              <div className="font-medium">John Doe</div>
              <div className="text-sm text-gray-600">john.doe@email.com</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="w-8 h-8 text-[#0a3141]" />
            <div>
              <div className="font-medium">Started</div>
              <div className="text-sm text-gray-600">{new Date().toLocaleDateString()}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Custom Criteria Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Application Criteria
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {customCriteria.map((criteria, index) => (
            <div key={criteria.id} className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Label className="text-base font-medium text-gray-900">
                    {index + 1}. {criteria.title}
                    {criteria.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">{criteria.description}</p>
                  {criteria.helpText && <p className="text-xs text-gray-500 mt-1 italic">💡 {criteria.helpText}</p>}
                </div>
                {getResponse(criteria.id) && <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />}
              </div>
              <div className="ml-4">{renderCriteriaInput(criteria)}</div>
              {index < customCriteria.length - 1 && <Separator className="mt-6" />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Form Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{responses.length}</span> of{" "}
              <span className="font-medium">{customCriteria.length}</span> criteria completed
              <br />
              <span className="font-medium">
                {customCriteria.filter((c) => c.required && getResponse(c.id)).length}
              </span>{" "}
              of <span className="font-medium">{customCriteria.filter((c) => c.required).length}</span> required
              criteria completed
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => handleSubmit(true)}
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSubmitting && isDraft ? "Saving..." : "Save Draft"}
              </Button>
              <Button
                onClick={() => handleSubmit(false)}
                disabled={!isFormValid() || isSubmitting}
                className="bg-[#0a3141] hover:bg-[#0a3141]/90 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {isSubmitting && !isDraft ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
