"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Sparkles } from "lucide-react"
import AIGenerationModal from "./ai-generation-modal"

interface CreateMultipleChoiceFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (multipleChoiceSet: MultipleChoiceSet) => void
}

interface Question {
  id: string
  question: string
  choices: string[]
}

interface MultipleChoiceSet {
  name: string
  active: boolean
  questions: Question[]
}

export default function CreateMultipleChoiceForm({ isOpen, onClose, onSave }: CreateMultipleChoiceFormProps) {
  const [name, setName] = useState("")
  const [active, setActive] = useState(true)
  const [questions, setQuestions] = useState<Question[]>([{ id: "1", question: "", choices: ["", ""] }])
  const [showAIModal, setShowAIModal] = useState(false)

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      question: "",
      choices: ["", ""],
    }
    setQuestions([...questions, newQuestion])
  }

  const removeQuestion = (questionId: string) => {
    setQuestions(questions.filter((q) => q.id !== questionId))
  }

  const updateQuestion = (questionId: string, field: string, value: string) => {
    setQuestions(questions.map((q) => (q.id === questionId ? { ...q, [field]: value } : q)))
  }

  const addChoice = (questionId: string) => {
    setQuestions(questions.map((q) => (q.id === questionId ? { ...q, choices: [...q.choices, ""] } : q)))
  }

  const removeChoice = (questionId: string, choiceIndex: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              choices: q.choices.filter((_, index) => index !== choiceIndex),
            }
          : q,
      ),
    )
  }

  const updateChoice = (questionId: string, choiceIndex: number, value: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              choices: q.choices.map((choice, index) => (index === choiceIndex ? value : choice)),
            }
          : q,
      ),
    )
  }

  const handleSave = () => {
    const multipleChoiceSet: MultipleChoiceSet = {
      name,
      active,
      questions: questions.filter((q) => q.question.trim() !== ""),
    }
    onSave(multipleChoiceSet)
    onClose()
  }

  const handleAIGenerate = (params: any) => {
    // Here you would implement the AI generation logic
    console.log("AI Generation params:", params)
    setShowAIModal(false)
    // For now, we'll just add a sample generated question
    const generatedQuestion: Question = {
      id: Date.now().toString(),
      question: `Generated question about ${params.knowledgeArea}`,
      choices: Array(params.numberOfChoices)
        .fill("")
        .map((_, i) => `Option ${i + 1}`),
    }
    setQuestions([...questions, generatedQuestion])
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Multiple Choice Set</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter set name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="active">Active</Label>
                <div className="flex items-center space-x-2">
                  <Switch id="active" checked={active} onCheckedChange={setActive} />
                  <span className="text-sm">{active ? "Active" : "Inactive"}</span>
                </div>
              </div>
            </div>

            {/* AI Generation Button */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Questions</h3>
              <Button variant="outline" onClick={() => setShowAIModal(true)}>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate with AI
              </Button>
            </div>

            {/* Questions */}
            <div className="space-y-4">
              {questions.map((question, questionIndex) => (
                <Card key={question.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">Question {questionIndex + 1}</CardTitle>
                      {questions.length > 1 && (
                        <Button variant="ghost" size="icon" onClick={() => removeQuestion(question.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Question</Label>
                      <Input
                        value={question.question}
                        onChange={(e) => updateQuestion(question.id, "question", e.target.value)}
                        placeholder="Enter your question"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Choices</Label>
                      <div className="space-y-2">
                        {question.choices.map((choice, choiceIndex) => (
                          <div key={choiceIndex} className="flex items-center gap-2">
                            <Input
                              value={choice}
                              onChange={(e) => updateChoice(question.id, choiceIndex, e.target.value)}
                              placeholder={`Choice ${choiceIndex + 1}`}
                            />
                            {question.choices.length > 2 && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeChoice(question.id, choiceIndex)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button variant="outline" size="sm" onClick={() => addChoice(question.id)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Choice
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button variant="outline" onClick={addQuestion}>
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!name.trim()}>
              Save Multiple Choice Set
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AIGenerationModal isOpen={showAIModal} onClose={() => setShowAIModal(false)} onGenerate={handleAIGenerate} />
    </>
  )
}
