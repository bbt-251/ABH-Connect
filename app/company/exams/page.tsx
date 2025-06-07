"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, X } from "lucide-react"

interface ExternalExam {
  id: string
  type: string
  name: string
  weight: number
}

interface Exam {
  id: string
  name: string
  passingScore: number
  externalExams: ExternalExam[]
  createdAt: string
  status: "active" | "draft" | "inactive"
}

const examTypes = [
  "TestGorilla - Cognitive Ability",
  "TestGorilla - Programming",
  "TestGorilla - Language Skills",
  "Vervoe - Technical Assessment",
  "Vervoe - Soft Skills",
  "Vervoe - Customer Service",
  "Custom Assessment",
]

export default function ExamManagementPage() {
  const [exams, setExams] = useState<Exam[]>([
    {
      id: "1",
      name: "Senior Developer Assessment",
      passingScore: 75,
      externalExams: [
        { id: "1", type: "TestGorilla - Programming", name: "JavaScript Advanced", weight: 40 },
        { id: "2", type: "TestGorilla - Cognitive Ability", name: "Problem Solving", weight: 30 },
        { id: "3", type: "Vervoe - Technical Assessment", name: "System Design", weight: 30 },
      ],
      createdAt: "2024-01-15",
      status: "active",
    },
    {
      id: "2",
      name: "Marketing Specialist Evaluation",
      passingScore: 70,
      externalExams: [
        { id: "4", type: "Vervoe - Soft Skills", name: "Communication Skills", weight: 50 },
        { id: "5", type: "TestGorilla - Language Skills", name: "English Proficiency", weight: 50 },
      ],
      createdAt: "2024-01-10",
      status: "active",
    },
  ])

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingExam, setEditingExam] = useState<Exam | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    passingScore: "",
    status: "active" as "active" | "inactive",
    externalExams: [{ id: Date.now().toString(), type: "", name: "", weight: 0 }],
  })

  const handleCreateExam = () => {
    setFormData({
      name: "",
      passingScore: "",
      status: "active",
      externalExams: [{ id: Date.now().toString(), type: "", name: "", weight: 0 }],
    })
    setEditingExam(null)
    setIsCreateModalOpen(true)
  }

  const handleEditExam = (exam: Exam) => {
    setFormData({
      name: exam.name,
      passingScore: exam.passingScore.toString(),
      status: exam.status,
      externalExams: exam.externalExams,
    })
    setEditingExam(exam)
    setIsCreateModalOpen(true)
  }

  const handleDeleteExam = (examId: string) => {
    setExams(exams.filter((exam) => exam.id !== examId))
  }

  const handleAddExternalExam = () => {
    setFormData({
      ...formData,
      externalExams: [...formData.externalExams, { id: Date.now().toString(), type: "", name: "", weight: 0 }],
    })
  }

  const handleRemoveExternalExam = (examId: string) => {
    setFormData({
      ...formData,
      externalExams: formData.externalExams.filter((exam) => exam.id !== examId),
    })
  }

  const handleExternalExamChange = (examId: string, field: string, value: string | number) => {
    setFormData({
      ...formData,
      externalExams: formData.externalExams.map((exam) => (exam.id === examId ? { ...exam, [field]: value } : exam)),
    })
  }

  const handleSubmit = () => {
    const newExam: Exam = {
      id: editingExam?.id || Date.now().toString(),
      name: formData.name,
      passingScore: Number.parseInt(formData.passingScore),
      status: formData.status,
      externalExams: formData.externalExams.filter((exam) => exam.type && exam.name),
      createdAt: editingExam?.createdAt || new Date().toISOString().split("T")[0],
    }

    if (editingExam) {
      setExams(exams.map((exam) => (exam.id === editingExam.id ? newExam : exam)))
    } else {
      setExams([...exams, newExam])
    }

    setIsCreateModalOpen(false)
    setFormData({
      name: "",
      passingScore: "",
      status: "active",
      externalExams: [{ id: Date.now().toString(), type: "", name: "", weight: 0 }],
    })
  }

  const getTotalWeight = () => {
    return formData.externalExams.reduce((total, exam) => total + (exam.weight || 0), 0)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Exam Management</h1>
          <p className="text-gray-600">Create and manage assessment exams from external platforms</p>
        </div>
        <Button onClick={handleCreateExam}>
          <Plus className="w-4 h-4 mr-2" />
          Create Exam
        </Button>
      </div>

      {/* Exams List */}
      <div className="grid gap-4">
        {exams.map((exam) => (
          <Card key={exam.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{exam.name}</CardTitle>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant={exam.status === "active" ? "default" : "secondary"}>{exam.status}</Badge>
                    <span className="text-sm text-gray-600">Passing Score: {exam.passingScore}%</span>
                    <span className="text-sm text-gray-600">Created: {exam.createdAt}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditExam(exam)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteExam(exam.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">External Assessments ({exam.externalExams.length})</h4>
                <div className="grid gap-2">
                  {exam.externalExams.map((extExam) => (
                    <div key={extExam.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-sm">{extExam.name}</div>
                        <div className="text-xs text-gray-600">{extExam.type}</div>
                      </div>
                      <Badge variant="outline">{extExam.weight}% weight</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create/Edit Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingExam ? "Edit Exam" : "Create New Exam"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Senior Developer Assessment"
                />
              </div>

              <div>
                <Label htmlFor="passingScore">Exam Acceptance Rate *</Label>
                <Input
                  id="passingScore"
                  type="number"
                  value={formData.passingScore}
                  onChange={(e) => setFormData({ ...formData, passingScore: e.target.value })}
                  placeholder="e.g., 75"
                  min="0"
                  max="100"
                />
              </div>

              <div>
                <Label>Status</Label>
                <div className="flex gap-2 mt-2">
                  <Button
                    type="button"
                    variant={formData.status === "active" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFormData({ ...formData, status: "active" })}
                  >
                    Active
                  </Button>
                  <Button
                    type="button"
                    variant={formData.status === "inactive" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFormData({ ...formData, status: "inactive" })}
                  >
                    Inactive
                  </Button>
                </div>
              </div>
            </div>

            {/* List of Exams */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>List of Exams</Label>
                <div className="text-sm text-gray-600">
                  Total Weight: {getTotalWeight()}%
                  {getTotalWeight() !== 100 && <span className="text-red-500 ml-2">(Should equal 100%)</span>}
                </div>
              </div>

              <div className="space-y-3">
                {formData.externalExams.map((exam, index) => (
                  <div key={exam.id} className="flex gap-3 items-start p-4 border rounded-lg">
                    <div className="flex-1 grid grid-cols-3 gap-3">
                      <div>
                        <Select
                          value={exam.type}
                          onValueChange={(value) => handleExternalExamChange(exam.id, "type", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Exam Type" />
                          </SelectTrigger>
                          <SelectContent>
                            {examTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <Input
                        value={exam.name}
                        onChange={(e) => handleExternalExamChange(exam.id, "name", e.target.value)}
                        placeholder="Exam Name"
                      />

                      <Input
                        type="number"
                        value={exam.weight}
                        onChange={(e) =>
                          handleExternalExamChange(exam.id, "weight", Number.parseInt(e.target.value) || 0)
                        }
                        placeholder="Exam Weight"
                        min="0"
                        max="100"
                      />
                    </div>

                    {formData.externalExams.length > 1 && (
                      <Button variant="outline" size="sm" onClick={() => handleRemoveExternalExam(exam.id)}>
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <Button variant="outline" onClick={handleAddExternalExam} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!formData.name || !formData.passingScore || getTotalWeight() !== 100}
              >
                {editingExam ? "Update" : "Submit"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
