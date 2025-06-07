"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Sparkles } from "lucide-react"
import ShortAnswerAIModal from "./short-answer-ai-modal"
import ShortAnswerModel from "@/models/short-answer"
import dayjs from "dayjs"
import { timestampFormat } from "@/lib/api/dayjs_format"
import { useAuth } from "@/context/authContext"
import { useToast } from "@/context/toastContext"
import { createShortAnswer, updateShortAnswer } from "@/lib/api/job/short-answer-service"

interface CreateShortAnswerFormProps {
    isOpen: boolean
    onClose: () => void
    editingQuestion: ShortAnswerModel | null
}

export default function CreateShortAnswerForm({
    isOpen,
    onClose,
    editingQuestion,
}: CreateShortAnswerFormProps) {
    const [name, setName] = useState("")
    const [active, setActive] = useState(true)
    const [question, setQuestion] = useState("")
    const [wordLimit, setWordLimit] = useState("250")
    const [showAIModal, setShowAIModal] = useState(false)
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const { user } = useAuth();
    const { showToast } = useToast();

    // Populate form when editing an existing question
    useEffect(() => {
        if (editingQuestion && isOpen) {
            setName(editingQuestion.name)
            setActive(editingQuestion.active)
            setQuestion(editingQuestion.question)
            setWordLimit(editingQuestion.wordLimit.toString())
        } else {
            resetFields();
        }
    }, [editingQuestion]);

    const resetFields = () => {
        setName("")
        setActive(true)
        setQuestion("")
        setWordLimit("250")
    }

    const handleSave = async () => {
        // validation
        const errors: string[] = [];

        setValidationErrors([]); // Clear previous errors

        // 1. Validate Name
        if (!name.trim()) {
            errors.push("The name field is required.");
        }

        // 2. Validate Question
        if (!question.trim()) {
            errors.push("The question field is required.");
        }

        // 3. Validate Word Limit
        const wordLimitNumber = Number(wordLimit);
        if (isNaN(wordLimitNumber) || wordLimitNumber < 20) {
            errors.push("The word limit must be a valid number and at least 20.");
        }

        // If there are validation errors, set them and stop execution
        if (errors.length > 0) {
            setValidationErrors(errors);
            return;
        }

        // If validation passes, create the short answer object
        const shortAnswer: Omit<ShortAnswerModel, "id"> = {
            uid: user?.uid ?? "",
            timestamp: dayjs().format(timestampFormat),
            name,
            active,
            question,
            wordLimit: wordLimitNumber,
        };

        console.log("shortAnswer: ", shortAnswer);

        setLoading(true);

        if (editingQuestion !== null) {
            shortAnswer.timestamp = editingQuestion.timestamp;
            const res = await updateShortAnswer({ ...shortAnswer, id: editingQuestion.id });
            if (res !== null) {
                showToast(`Short answer ${shortAnswer.name} has been updated successfully`, "Success", "success");
                resetFields();
                onClose();
            }
            else showToast("Error updating multiple choice. Please try again.", "Error", "error");
        }
        else {
            const res = await createShortAnswer(shortAnswer);
            if (res !== null) {
                showToast(`Short answer ${shortAnswer.name} has been created successfully`, "Success", "success");
                resetFields();
                onClose();
            }
            else showToast("Error creating short answer. Please try again.", "Error", "error");
        }

        setLoading(false);
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

                    {validationErrors.length > 0 &&
                        <div className="max-w p-3">
                            {/* Validation Errors */}
                            {validationErrors.length > 0 && (
                                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <h4 className="text-sm font-medium text-red-800 mb-2 flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" />
                                        Please fix the following errors:
                                    </h4>
                                    <ul className="text-sm text-red-700 space-y-1">
                                        {validationErrors.map((error, index) => (
                                            <li key={index} className="flex items-center gap-2">
                                                <div className="w-1 h-1 bg-red-500 rounded-full flex-shrink-0" />
                                                {error}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    }

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
                        <Button onClick={handleSave} disabled={!name.trim() || !question.trim() || !wordLimit || loading}>
                            {loading ? "Saving ..." : "Save Question"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <ShortAnswerAIModal isOpen={showAIModal} onClose={() => setShowAIModal(false)} onGenerate={handleAIGenerate} />
        </>
    )
}
