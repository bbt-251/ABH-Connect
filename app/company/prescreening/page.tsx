"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, Trash2, Eye, Calendar, BarChart3, FileText, MessageSquare } from "lucide-react"
import ShortAnswerManager from "@/components/short-answer-manager"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function ApplicantEvaluationPage() {
  const [activeTab, setActiveTab] = useState("screening")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showMultipleChoiceManager, setShowMultipleChoiceManager] = useState(false)
  const [showShortAnswerManager, setShowShortAnswerManager] = useState(false)

  const [showCreateCriteriaSetModal, setShowCreateCriteriaSetModal] = useState(false)
  const [showCustomCriteriaModal, setShowCustomCriteriaModal] = useState(false)
  const [criteriaSetName, setCriteriaSetName] = useState("")
  const [selectedCriteria, setSelectedCriteria] = useState<any[]>([])
  const [customCriteriaName, setCustomCriteriaName] = useState("")
  const [customCriteriaType, setCustomCriteriaType] = useState("")
  const [customCriteriaOptions, setCustomCriteriaOptions] = useState("")

  const defaultCriteria = [
    { id: "gender", name: "Gender", type: "select", options: ["Male", "Female", "Any"] },
    {
      id: "education_level",
      name: "Level of Education",
      type: "select",
      options: ["High School", "Bachelor's Degree", "Master's Degree", "PhD"],
    },
    { id: "years_experience", name: "Years of Experience", type: "number", unit: "years" },
    { id: "age", name: "Age", type: "number", unit: "years" },
    { id: "matching_score", name: "Matching Score", type: "number", unit: "%" },
    { id: "screening_score", name: "Screening Score", type: "number", unit: "%" },
  ]

  const customCriteria = [
    { id: "remote_work", name: "Remote Work Preference", type: "select", options: ["Yes", "No", "Hybrid"] },
    {
      id: "time_zone",
      name: "Time Zone",
      type: "select",
      options: ["UTC-8 to UTC-5", "UTC-5 to UTC+0", "UTC+0 to UTC+5", "UTC+5 to UTC+8"],
    },
    { id: "salary_range", name: "Expected Salary Range", type: "number", unit: "USD" },
  ]

  const allCriteria = [...defaultCriteria, ...customCriteria]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Applicant Evaluation</h1>
        <p className="text-gray-600">Manage screening questions, criteria, exams, and evaluation processes</p>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="screening">Screening Questions</TabsTrigger>
          <TabsTrigger value="matching">Matching Criteria</TabsTrigger>
          <TabsTrigger value="exam">Exam Management</TabsTrigger>
          <TabsTrigger value="metrics">Evaluation Metrics</TabsTrigger>
          <TabsTrigger value="interview">Interview Management</TabsTrigger>
        </TabsList>

        {/* Screening Questions Tab */}
        <TabsContent value="screening" className="mt-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Screening Questions</h2>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowShortAnswerManager(true)}>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Short Answers
                </Button>
                <Button variant="outline" onClick={() => setShowMultipleChoiceManager(true)}>
                  <FileText className="w-4 h-4 mr-2" />
                  Multiple Choice
                </Button>
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Screening Question Sets */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Screening Question Sets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input placeholder="Search screening sets..." className="pl-10" />
                        </div>
                        <Select defaultValue="all">
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Filter by status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Sets</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <div className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">Software Engineer Technical Screening</h4>
                              <p className="text-sm text-gray-600 mt-1">
                                Comprehensive screening for software engineering positions including technical skills
                                and experience
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-green-600">
                                Active
                              </Badge>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                            <div>
                              <span className="text-gray-500">Multiple Choice Sets:</span>
                              <span className="ml-2 font-medium">2 sets (Technical Skills, Work Environment)</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Short Answer Questions:</span>
                              <span className="ml-2 font-medium">
                                3 questions (Problem Solving, Leadership, Technical)
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Est. Time:</span>
                              <span className="ml-2 font-medium">15 minutes</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Used in Jobs:</span>
                              <span className="ml-2 font-medium">12 active positions</span>
                            </div>
                          </div>
                          <div className="flex gap-2 text-xs">
                            <Badge variant="secondary">Technical Skills Assessment</Badge>
                            <Badge variant="secondary">Work Environment Preferences</Badge>
                            <Badge variant="secondary">Problem Solving Approach</Badge>
                            <Badge variant="secondary">+2 more</Badge>
                          </div>
                        </div>

                        <div className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">Product Designer Portfolio Review</h4>
                              <p className="text-sm text-gray-600 mt-1">
                                Design-focused screening questions covering portfolio, tools, and design process
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-green-600">
                                Active
                              </Badge>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                            <div>
                              <span className="text-gray-500">Multiple Choice Sets:</span>
                              <span className="ml-2 font-medium">1 set (Communication Skills)</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Short Answer Questions:</span>
                              <span className="ml-2 font-medium">2 questions (Career Motivation, Leadership)</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Est. Time:</span>
                              <span className="ml-2 font-medium">12 minutes</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Used in Jobs:</span>
                              <span className="ml-2 font-medium">5 active positions</span>
                            </div>
                          </div>
                          <div className="flex gap-2 text-xs">
                            <Badge variant="secondary">Communication Skills</Badge>
                            <Badge variant="secondary">Career Motivation</Badge>
                            <Badge variant="secondary">Leadership Experience</Badge>
                          </div>
                        </div>

                        <div className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">Marketing Manager Experience Check</h4>
                              <p className="text-sm text-gray-600 mt-1">
                                Marketing-specific questions about campaigns, tools, and strategic thinking
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-yellow-600">
                                Draft
                              </Badge>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                            <div>
                              <span className="text-gray-500">Multiple Choice Sets:</span>
                              <span className="ml-2 font-medium">2 sets (Technical Skills, Project Management)</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Short Answer Questions:</span>
                              <span className="ml-2 font-medium">1 question (Problem Solving)</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Est. Time:</span>
                              <span className="ml-2 font-medium">18 minutes</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Status:</span>
                              <span className="ml-2 font-medium">In development</span>
                            </div>
                          </div>
                          <div className="flex gap-2 text-xs">
                            <Badge variant="secondary">Technical Skills Assessment</Badge>
                            <Badge variant="secondary">Project Management Experience</Badge>
                            <Badge variant="secondary">Problem Solving Approach</Badge>
                          </div>
                        </div>

                        <div className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">General Availability & Culture Fit</h4>
                              <p className="text-sm text-gray-600 mt-1">
                                Basic screening for availability, work preferences, and cultural alignment
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-green-600">
                                Active
                              </Badge>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                            <div>
                              <span className="text-gray-500">Multiple Choice Sets:</span>
                              <span className="ml-2 font-medium">1 set (Work Environment Preferences)</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Short Answer Questions:</span>
                              <span className="ml-2 font-medium">0 questions</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Est. Time:</span>
                              <span className="ml-2 font-medium">8 minutes</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Used in Jobs:</span>
                              <span className="ml-2 font-medium">All positions</span>
                            </div>
                          </div>
                          <div className="flex gap-2 text-xs">
                            <Badge variant="secondary">Work Environment Preferences</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Stats */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Screening Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">12</div>
                        <div className="text-sm text-gray-500">Total Screening Sets</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">9</div>
                        <div className="text-sm text-gray-500">Active Sets</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">91%</div>
                        <div className="text-sm text-gray-500">Avg Completion Rate</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Question Types</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Multiple Choice</span>
                        <Badge variant="outline">47</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Short Answer</span>
                        <Badge variant="outline">23</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Yes/No</span>
                        <Badge variant="outline">15</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Rating Scale</span>
                        <Badge variant="outline">8</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="text-sm">
                          <span className="font-medium">Software Engineer Set</span>
                          <br />
                          <span className="text-gray-500">Updated 2 hours ago</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="text-sm">
                          <span className="font-medium">Marketing Manager Set</span>
                          <br />
                          <span className="text-gray-500">Created yesterday</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <div className="text-sm">
                          <span className="font-medium">Designer Portfolio Set</span>
                          <br />
                          <span className="text-gray-500">Assigned to 2 jobs</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Matching Criteria Tab */}
        <TabsContent value="matching" className="mt-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Matching Criteria</h2>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowCustomCriteriaModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Define Custom Criteria
                </Button>
                <Button onClick={() => setShowCreateCriteriaSetModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create a set of criteria
                </Button>
              </div>
            </div>

            {/* Criteria Sets List */}
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900">Senior Developer Requirements</h3>
                    <p className="text-sm text-gray-600">5 criteria • Last updated 2 days ago</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="text-gray-600">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                      Delete
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                    Education: Bachelor's+
                  </Badge>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                    Experience: 5+ years
                  </Badge>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                    Matching Score: ≥80%
                  </Badge>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                    Age: 25-45
                  </Badge>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                    Gender: Any
                  </Badge>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900">Entry Level Filter</h3>
                    <p className="text-sm text-gray-600">3 criteria • Last updated 1 week ago</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="text-gray-600">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                      Delete
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                    Education: Bachelor's
                  </Badge>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                    Experience: 0-3 years
                  </Badge>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                    Screening Score: ≥70%
                  </Badge>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900">Remote Work Filter</h3>
                    <p className="text-sm text-gray-600">4 criteria • Last updated 3 days ago</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="text-gray-600">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                      Delete
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                    Remote Work: Yes
                  </Badge>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                    Time Zone: UTC-5 to UTC+2
                  </Badge>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                    Experience: 3+ years
                  </Badge>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                    Matching Score: ≥75%
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Exam Management Tab */}
        <TabsContent value="exam" className="mt-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Exam Management</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create New Exam
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Available Exams</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input placeholder="Search exams..." className="pl-10" />
                        </div>
                        <Select defaultValue="all">
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Filter by type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="technical">Technical</SelectItem>
                            <SelectItem value="coding">Coding Challenge</SelectItem>
                            <SelectItem value="design">Design Task</SelectItem>
                            <SelectItem value="behavioral">Behavioral</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <div className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-medium text-gray-900">React & Node.js Technical Assessment</h4>
                              <p className="text-sm text-gray-600">
                                Comprehensive technical evaluation for fullstack developers
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Badge variant="outline">Technical</Badge>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Duration:</span>
                              <span className="ml-2 font-medium">2 hours</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Questions:</span>
                              <span className="ml-2 font-medium">25</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Difficulty:</span>
                              <span className="ml-2 font-medium">Intermediate</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Assigned:</span>
                              <span className="ml-2 font-medium">12 times</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-medium text-gray-900">Algorithm Design Challenge</h4>
                              <p className="text-sm text-gray-600">
                                Coding challenge focusing on algorithm design and optimization
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Badge variant="outline">Coding</Badge>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Duration:</span>
                              <span className="ml-2 font-medium">3 hours</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Problems:</span>
                              <span className="ml-2 font-medium">3</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Difficulty:</span>
                              <span className="ml-2 font-medium">Advanced</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Assigned:</span>
                              <span className="ml-2 font-medium">8 times</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-medium text-gray-900">UI/UX Design Portfolio Review</h4>
                              <p className="text-sm text-gray-600">Design task for evaluating creative and UX skills</p>
                            </div>
                            <div className="flex gap-2">
                              <Badge variant="outline">Design</Badge>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Duration:</span>
                              <span className="ml-2 font-medium">4 hours</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Tasks:</span>
                              <span className="ml-2 font-medium">2</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Difficulty:</span>
                              <span className="ml-2 font-medium">Intermediate</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Assigned:</span>
                              <span className="ml-2 font-medium">5 times</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Exam Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">15</div>
                        <div className="text-sm text-gray-500">Total Exams</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">8</div>
                        <div className="text-sm text-gray-500">Active Exams</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">76%</div>
                        <div className="text-sm text-gray-500">Avg Completion Rate</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="text-sm">
                          <span className="font-medium">React Assessment</span>
                          <br />
                          <span className="text-gray-500">Completed by John Doe</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="text-sm">
                          <span className="font-medium">Design Challenge</span>
                          <br />
                          <span className="text-gray-500">Started by Jane Smith</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <div className="text-sm">
                          <span className="font-medium">Algorithm Test</span>
                          <br />
                          <span className="text-gray-500">Assigned to 3 candidates</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Evaluation Metrics Tab */}
        <TabsContent value="metrics" className="mt-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Evaluation Metrics</h2>
              <Button>
                <BarChart3 className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Overall Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">89%</div>
                        <div className="text-sm text-gray-600">Avg Screening Score</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">76%</div>
                        <div className="text-sm text-gray-600">Avg Matching Score</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Technical Skills</span>
                          <span className="text-sm">85%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: "85%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Communication</span>
                          <span className="text-sm">78%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: "78%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Problem Solving</span>
                          <span className="text-sm">82%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{ width: "82%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Cultural Fit</span>
                          <span className="text-sm">71%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-orange-600 h-2 rounded-full" style={{ width: "71%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Evaluation Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">This Month</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Evaluations:</span>
                          <span className="font-medium">100</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Candidates:</span>
                          <span className="font-medium">50</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Interview Management Tab */}
        <TabsContent value="interview" className="mt-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Interview Management</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Schedule New Interview
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Interviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="relative flex-1">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input placeholder="Search interviews..." className="pl-10" />
                        </div>
                        <Select defaultValue="all">
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Filter by status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Interviews</SelectItem>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <div className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-medium text-gray-900">John Doe - Software Engineer</h4>
                              <p className="text-sm text-gray-600 mt-1">
                                Scheduled interview for software engineering position
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Badge variant="outline" className="text-blue-600">
                                Scheduled
                              </Badge>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Date:</span>
                              <span className="ml-2 font-medium">2023-10-05</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Time:</span>
                              <span className="ml-2 font-medium">10:00 AM</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Interviewer:</span>
                              <span className="ml-2 font-medium">Alice Johnson</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Status:</span>
                              <span className="ml-2 font-medium">Pending</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-medium text-gray-900">Jane Smith - Product Designer</h4>
                              <p className="text-sm text-gray-600 mt-1">
                                Scheduled interview for product design position
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Badge variant="outline" className="text-blue-600">
                                Scheduled
                              </Badge>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Date:</span>
                              <span className="ml-2 font-medium">2023-10-06</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Time:</span>
                              <span className="ml-2 font-medium">11:00 AM</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Interviewer:</span>
                              <span className="ml-2 font-medium">Bob Brown</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Status:</span>
                              <span className="ml-2 font-medium">Pending</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Interview Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">50</div>
                        <div className="text-sm text-gray-500">Total Interviews</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">30</div>
                        <div className="text-sm text-gray-500">Scheduled Interviews</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">20</div>
                        <div className="text-sm text-gray-500">Completed Interviews</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="text-sm">
                          <span className="font-medium">John Doe Interview</span>
                          <br />
                          <span className="text-gray-500">Scheduled 2 hours ago</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="text-sm">
                          <span className="font-medium">Jane Smith Interview</span>
                          <br />
                          <span className="text-gray-500">Scheduled yesterday</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      {showShortAnswerManager && (
        <ShortAnswerManager isOpen={showShortAnswerManager} onClose={() => setShowShortAnswerManager(false)} />
      )}
      {/* Create Criteria Set Modal */}
      {showCreateCriteriaSetModal && (
        <Dialog open={showCreateCriteriaSetModal} onOpenChange={setShowCreateCriteriaSetModal}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Criteria Set</DialogTitle>
              <DialogDescription>Define a set of criteria to filter and evaluate applicants</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Set Name</label>
                <Input
                  value={criteriaSetName}
                  onChange={(e) => setCriteriaSetName(e.target.value)}
                  placeholder="e.g., Senior Developer Requirements"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Select Criteria</label>
                <div className="space-y-4">
                  {allCriteria.map((criteria) => (
                    <div key={criteria.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <Checkbox
                          checked={selectedCriteria.some((c) => c.id === criteria.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedCriteria([...selectedCriteria, { ...criteria, operator: "equal", value: "" }])
                            } else {
                              setSelectedCriteria(selectedCriteria.filter((c) => c.id !== criteria.id))
                            }
                          }}
                        />
                        <span className="font-medium">{criteria.name}</span>
                      </div>

                      {selectedCriteria.some((c) => c.id === criteria.id) && (
                        <div className="ml-6 flex gap-3">
                          {criteria.type === "select" ? (
                            <Select
                              value={selectedCriteria.find((c) => c.id === criteria.id)?.value || ""}
                              onValueChange={(value) => {
                                setSelectedCriteria(
                                  selectedCriteria.map((c) => (c.id === criteria.id ? { ...c, value } : c)),
                                )
                              }}
                            >
                              <SelectTrigger className="w-48">
                                <SelectValue placeholder="Select option" />
                              </SelectTrigger>
                              <SelectContent>
                                {criteria.options?.map((option) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <>
                              <Select
                                value={selectedCriteria.find((c) => c.id === criteria.id)?.operator || "equal"}
                                onValueChange={(operator) => {
                                  setSelectedCriteria(
                                    selectedCriteria.map((c) => (c.id === criteria.id ? { ...c, operator } : c)),
                                  )
                                }}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="equal">Equal to</SelectItem>
                                  <SelectItem value="greater">Higher than</SelectItem>
                                  <SelectItem value="less">Lower than</SelectItem>
                                  <SelectItem value="between">Between</SelectItem>
                                </SelectContent>
                              </Select>
                              <Input
                                type="number"
                                placeholder={`Value in ${criteria.unit}`}
                                className="w-32"
                                value={selectedCriteria.find((c) => c.id === criteria.id)?.value || ""}
                                onChange={(e) => {
                                  setSelectedCriteria(
                                    selectedCriteria.map((c) =>
                                      c.id === criteria.id ? { ...c, value: e.target.value } : c,
                                    ),
                                  )
                                }}
                              />
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateCriteriaSetModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  console.log("Creating criteria set:", { name: criteriaSetName, criteria: selectedCriteria })
                  setShowCreateCriteriaSetModal(false)
                  setCriteriaSetName("")
                  setSelectedCriteria([])
                }}
              >
                Create Set
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Custom Criteria Modal */}
      {showCustomCriteriaModal && (
        <Dialog open={showCustomCriteriaModal} onOpenChange={setShowCustomCriteriaModal}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Define Custom Criteria</DialogTitle>
              <DialogDescription>Create custom criteria that can be used in your criteria sets</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Criteria Name</label>
                <Input
                  placeholder="e.g., Remote Work Preference"
                  value={customCriteriaName}
                  onChange={(e) => setCustomCriteriaName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Criteria Type</label>
                <Select value={customCriteriaType} onValueChange={setCustomCriteriaType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="select">Multiple Choice</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="boolean">Yes/No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Options (for Multiple Choice)</label>
                <Input
                  placeholder="Enter options separated by commas"
                  value={customCriteriaOptions}
                  onChange={(e) => setCustomCriteriaOptions(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCustomCriteriaModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  console.log("Creating custom criteria:", {
                    name: customCriteriaName,
                    type: customCriteriaType,
                    options: customCriteriaOptions,
                  })
                  setShowCustomCriteriaModal(false)
                  setCustomCriteriaName("")
                  setCustomCriteriaType("")
                  setCustomCriteriaOptions("")
                }}
              >
                Create Criteria
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
