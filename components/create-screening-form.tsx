"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Plus, Trash2, Settings, X } from "lucide-react"

interface Question {
  id: string
  type: "short-answer" | "multiple-choice"
  questionId: string
  title: string
  weight: number
  gradingSeverity?: number
}

interface CreateScreeningFormProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreateScreeningForm({ isOpen, onClose }: CreateScreeningFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    active: true,
    passingScore: 70,
    timerOption: false,
    timer: 30,
  })

  const [questions, setQuestions] = useState<Question[]>([])

  const [predefinedShortAnswers] = useState([
    {
      id: "sa1",
      title: "Describe your experience with project management",
      description: "Open-ended question about PM experience",
    },
    { id: "sa2", title: "What motivates you in your career?", description: "Personal motivation assessment" },
    { id: "sa3", title: "Describe a challenging situation you overcame", description: "Problem-solving evaluation" },
    { id: "sa4", title: "What are your long-term career goals?", description: "Career planning assessment" },
  ])

  const [predefinedMultipleChoice] = useState([
    {
      id: "mc1",
      title: "Years of experience in the field",
      description: "Experience level assessment",
      options: ["0-1 years", "2-3 years", "4-5 years", "5+ years"],
    },
    {
      id: "mc2",
      title: "Preferred work environment",
      description: "Work style preference",
      options: ["Remote", "Hybrid", "On-site", "Flexible"],
    },
    {
      id: "mc3",
      title: "Technical proficiency level",
      description: "Self-assessment of technical skills",
      options: ["Beginner", "Intermediate", "Advanced", "Expert"],
    },
    {
      id: "mc4",
      title: "Team size preference",
      description: "Preferred team size",
      options: ["Solo work", "Small team (2-5)", "Medium team (6-10)", "Large team (10+)"],
    },
  ])

  const [showQuestionSelector, setShowQuestionSelector] = useState(false)
  const [selectorType, setSelectorType] = useState<"short-answer" | "multiple-choice" | null>(null)
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([])

  const [showGradeTuner, setShowGradeTuner] = useState(false)
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null)
  const [gradingSeverity, setGradingSeverity] = useState([50])

  const [showMultipleChoiceManager, setShowMultipleChoiceManager] = useState(false)
  const [showCreateMultipleChoice, setShowCreateMultipleChoice] = useState(false)
  const [showAIGenerator, setShowAIGenerator] = useState(false)
  const [multipleChoiceSets, setMultipleChoiceSets] = useState([
    {
      id: "mc-set-1",
      name: "Technical Skills Assessment",
      active: true,
      questions: [
        {
          id: "q1",
          question: "What is the primary purpose of version control?",
          choices: ["Track changes", "Backup files", "Share code", "Debug code"],
          correctAnswer: 0,
        },
        {
          id: "q2",
          question: "Which programming paradigm focuses on objects?",
          choices: ["Functional", "Object-Oriented", "Procedural", "Logic"],
          correctAnswer: 1,
        },
      ],
    },
    {
      id: "mc-set-2",
      name: "Communication Skills",
      active: true,
      questions: [
        {
          id: "q3",
          question: "What is the most effective way to handle conflict?",
          choices: ["Avoid it", "Confront aggressively", "Listen and collaborate", "Delegate to others"],
          correctAnswer: 2,
        },
      ],
    },
  ])
  const [currentMultipleChoice, setCurrentMultipleChoice] = useState({
    name: "",
    active: true,
    questions: [],
  })
  const [aiGenerationForm, setAiGenerationForm] = useState({
    numberOfQuestions: "",
    numberOfChoices: "",
    knowledgeArea: "",
    complexityLevel: "",
  })

  const [selectedMultipleChoiceSets, setSelectedMultipleChoiceSets] = useState<string[]>([])

  const openQuestionSelector = (type: "short-answer" | "multiple-choice") => {
    if (type === "multiple-choice") {
      setShowMultipleChoiceManager(true)
    } else {
      setSelectorType(type)
      setSelectedQuestions([])
      setShowQuestionSelector(true)
    }
  }

  const openCreateMultipleChoice = () => {
    setCurrentMultipleChoice({ name: "", active: true, questions: [] })
    setShowCreateMultipleChoice(true)
  }

  const addQuestionToSet = () => {
    const newQuestion = {
      id: Math.random().toString(36).substr(2, 9),
      question: "",
      choices: ["", "", "", ""],
      correctAnswer: 0,
    }
    setCurrentMultipleChoice((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }))
  }

  const removeQuestionFromSet = (questionId: string) => {
    setCurrentMultipleChoice((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== questionId),
    }))
  }

  const updateQuestion = (questionId: string, field: string, value: any) => {
    setCurrentMultipleChoice((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => (q.id === questionId ? { ...q, [field]: value } : q)),
    }))
  }

  const updateChoice = (questionId: string, choiceIndex: number, value: string) => {
    setCurrentMultipleChoice((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId ? { ...q, choices: q.choices.map((c, i) => (i === choiceIndex ? value : c)) } : q,
      ),
    }))
  }

  const saveMultipleChoiceSet = () => {
    if (currentMultipleChoice.name.trim()) {
      const newSet = {
        ...currentMultipleChoice,
        id: Math.random().toString(36).substr(2, 9),
      }
      setMultipleChoiceSets((prev) => [...prev, newSet])
      setShowCreateMultipleChoice(false)
    }
  }

  const selectMultipleChoiceSet = (setId: string) => {
    const selectedSet = multipleChoiceSets.find((set) => set.id === setId)
    if (selectedSet) {
      const newQuestion: Question = {
        id: Math.random().toString(36).substr(2, 9),
        type: "multiple-choice",
        questionId: setId,
        title: selectedSet.name,
        weight: 10,
      }
      setQuestions([...questions, newQuestion])
      setShowMultipleChoiceManager(false)
    }
  }

  const generateWithAI = () => {
    // Simulate AI generation
    console.log("Generating with AI:", aiGenerationForm)
    // Here you would typically call an AI service
    setShowAIGenerator(false)
  }

  const handleSubmit = () => {
    // Handle form submission here
    console.log("Form Data:", formData)
    console.log("Questions:", questions)
    onClose()
  }

  const totalWeight = questions.reduce((sum, q) => sum + q.weight, 0)

  const removeQuestion = (questionId: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== questionId))
  }

  const updateQuestionWeight = (questionId: string, weight: number) => {
    setQuestions((prev) => prev.map((q) => (q.id === questionId ? { ...q, weight } : q)))
  }

  const openGradeTuner = (questionId: string) => {
    setSelectedQuestionId(questionId)
    setShowGradeTuner(true)
  }

  const saveGradingSeverity = () => {
    if (selectedQuestionId) {
      setQuestions((prev) =>
        prev.map((q) => (q.id === selectedQuestionId ? { ...q, gradingSeverity: gradingSeverity[0] } : q)),
      )
    }
    setShowGradeTuner(false)
  }

  const toggleQuestionSelection = (questionId: string) => {
    setSelectedQuestions((prev) => {
      if (prev.includes(questionId)) {
        return prev.filter((id) => id !== questionId)
      } else {
        return [...prev, questionId]
      }
    })
  }

  const addSelectedQuestions = () => {
    if (selectorType === "short-answer") {
      const newQuestions = predefinedShortAnswers
        .filter((sa) => selectedQuestions.includes(sa.id))
        .map((sa) => ({
          id: Math.random().toString(36).substr(2, 9),
          type: "short-answer",
          questionId: sa.id,
          title: sa.title,
          weight: 10,
        }))
      setQuestions((prev) => [...prev, ...newQuestions])
    } else if (selectorType === "multiple-choice") {
      const newQuestions = predefinedMultipleChoice
        .filter((mc) => selectedQuestions.includes(mc.id))
        .map((mc) => ({
          id: Math.random().toString(36).substr(2, 9),
          type: "multiple-choice",
          questionId: mc.id,
          title: mc.title,
          weight: 10,
        }))
      setQuestions((prev) => [...prev, ...newQuestions])
    }
    setShowQuestionSelector(false)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Screening Question Set</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter screening question set name"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                  />
                  <Label htmlFor="active">Active</Label>
                </div>

                <div>
                  <Label htmlFor="passingScore">Passing Score (0-100)</Label>
                  <Input
                    id="passingScore"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.passingScore}
                    onChange={(e) => setFormData({ ...formData, passingScore: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="timerOption"
                      checked={formData.timerOption}
                      onCheckedChange={(checked) => setFormData({ ...formData, timerOption: checked })}
                    />
                    <Label htmlFor="timerOption">Timer Option</Label>
                  </div>

                  {formData.timerOption && (
                    <div>
                      <Label htmlFor="timer">Timer (minutes)</Label>
                      <Input
                        id="timer"
                        type="number"
                        min="1"
                        value={formData.timer}
                        onChange={(e) => setFormData({ ...formData, timer: Number.parseInt(e.target.value) || 1 })}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Questions */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Questions</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openQuestionSelector("short-answer")}>
                      <Plus className="w-4 h-4 mr-1" />
                      Short Answer
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => openQuestionSelector("multiple-choice")}>
                      <Plus className="w-4 h-4 mr-1" />
                      Multiple Choice
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {questions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No questions added yet. Click the buttons above to add questions.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {questions.map((question, index) => (
                      <div key={question.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-medium">Question {index + 1}</span>
                              <Badge variant="outline">
                                {question.type === "short-answer" ? "Short Answer" : "Multiple Choice"}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{question.title}</p>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => removeQuestion(question.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label>Weight</Label>
                            <Input
                              type="number"
                              min="1"
                              max="100"
                              value={question.weight}
                              onChange={(e) => updateQuestionWeight(question.id, Number.parseInt(e.target.value) || 1)}
                            />
                          </div>

                          {question.type === "short-answer" && (
                            <div className="md:col-span-2">
                              <Label>Grading Severity</Label>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm text-gray-500">
                                  Current: {question.gradingSeverity || 50}%
                                </span>
                                <Button variant="outline" size="sm" onClick={() => openGradeTuner(question.id)}>
                                  <Settings className="w-4 h-4 mr-1" />
                                  Grade Tuner
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between text-sm">
                        <span>Total Weight:</span>
                        <span className={`font-medium ${totalWeight === 100 ? "text-green-600" : "text-orange-600"}`}>
                          {totalWeight}%
                        </span>
                      </div>
                      {totalWeight !== 100 && (
                        <p className="text-xs text-orange-600 mt-1">Weights should total 100% for optimal scoring</p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Create Screening Set</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Grade Tuner Modal */}
      <Dialog open={showGradeTuner} onOpenChange={setShowGradeTuner}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle>Choose Grading Severity</DialogTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowGradeTuner(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-2xl font-bold text-blue-600">{gradingSeverity[0]}%</span>
                <p className="text-sm text-gray-600">Grading Severity</p>
              </div>

              <div className="px-4">
                <Slider
                  value={gradingSeverity}
                  onValueChange={setGradingSeverity}
                  max={100}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="flex justify-between text-xs text-gray-500">
                <span>Lenient (0%)</span>
                <span>Strict (100%)</span>
              </div>
            </div>

            <div className="flex justify-center">
              <Button onClick={saveGradingSeverity} className="px-8">
                Choose
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Question Selector Modal */}
      <Dialog open={showQuestionSelector} onOpenChange={setShowQuestionSelector}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Select {selectorType === "short-answer" ? "Short Answer" : "Multiple Choice"} Question
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {selectorType === "short-answer"
              ? predefinedShortAnswers.map((question) => (
                  <div
                    key={question.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedQuestions.includes(question.id)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() => toggleQuestionSelection(question.id)}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedQuestions.includes(question.id)}
                        onChange={() => toggleQuestionSelection(question.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{question.title}</h4>
                        <p className="text-sm text-gray-600">{question.description}</p>
                      </div>
                    </div>
                  </div>
                ))
              : predefinedMultipleChoice.map((question) => (
                  <div
                    key={question.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedQuestions.includes(question.id)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() => toggleQuestionSelection(question.id)}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedQuestions.includes(question.id)}
                        onChange={() => toggleQuestionSelection(question.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{question.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{question.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {question.options.map((option, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {option}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              {selectedQuestions.length} question{selectedQuestions.length !== 1 ? "s" : ""} selected
            </span>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowQuestionSelector(false)}>
                Cancel
              </Button>
              <Button onClick={addSelectedQuestions} disabled={selectedQuestions.length === 0}>
                Add Selected ({selectedQuestions.length})
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Multiple Choice Manager Modal */}
      <Dialog open={showMultipleChoiceManager} onOpenChange={setShowMultipleChoiceManager}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Multiple Choice Management</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={openCreateMultipleChoice}>
                <Plus className="w-4 h-4 mr-1" />
                Create
              </Button>
              <Button variant="outline">Import</Button>
            </div>

            <div className="space-y-3">
              {multipleChoiceSets.map((set) => (
                <div key={set.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{set.name}</h4>
                        <Badge variant={set.active ? "default" : "secondary"}>
                          {set.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {set.questions.length} question{set.questions.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedMultipleChoiceSets.includes(set.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedMultipleChoiceSets((prev) => [...prev, set.id])
                          } else {
                            setSelectedMultipleChoiceSets((prev) => prev.filter((id) => id !== set.id))
                          }
                        }}
                        className="w-4 h-4"
                      />
                      <label className="text-sm">Select</label>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedMultipleChoiceSets.length > 0 && (
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="text-sm text-gray-600">
                  {selectedMultipleChoiceSets.length} set{selectedMultipleChoiceSets.length !== 1 ? "s" : ""} selected
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedMultipleChoiceSets([])}>
                    Clear Selection
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      selectedMultipleChoiceSets.forEach((setId) => {
                        selectMultipleChoiceSet(setId)
                      })
                      setSelectedMultipleChoiceSets([])
                    }}
                  >
                    Add Selected ({selectedMultipleChoiceSets.length})
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setShowMultipleChoiceManager(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Multiple Choice Modal */}
      <Dialog open={showCreateMultipleChoice} onOpenChange={setShowCreateMultipleChoice}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Multiple Choice Set</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={currentMultipleChoice.name}
                  onChange={(e) => setCurrentMultipleChoice((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter multiple choice set name"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={currentMultipleChoice.active}
                  onCheckedChange={(checked) => setCurrentMultipleChoice((prev) => ({ ...prev, active: checked }))}
                />
                <Label>Active</Label>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Questions</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={addQuestionToSet}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Question
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowAIGenerator(true)}>
                    Generate with AI
                  </Button>
                </div>
              </div>

              {currentMultipleChoice.questions.map((question, index) => (
                <Card key={question.id}>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <Label>Question {index + 1}</Label>
                        <Button variant="ghost" size="sm" onClick={() => removeQuestionFromSet(question.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <Input
                        value={question.question}
                        onChange={(e) => updateQuestion(question.id, "question", e.target.value)}
                        placeholder="Enter your question"
                      />

                      <div className="space-y-2">
                        <Label>Answer Choices</Label>
                        {question.choices.map((choice, choiceIndex) => (
                          <div key={choiceIndex} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`correct-${question.id}`}
                              checked={question.correctAnswer === choiceIndex}
                              onChange={() => updateQuestion(question.id, "correctAnswer", choiceIndex)}
                            />
                            <Input
                              value={choice}
                              onChange={(e) => updateChoice(question.id, choiceIndex, e.target.value)}
                              placeholder={`Choice ${choiceIndex + 1}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowCreateMultipleChoice(false)}>
              Cancel
            </Button>
            <Button onClick={saveMultipleChoiceSet}>Save Multiple Choice Set</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Generator Modal */}
      <Dialog open={showAIGenerator} onOpenChange={setShowAIGenerator}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle>Generated AI Results</DialogTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowAIGenerator(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <Label className="text-red-500">* Number of Questions</Label>
              <Input
                value={aiGenerationForm.numberOfQuestions}
                onChange={(e) => setAiGenerationForm((prev) => ({ ...prev, numberOfQuestions: e.target.value }))}
                type="number"
                min="1"
              />
            </div>

            <div>
              <Label className="text-red-500">* Number of Choices for a Given Question</Label>
              <Input
                value={aiGenerationForm.numberOfChoices}
                onChange={(e) => setAiGenerationForm((prev) => ({ ...prev, numberOfChoices: e.target.value }))}
                type="number"
                min="2"
                max="6"
              />
            </div>

            <div>
              <Label className="text-red-500">
                * What specific Area of knowledge do you want to assess in the applicant?
              </Label>
              <Input
                value={aiGenerationForm.knowledgeArea}
                onChange={(e) => setAiGenerationForm((prev) => ({ ...prev, knowledgeArea: e.target.value }))}
                placeholder="Be Specific"
              />
            </div>

            <div>
              <Label className="text-red-500">
                * Level of Complexity (From scale of 1 to 5 - 1 is simple and 5 is very hard)
              </Label>
              <Input
                value={aiGenerationForm.complexityLevel}
                onChange={(e) => setAiGenerationForm((prev) => ({ ...prev, complexityLevel: e.target.value }))}
                type="number"
                min="1"
                max="5"
              />
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Button onClick={generateWithAI} className="px-8">
              Generate
            </Button>
            <Button variant="outline" onClick={() => setShowAIGenerator(false)} className="px-8">
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
