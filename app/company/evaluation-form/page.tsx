"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Save, Send, User, Briefcase } from "lucide-react"

// Sample data - in real app this would come from props or API
const candidateInfo = {
  name: "John Smith",
  position: "Senior Software Engineer",
  interviewDate: "2024-01-15",
}

const evaluationMetrics = [
  {
    name: "Technical Skills",
    threshold: 4,
    weight: 40,
  },
  {
    name: "Problem Solving",
    threshold: 3,
    weight: 30,
  },
  {
    name: "Communication",
    threshold: 3,
    weight: 30,
  },
]

export default function EvaluationFormPage() {
  const [formData, setFormData] = useState({
    behaviorAssessment: "",
    technicalAssessment: "",
    generalComment: "",
    metrics: {} as Record<string, string>,
  })

  const handleMetricChange = (metricName: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        [metricName]: value,
      },
    }))
  }

  const handleTextChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSaveDraft = () => {
    console.log("Saving draft:", formData)
    // Add save draft logic here
  }

  const handleSubmit = () => {
    console.log("Submitting evaluation:", formData)
    // Add submit logic here
  }

  const getScoreLabel = (score: string) => {
    const labels = {
      "1": "Poor",
      "2": "Below Average",
      "3": "Average",
      "4": "Good",
      "5": "Excellent",
    }
    return labels[score as keyof typeof labels] || ""
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-gray-500" />
              <span className="text-lg font-medium text-gray-900">{candidateInfo.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-gray-500" />
              <span className="text-lg font-medium text-gray-900">{candidateInfo.position}</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Evaluation Form for {candidateInfo.name} regarding the position {candidateInfo.position}
          </h1>
          <p className="text-gray-600 mt-2">Interview Date: {candidateInfo.interviewDate}</p>
        </div>

        <form className="space-y-8">
          {/* Behavior Assessment Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Behavior Assessment Section</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Evaluate the candidate's behavior, attitude, and interpersonal skills during the interview..."
                value={formData.behaviorAssessment}
                onChange={(e) => handleTextChange("behaviorAssessment", e.target.value)}
                className="min-h-[150px] resize-none"
              />
              <p className="text-sm text-gray-500 mt-2">{formData.behaviorAssessment.length}/1000 characters</p>
            </CardContent>
          </Card>

          {/* Technical Assessment Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Technical Assessment Section</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Assess the candidate's technical competencies, knowledge, and problem-solving approach..."
                value={formData.technicalAssessment}
                onChange={(e) => handleTextChange("technicalAssessment", e.target.value)}
                className="min-h-[150px] resize-none"
              />
              <p className="text-sm text-gray-500 mt-2">{formData.technicalAssessment.length}/1000 characters</p>
            </CardContent>
          </Card>

          {/* Evaluation Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Evaluation Metrics</CardTitle>
              <p className="text-gray-600">Rate each metric on a scale of 1-5 based on the candidate's performance</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {evaluationMetrics.map((metric, index) => (
                <div key={metric.name} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{metric.name}</h3>
                      <p className="text-sm text-gray-600">
                        Threshold: {metric.threshold}/5 • Weight: {metric.weight}%
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {formData.metrics[metric.name] && (
                        <span className="font-medium">
                          Selected: {formData.metrics[metric.name]}/5 - {getScoreLabel(formData.metrics[metric.name])}
                        </span>
                      )}
                    </div>
                  </div>

                  <RadioGroup
                    value={formData.metrics[metric.name] || ""}
                    onValueChange={(value) => handleMetricChange(metric.name, value)}
                    className="flex gap-8"
                  >
                    {[1, 2, 3, 4, 5].map((score) => (
                      <div key={score} className="flex items-center space-x-2">
                        <RadioGroupItem value={score.toString()} id={`${metric.name}-${score}`} />
                        <Label htmlFor={`${metric.name}-${score}`} className="cursor-pointer font-medium">
                          {score}
                        </Label>
                        <span className="text-xs text-gray-500">{getScoreLabel(score.toString())}</span>
                      </div>
                    ))}
                  </RadioGroup>

                  {index < evaluationMetrics.length - 1 && <Separator className="mt-6" />}
                </div>
              ))}

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-700">
                  Total Weight: {evaluationMetrics.reduce((sum, metric) => sum + metric.weight, 0)}%
                </p>
              </div>
            </CardContent>
          </Card>

          {/* General Comment */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">General Comment</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Provide overall feedback, recommendations, and any additional observations about the candidate..."
                value={formData.generalComment}
                onChange={(e) => handleTextChange("generalComment", e.target.value)}
                className="min-h-[150px] resize-none"
              />
              <p className="text-sm text-gray-500 mt-2">{formData.generalComment.length}/1000 characters</p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end pt-6 border-t">
            <Button type="button" variant="outline" onClick={handleSaveDraft} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Draft
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-2 bg-[#0a3141] hover:bg-[#0a3141]/90"
            >
              <Send className="h-4 w-4" />
              Submit Evaluation
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
