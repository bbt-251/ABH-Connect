"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Sparkles, AlertCircle } from "lucide-react"
import AIGenerationModal from "./ai-generation-modal"
import { useAuth } from "@/context/authContext"
import { useToast } from "@/context/toastContext"
import { createMultipleChoice, updateMultipleChoice } from "@/lib/api/job/multiple-choice-service"
import MultipleChoiceModel from "@/models/multiple-choice"
import dayjs from "dayjs"
import { timestampFormat } from "@/lib/api/dayjs_format"

interface CreateMultipleChoiceFormProps {
    isOpen: boolean
    onClose: () => void
    editingSet: MultipleChoiceModel | null
}

interface Question {
    id: string
    question: string
    choices: string[]
    correctAnswerIndex: number | null
}

interface MultipleChoiceSet {
    name: string
    description: string;
    active: boolean
    questions: Question[]
}

export default function CreateMultipleChoiceForm({ isOpen, onClose, editingSet }: CreateMultipleChoiceFormProps) {
    const [name, setName] = useState("")
    const [active, setActive] = useState(true)
    const [questions, setQuestions] = useState<Question[]>([
        { id: "1", question: "", choices: ["", ""], correctAnswerIndex: null },
    ]);
    const [description, setDescription] = useState<string>("");

    const [showAIModal, setShowAIModal] = useState(false)

    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const { user } = useAuth();
    const { showToast } = useToast();

    useEffect(() => {
        if (isOpen && editingSet) {
            setLoading(false);
            setName(editingSet.name);
            setActive(editingSet.active);
            setDescription(editingSet.description);
            setQuestions(editingSet.questions);
        }
    }, [editingSet, isOpen]);

    const addQuestion = () => {
        const newQuestion: Question = {
            id: Date.now().toString(),
            question: "",
            choices: ["", ""],
            correctAnswerIndex: null,
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

    const updateCorrectAnswer = (questionId: string, choiceIndex: number) => {
        setQuestions(questions.map((q) => (q.id === questionId ? { ...q, correctAnswerIndex: choiceIndex } : q)))
    }

    const resetFields = () => {
        setName("");
        setQuestions([{ id: "1", question: "", choices: ["", ""], correctAnswerIndex: null },]);
        setDescription("");
        setActive(true);
    }

    const handleSave = async () => {
        const errors: string[] = [];

        setValidationErrors([]);

        // 1. At least 1 question must be created
        if (questions.length === 0) {
            errors.push("At least one question must be created.");
        }

        questions.forEach((question, index) => {
            // 2. Each question must have a question title
            if (!question.question.trim()) {
                errors.push(`Question ${index + 1} must have a title.`);
            }

            // 3. Each question must have at least 2 choices
            if (question.choices.length < 2) {
                errors.push(`Question ${index + 1} must have at least 2 choices.`);
            }

            // 4. Each question must have 1 and only 1 correct answer
            if (
                question.correctAnswerIndex === null ||
                question.correctAnswerIndex < 0 ||
                question.correctAnswerIndex >= question.choices.length
            ) {
                errors.push(`Question ${index + 1} must have exactly 1 correct answer.`);
            }
        });

        if (errors.length > 0) {
            setValidationErrors(errors);
            return;
        }

        const multipleChoiceSet: MultipleChoiceSet = {
            name,
            description,
            active,
            questions: questions.filter((q) => q.question.trim() !== ""),
        };

        console.log("multipleChoiceSet: ", multipleChoiceSet);

        setLoading(true);

        const multipleChoice: Omit<MultipleChoiceModel, "id"> = {
            uid: user?.uid ?? "",
            timestamp: dayjs().format(timestampFormat),
            ...multipleChoiceSet,
        };

        if (editingSet !== null) {
            multipleChoice.timestamp = editingSet.timestamp;
            const res = await updateMultipleChoice({ ...multipleChoice, id: editingSet.id });
            if (res !== null) {
                showToast(`Multiple choice ${multipleChoice.name} has been updated successfully`, "Success", "success");
                resetFields();
                onClose();
            }
            else showToast("Error updating multiple choice. Please try again.", "Error", "error");
        }
        else {
            const res = await createMultipleChoice(multipleChoice);
            if (res !== null) {
                showToast(`Multiple choice ${multipleChoice.name} has been created successfully`, "Success", "success");
                resetFields();
                onClose();
            }
            else showToast("Error creating multiple choice. Please try again.", "Error", "error");
        }

        setLoading(false);

        // onSave(multipleChoiceSet)
        // onClose()
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
            correctAnswerIndex: null,
        }
        setQuestions([...questions, generatedQuestion])
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingSet === null ? "Create " : "Update "}Multiple Choice Set</DialogTitle>
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

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter description" />
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
                                            <p className="text-sm text-gray-600">Select the radio button next to the correct answer</p>
                                            <div className="space-y-2">
                                                {question.choices.map((choice, choiceIndex) => (
                                                    <div key={choiceIndex} className="flex items-center gap-2">
                                                        <input
                                                            type="radio"
                                                            name={`correct-${question.id}`}
                                                            checked={question.correctAnswerIndex === choiceIndex}
                                                            onChange={() => updateCorrectAnswer(question.id, choiceIndex)}
                                                            className="w-4 h-4 text-blue-600"
                                                        />
                                                        <Input
                                                            value={choice}
                                                            onChange={(e) => updateChoice(question.id, choiceIndex, e.target.value)}
                                                            placeholder={`Choice ${choiceIndex + 1}`}
                                                            className="flex-1"
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
                        <Button onClick={handleSave} disabled={!name.trim() || loading}>
                            {loading ? "Saving ..." : "Save Multiple Choice Set"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <AIGenerationModal isOpen={showAIModal} onClose={() => setShowAIModal(false)} onGenerate={handleAIGenerate} />
        </>
    )
}
