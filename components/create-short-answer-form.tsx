"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles } from "lucide-react"
import ShortAnswerAIModal from "./short-answer-ai-modal"

interface CreateShortAnswerFormProps {
    isOpen: boolean
    onClose: () => void
    onSave: (shortAnswer: ShortAnswer) => void
    editingQuestion?: ShortAnswer | null
}

interface ShortAnswer {
    id?: string
    name: string
    active: boolean
    question: string
    wordLimit: number
}

export default function CreateShortAnswerForm({
    isOpen,
    onClose,
    onSave,
    editingQuestion,
}: CreateShortAnswerFormProps) {
    const [name, setName] = useState("")
    const [active, setActive] = useState(true)
    const [question, setQuestion] = useState("")
    const [wordLimit, setWordLimit] = useState("250")
    const [showAIModal, setShowAIModal] = useState(false)

    // Populate form when editing an existing question
    useEffect(() => {
        if (editingQuestion) {
            setName(editingQuestion.name)
            setActive(editingQuestion.active)
            setQuestion(editingQuestion.question)
            setWordLimit(editingQuestion.wordLimit.toString())
        } else {
            // Reset form for new question
            setName("")
            setActive(true)
            setQuestion("")
            setWordLimit("250")
        }
    }, [editingQuestion])

    const handleSave = () => {
        const shortAnswer: ShortAnswer = {
            id: editingQuestion?.id || Date.now().toString(),
            name,
            active,
            question,
            wordLimit: Number.parseInt(wordLimit),
        }
        onSave(shortAnswer)
    }

    const handleAIGenerate = (params: any) => {
        // Here you would implement the AI generation logic
        console.log("AI Generation params:", params)
        setShowAIModal(false)

        // For now, we'll just set a sample generated question
        setQuestion(`Generated question about ${params.knowledgeArea} with complexity level ${params.complexityLevel}`)
        setWordLimit(params.wordLimit.toString())
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingQuestion ? "Edit" : "Create"} Short Answer Question</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6 mt-4">
                        {/* Basic Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter question name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="active">Active</Label>
                                <div className="flex items-center space-x-2">
                                    <Switch id="active" checked={active} onCheckedChange={setActive} />
                                    <span className="text-sm">{active ? "Active" : "Inactive"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Question */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="question">Question</Label>
                                <Button variant="outline" size="sm" onClick={() => setShowAIModal(true)}>
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Generate with AI
                                </Button>
                            </div>
                            <Textarea
                                id="question"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="Enter your short answer question"
                                rows={4}
                            />
                        </div>

                        {/* Word Limit */}
                        <div className="space-y-2">
                            <Label htmlFor="wordLimit">Word Limit</Label>
                            <Input
                                id="wordLimit"
                                type="number"
                                value={wordLimit}
                                onChange={(e) => setWordLimit(e.target.value)}
                                min="50"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={!name.trim() || !question.trim() || !wordLimit}>
                            Save Question
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <ShortAnswerAIModal isOpen={showAIModal} onClose={() => setShowAIModal(false)} onGenerate={handleAIGenerate} />
        </>
    )
}
