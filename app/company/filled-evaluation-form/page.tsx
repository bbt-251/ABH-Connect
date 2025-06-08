"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Briefcase, Calendar, CheckCircle, Star } from "lucide-react"

// Sample filled evaluation data
const evaluationData = {
  candidate: {
    name: "Sarah Johnson",
    position: "Senior Software Engineer",
    interviewDate: "2024-01-15",
    evaluator: "Dr. Michael Chen",
    evaluatorRole: "Technical Lead",
    submissionDate: "2024-01-15",
    status: "Completed",
  },
  behaviorAssessment: `Sarah demonstrated excellent communication skills throughout the interview. She was articulate, confident, and showed strong leadership potential. Her responses were well-structured and she actively engaged with the interview panel. She displayed good emotional intelligence and showed enthusiasm for collaborative work environments. Her professional demeanor and positive attitude were particularly noteworthy.`,

  technicalAssessment: `Sarah showcased strong technical expertise in software development. She successfully solved the coding challenges presented and demonstrated deep understanding of system design principles. Her approach to problem-solving was methodical and efficient. She showed proficiency in multiple programming languages and frameworks. Her knowledge of best practices in software engineering, including testing and code review processes, was impressive. She also demonstrated good understanding of scalable architecture patterns.`,

  metrics: {
    "Technical Skills": {
      score: 5,
      threshold: 4,
      weight: 40,
      passed: true,
    },
    "Problem Solving": {
      score: 4,
      threshold: 3,
      weight: 30,
      passed: true,
    },
    Communication: {
      score: 5,
      threshold: 3,
      weight: 30,
      passed: true,
    },
  },

  generalComment: `Sarah is an exceptional candidate who exceeded expectations in all evaluation areas. Her technical skills are outstanding, and she demonstrates the leadership qualities we're looking for in a senior role. She would be a valuable addition to our team and I strongly recommend moving forward with an offer. Her experience aligns perfectly with our project requirements, and her collaborative approach would enhance our team dynamics.`,

  overallScore: 4.7,
  recommendation: "Strongly Recommend",
}

export default function FilledEvaluationFormPage() {
  const getScoreLabel = (score: number) => {
    const labels = {
      1: "Poor",
      2: "Below Average",
      3: "Average",
      4: "Good",
      5: "Excellent",
    }
    return labels[score as keyof typeof labels] || ""
  }

  const renderStars = (score: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= score ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    )
  }

  const totalWeight = Object.values(evaluationData.metrics).reduce((sum, metric) => sum + metric.weight, 0)
  const passedMetrics = Object.values(evaluationData.metrics).filter((metric) => metric.passed).length
  const totalMetrics = Object.values(evaluationData.metrics).length

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-gray-500" />
                <span className="text-lg font-medium text-gray-900">{evaluationData.candidate.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-gray-500" />
                <span className="text-lg font-medium text-gray-900">{evaluationData.candidate.position}</span>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              {evaluationData.candidate.status}
            </Badge>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Evaluation Form for {evaluationData.candidate.name} regarding the position{" "}
            {evaluationData.candidate.position}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Interview: {evaluationData.candidate.interviewDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Evaluator: {evaluationData.candidate.evaluator}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span>Submitted: {evaluationData.candidate.submissionDate}</span>
            </div>
          </div>
        </div>

        {/* Overall Summary */}
        <Card className="mb-8 border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Evaluation Summary</span>
              <Badge className="bg-green-100 text-green-800 text-lg px-3 py-1">{evaluationData.recommendation}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">{evaluationData.overallScore}/5</div>
                <div className="text-sm text-gray-600">Overall Score</div>
                <div className="flex justify-center mt-2">{renderStars(evaluationData.overallScore)}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {passedMetrics}/{totalMetrics}
                </div>
                <div className="text-sm text-gray-600">Metrics Passed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">{totalWeight}%</div>
                <div className="text-sm text-gray-600">Total Weight</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          {/* Behavior Assessment Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Behavior Assessment Section</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{evaluationData.behaviorAssessment}</p>
              </div>
              <p className="text-sm text-gray-500 mt-2">{evaluationData.behaviorAssessment.length} characters</p>
            </CardContent>
          </Card>

          {/* Technical Assessment Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Technical Assessment Section</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {evaluationData.technicalAssessment}
                </p>
              </div>
              <p className="text-sm text-gray-500 mt-2">{evaluationData.technicalAssessment.length} characters</p>
            </CardContent>
          </Card>

          {/* Evaluation Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Evaluation Metrics</CardTitle>
              <p className="text-gray-600">Completed evaluation scores for each metric</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(evaluationData.metrics).map(([metricName, metric], index) => (
                <div key={metricName} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{metricName}</h3>
                      <p className="text-sm text-gray-600">
                        Threshold: {metric.threshold}/5 • Weight: {metric.weight}%
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={metric.passed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                          {metric.passed ? "Passed" : "Failed"}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500">
                        Score: {metric.score}/5 - {getScoreLabel(metric.score)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-gray-900">{metric.score}</span>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          {renderStars(metric.score)}
                          <span className="text-sm font-medium">{getScoreLabel(metric.score)}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Required: {metric.threshold}/5 or higher</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${metric.passed ? "text-green-600" : "text-red-600"}`}>
                        {metric.score >= metric.threshold ? "✓" : "✗"}
                      </div>
                    </div>
                  </div>

                  {index < Object.entries(evaluationData.metrics).length - 1 && <Separator className="mt-6" />}
                </div>
              ))}

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-blue-700">
                    Total Weight: {totalWeight}% • Metrics Passed: {passedMetrics}/{totalMetrics}
                  </p>
                  <Badge className="bg-blue-100 text-blue-800">Overall: {evaluationData.overallScore}/5</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* General Comment */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">General Comment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{evaluationData.generalComment}</p>
              </div>
              <p className="text-sm text-gray-500 mt-2">{evaluationData.generalComment.length} characters</p>
            </CardContent>
          </Card>

          {/* Evaluator Information */}
          <Card className="border-t-4 border-t-blue-500">
            <CardHeader>
              <CardTitle className="text-xl">Evaluator Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Evaluator Name</p>
                  <p className="font-medium">{evaluationData.candidate.evaluator}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Role</p>
                  <p className="font-medium">{evaluationData.candidate.evaluatorRole}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Submission Date</p>
                  <p className="font-medium">{evaluationData.candidate.submissionDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {evaluationData.candidate.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
