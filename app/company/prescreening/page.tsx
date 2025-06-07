"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

const PrescreeningPage = () => {
  const [open, setOpen] = useState(false)
  const [showCreateCriteriaSetModal, setShowCreateCriteriaSetModal] = useState(false)
  const [showCustomCriteriaModal, setShowCustomCriteriaModal] = useState(false)
  const [criteriaSetName, setCriteriaSetName] = useState("")
  const [selectedCriteria, setSelectedCriteria] = useState<any[]>([])
  const [customCriteria, setCustomCriteria] = useState([
    { id: "remote_work", name: "Remote Work Preference", type: "select", options: ["Yes", "No", "Hybrid"] },
    {
      id: "time_zone",
      name: "Time Zone",
      type: "select",
      options: ["UTC-8 to UTC-5", "UTC-5 to UTC+0", "UTC+0 to UTC+5", "UTC+5 to UTC+8"],
    },
    { id: "salary_range", name: "Expected Salary Range", type: "number", unit: "USD" },
  ])

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

  const allCriteria = [...defaultCriteria, ...customCriteria]

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">Prescreening Configuration</h1>

      <Tabs defaultValue="matching" className="w-[80%]">
        <TabsList>
          <TabsTrigger value="matching">Matching Criteria</TabsTrigger>
          <TabsTrigger value="screening">Screening Questions</TabsTrigger>
          <TabsTrigger value="exam">Exam Configuration</TabsTrigger>
          <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
          <TabsTrigger value="interview">Interview Questions</TabsTrigger>
        </TabsList>
        <TabsContent value="matching">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Matching Criteria</h2>
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
                  <Badge variant="outline">Age: 25-45</Badge>
                  <Badge variant="outline">Gender: Any</Badge>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">Entry Level Filter</h4>
                    <p className="text-sm text-gray-600">3 criteria • Last updated 1 week ago</p>
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
                  <Badge variant="outline">Education: Bachelor's</Badge>
                  <Badge variant="outline">Experience: 0-3 years</Badge>
                  <Badge variant="outline">Screening Score: ≥70%</Badge>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">Remote Work Filter</h4>
                    <p className="text-sm text-gray-600">4 criteria • Last updated 3 days ago</p>
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
                  <Badge variant="outline">Remote Work: Yes</Badge>
                  <Badge variant="outline">Time Zone: UTC-5 to UTC+2</Badge>
                  <Badge variant="outline">Experience: 3+ years</Badge>
                  <Badge variant="outline">Matching Score: ≥75%</Badge>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="screening">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Screening Questions</h2>
            <p className="text-gray-600">Configure screening questions to filter candidates.</p>
          </div>
        </TabsContent>
        <TabsContent value="exam">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Exam Configuration</h2>
            <p className="text-gray-600">Configure exams to evaluate candidate skills.</p>
          </div>
        </TabsContent>
        <TabsContent value="metrics">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Key Metrics</h2>
            <p className="text-gray-600">Define key metrics to track candidate performance.</p>
          </div>
        </TabsContent>
        <TabsContent value="interview">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Interview Questions</h2>
            <p className="text-gray-600">Configure interview questions for different roles.</p>
          </div>
        </TabsContent>
      </Tabs>

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
                              {selectedCriteria.find((c) => c.id === criteria.id)?.operator === "between" && (
                                <Input
                                  type="number"
                                  placeholder={`Max ${criteria.unit}`}
                                  className="w-32"
                                  value={selectedCriteria.find((c) => c.id === criteria.id)?.maxValue || ""}
                                  onChange={(e) => {
                                    setSelectedCriteria(
                                      selectedCriteria.map((c) =>
                                        c.id === criteria.id ? { ...c, maxValue: e.target.value } : c,
                                      ),
                                    )
                                  }}
                                />
                              )}
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
                <Input placeholder="e.g., Remote Work Preference" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Criteria Type</label>
                <Select>
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
                <Input placeholder="Enter options separated by commas" />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCustomCriteriaModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  console.log("Creating custom criteria")
                  setShowCustomCriteriaModal(false)
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

export default PrescreeningPage
