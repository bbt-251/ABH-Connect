"use client"

import { useState } from "react"
import { Plus, FileText, MessageSquare } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CreateScreeningForm from "@/components/create-screening-form"
import ShortAnswerManager from "@/components/short-answer-manager"
import MultipleChoiceManager from "@/components/multiple-choice-manager"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"

export default function PrescreeningPage() {
  const [showCreateScreeningForm, setShowCreateScreeningForm] = useState(false)
  const [showShortAnswerManager, setShowShortAnswerManager] = useState(false)
  const [showMultipleChoiceManager, setShowMultipleChoiceManager] = useState(false)
  const [showCreateCriteriaSetModal, setShowCreateCriteriaSetModal] = useState(false)
  const [showCustomCriteriaModal, setShowCustomCriteriaModal] = useState(false)
  const [criteriaSetName, setCriteriaSetName] = useState("")
  const [selectedCriteria, setSelectedCriteria] = useState<any[]>([])
  const [customCriteriaName, setCustomCriteriaName] = useState("")
  const [customCriteriaType, setCustomCriteriaType] = useState("")
  const [customCriteriaOptions, setCustomCriteriaOptions] = useState("")

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Prescreening Configuration</h1>
        <p className="text-gray-500 mt-2">
          Configure prescreening questions, matching criteria, and evaluation metrics for your company's hiring process.
        </p>
      </div>

      {/* Create Screening Form Modal */}
      {showCreateScreeningForm && (
        <CreateScreeningForm isOpen={showCreateScreeningForm} onClose={() => setShowCreateScreeningForm(false)} />
      )}

      {/* Short Answer Manager Modal */}
      {showShortAnswerManager && (
        <ShortAnswerManager isOpen={showShortAnswerManager} onClose={() => setShowShortAnswerManager(false)} />
      )}

      {/* Applicant Evaluation Tabs */}
      <div className="mt-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Applicant Evaluation</h2>
            <Tabs defaultValue="screening" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="screening">Screening Questions</TabsTrigger>
                <TabsTrigger value="matching">Matching Criteria</TabsTrigger>
                <TabsTrigger value="exam">Exam Management</TabsTrigger>
                <TabsTrigger value="metrics">Evaluation Metrics</TabsTrigger>
                <TabsTrigger value="interview">Interview Management</TabsTrigger>
              </TabsList>

              <TabsContent value="screening" className="mt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-900">Screening Question Sets</h3>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => setShowCreateScreeningForm(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setShowMultipleChoiceManager(true)}>
                        <FileText className="w-4 h-4 mr-2" />
                        Multiple Choice
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setShowShortAnswerManager(true)}>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Short Answers
                      </Button>
                    </div>
                  </div>

                  {/* Screening Question Sets List */}
                  <div className="space-y-3">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">Technical Skills Assessment</h4>
                          <p className="text-sm text-gray-600">8 questions • Last updated 2 days ago</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            Delete
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">React Experience</Badge>
                        <Badge variant="outline">Node.js Knowledge</Badge>
                        <Badge variant="outline">Problem Solving</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="matching" className="mt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-900">Matching Criteria Sets</h3>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setShowCustomCriteriaModal(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Define Custom Criteria
                      </Button>
                      <Button size="sm" onClick={() => setShowCreateCriteriaSetModal(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create a set of criteria
                      </Button>
                    </div>
                  </div>

                  {/* Existing Criteria Sets */}
                  <div className="space-y-3">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">Senior Developer Requirements</h4>
                          <p className="text-sm text-gray-600">5 criteria • Last updated 2 days ago</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            Delete
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">Education: Bachelor's+</Badge>
                        <Badge variant="outline">Experience: 5+ years</Badge>
                        <Badge variant="outline">Matching Score: ≥80%</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="exam" className="mt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-900">Exam Management</h3>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Exam
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">Technical Assessment - React & Node.js</h4>
                          <p className="text-sm text-gray-600">Duration: 2 hours • 15 questions</p>
                        </div>
                        <Badge variant="outline" className="text-green-600">
                          Active
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          View Results
                        </Button>
                        <Button variant="outline" size="sm">
                          Duplicate
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="metrics" className="mt-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Evaluation Metrics</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-3">Scoring Templates</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Technical Skills</span>
                            <span className="text-sm font-medium">40%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Communication</span>
                            <span className="text-sm font-medium">30%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Culture Fit</span>
                            <span className="text-sm font-medium">30%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-3">Evaluation Standards</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Minimum Score</span>
                            <Badge variant="outline">70%</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Recommended Score</span>
                            <Badge variant="outline" className="text-green-600">
                              85%
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="interview" className="mt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-900">Interview Management</h3>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Interview Template
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">Technical Interview - Round 1</h4>
                          <p className="text-sm text-gray-600">Duration: 60 minutes • 12 questions</p>
                        </div>
                        <Badge variant="outline" className="text-blue-600">
                          Template
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          Use Template
                        </Button>
                        <Button variant="outline" size="sm">
                          Duplicate
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Multiple Choice Manager Modal */}
      {showMultipleChoiceManager && (
        <MultipleChoiceManager isOpen={showMultipleChoiceManager} onClose={() => setShowMultipleChoiceManager(false)} />
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
                  {/* Gender */}
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Checkbox />
                      <span className="font-medium">Gender</span>
                    </div>
                    <div className="ml-6">
                      <Select defaultValue="">
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="any">Any</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Level of Education */}
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Checkbox />
                      <span className="font-medium">Level of Education</span>
                    </div>
                    <div className="ml-6">
                      <Select defaultValue="">
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high-school">High School</SelectItem>
                          <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                          <SelectItem value="masters">Master's Degree</SelectItem>
                          <SelectItem value="phd">PhD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Years of Experience */}
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Checkbox />
                      <span className="font-medium">Years of Experience</span>
                    </div>
                    <div className="ml-6 flex gap-3">
                      <Select defaultValue="equal">
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
                      <Input type="number" placeholder="Value in years" className="w-32" />
                    </div>
                  </div>

                  {/* Age */}
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Checkbox />
                      <span className="font-medium">Age</span>
                    </div>
                    <div className="ml-6 flex gap-3">
                      <Select defaultValue="equal">
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
                      <Input type="number" placeholder="Value in years" className="w-32" />
                    </div>
                  </div>

                  {/* Matching Score */}
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Checkbox />
                      <span className="font-medium">Matching Score</span>
                    </div>
                  </div>

                  {/* Screening Score */}
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Checkbox />
                      <span className="font-medium">Screening Score</span>
                    </div>
                  </div>

                  {/* Remote Work Preference */}
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Checkbox />
                      <span className="font-medium">Remote Work Preference</span>
                    </div>
                  </div>

                  {/* Time Zone */}
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Checkbox />
                      <span className="font-medium">Time Zone</span>
                    </div>
                  </div>

                  {/* Expected Salary Range */}
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Checkbox />
                      <span className="font-medium">Expected Salary Range</span>
                    </div>
                  </div>
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
