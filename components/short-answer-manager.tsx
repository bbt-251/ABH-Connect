"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Upload, Crown } from "lucide-react"
import CreateShortAnswerForm from "./create-short-answer-form"

interface ShortAnswerManagerProps {
  isOpen: boolean
  onClose: () => void
}

export default function ShortAnswerManager({ isOpen, onClose }: ShortAnswerManagerProps) {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<any>(null)

  // Sample short answer questions
  const shortAnswerQuestions = [
    {
      id: "sa-1",
      name: "Problem Solving Approach",
      active: true,
      question: "Describe a complex problem you faced in your previous role and how you approached solving it.",
      wordLimit: 250,
    },
    {
      id: "sa-2",
      name: "Leadership Experience",
      active: true,
      question: "Provide an example of when you had to lead a team through a challenging situation.",
      wordLimit: 200,
    },
    {
      id: "sa-3",
      name: "Technical Challenge",
      active: false,
      question: "Explain how you would architect a scalable web application that needs to handle millions of users.",
      wordLimit: 300,
    },
    {
      id: "sa-4",
      name: "Career Motivation",
      active: true,
      question: "Why are you interested in this position and how does it align with your career goals?",
      wordLimit: 150,
    },
  ]

  const handleCreateNew = () => {
    setShowCreateForm(true)
  }

  const handleImport = () => {
    alert("Import is a premium feature. Please upgrade to Pro to access this functionality.")
  }

  const handleSaveShortAnswer = (shortAnswer: any) => {
    console.log("Saved short answer:", shortAnswer)
    setShowCreateForm(false)
    setEditingQuestion(null)
    // Here you would add the new question to your list
  }

  const handleEditQuestion = (question: any) => {
    setEditingQuestion(question)
    setShowCreateForm(true)
  }

  const handleDeleteQuestion = (questionId: string) => {
    if (confirm("Are you sure you want to delete this short answer question?")) {
      console.log("Deleting question:", questionId)
      // Here you would implement the actual delete logic
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Short Answer Management</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button onClick={handleCreateNew}>
              <Plus className="w-4 h-4 mr-1" />
              Create
            </Button>
            <Button variant="outline" onClick={handleImport} className="relative">
              <Upload className="w-4 h-4 mr-1" />
              Import
              <Crown className="w-3 h-3 ml-1 text-yellow-500" />
              <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs px-1 rounded-full">PRO</span>
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="Search short answer questions..." className="pl-10" />
          </div>

          {/* Short Answer Questions List */}
          <div className="space-y-3">
            {shortAnswerQuestions.map((question) => (
              <div key={question.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium">{question.name}</h4>
                      <Badge variant={question.active ? "default" : "secondary"}>
                        {question.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{question.question}</p>
                    <p className="text-sm text-gray-500">Word limit: {question.wordLimit}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEditQuestion(question)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDeleteQuestion(question.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
      <CreateShortAnswerForm
        isOpen={showCreateForm}
        onClose={() => {
          setShowCreateForm(false)
          setEditingQuestion(null)
        }}
        onSave={handleSaveShortAnswer}
        editingQuestion={editingQuestion}
      />
    </Dialog>
  )
}
