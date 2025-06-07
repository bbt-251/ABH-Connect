"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Plus, Trash2, Settings, X, AlertCircle } from "lucide-react"
import { useToast } from "@/context/toastContext"
import { useAuth } from "@/context/authContext"
import { multipleChoiceCollection, shortAnswerCollection } from "@/lib/api/firebase/collections"
import MultipleChoiceModel from "@/models/multiple-choice"
import { query, where, onSnapshot } from "firebase/firestore"
import ShortAnswerModel from "@/models/short-answer"
import ScreeningQuestionModel from "@/models/screening-question"
import dayjs from "dayjs"
import { timestampFormat } from "@/lib/api/dayjs_format"
import { createScreeningQuestion, updateScreeningQuestion } from "@/lib/api/job/screening-question-service"

interface Question {
    id: string
    type: "short-answer" | "multiple-choice"
    questionId: string
    title: string
    weight: number
    gradingSeverity?: number
    choices?: string[];
}

interface CreateScreeningFormProps {
    isOpen: boolean;
    onClose: () => void;
    editingQuestion: ScreeningQuestionModel | null;
}

export default function CreateScreeningForm({ isOpen, onClose, editingQuestion }: CreateScreeningFormProps) {
    const [formData, setFormData] = useState({
        name: "",
        active: true,
        passingScore: 70,
        timerOption: false,
        timer: 30,
    })

    const [questions, setQuestions] = useState<Question[]>([]);

    useEffect(() => {
        if (editingQuestion && isOpen) {
            setFormData({
                name: editingQuestion.name,
                active: editingQuestion.active,
                passingScore: editingQuestion.passingScore,
                timerOption: editingQuestion.timerEnabled,
                timer: editingQuestion.timer,
            });

            setQuestions([
                ...editingQuestion.multipleChoiceQuestions.map(q => ({
                    id: q.id,
                    type: "multiple-choice" as any,
                    questionId: q.id,
                    title: q.title,
                    weight: q.weight,
                })),
                ...editingQuestion.shortAnswerQuestions.map(q => ({
                    id: q.id,
                    type: "short-answer" as any,
                    questionId: q.id,
                    title: q.title,
                    weight: q.weight,
                    gradingSeverity: q.gradingSeverity,
                })),
            ]);
        }
    }, [editingQuestion, isOpen]);

    const [loading, setLoading] = useState<boolean>(false);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    const { user } = useAuth();
    const { showToast } = useToast();

    const [multipleChoiceSets, setMultipleChoiceSets] = useState<MultipleChoiceModel[]>([]);
    useEffect(() => {
        // fetch using onSnapshot from firebase to actively listen for changes
        if (user) {
            const dataQuery = query(multipleChoiceCollection, where("uid", "==", user.uid));
            const unsubscribe = onSnapshot(dataQuery, (snapshot) => {
                const docs = snapshot.docs.map(doc => doc.data());
                setMultipleChoiceSets((docs as unknown as MultipleChoiceModel[]).filter(doc => doc.active));
            });

            return () => unsubscribe(); // Cleanup the listener on unmount
        } else {
            setMultipleChoiceSets([]);
        }
    }, []);

    const [shortAnswerQuestions, setShortAnswerQuestions] = useState<ShortAnswerModel[]>([]);
    useEffect(() => {
        // fetch using onSnapshot from firebase to actively listen for changes
        if (user) {
            const dataQuery = query(shortAnswerCollection, where("uid", "==", user.uid));
            const unsubscribe = onSnapshot(dataQuery, (snapshot) => {
                const docs = snapshot.docs.map(doc => doc.data());
                setShortAnswerQuestions((docs as unknown as ShortAnswerModel[]).filter(doc => doc.active));
            });

            return () => unsubscribe(); // Cleanup the listener on unmount
        } else {
            setShortAnswerQuestions([]);
        }
    }, []);

    const [showQuestionSelector, setShowQuestionSelector] = useState(false)
    const [selectorType, setSelectorType] = useState<"short-answer" | "multiple-choice" | null>(null)
    const [selectedQuestions, setSelectedQuestions] = useState<string[]>([])

    const [showGradeTuner, setShowGradeTuner] = useState(false)
    const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null)
    const [gradingSeverity, setGradingSeverity] = useState([50])

    const [showMultipleChoiceManager, setShowMultipleChoiceManager] = useState(false)
    const [showAIGenerator, setShowAIGenerator] = useState(false)

    const [aiGenerationForm, setAiGenerationForm] = useState({
        numberOfQuestions: "",
        numberOfChoices: "",
        knowledgeArea: "",
        complexityLevel: "",
    })

    const openQuestionSelector = (type: "short-answer" | "multiple-choice") => {
        setSelectedQuestions([]);
        setSelectorType(type);
        setShowQuestionSelector(true);
    }

    const generateWithAI = () => {
        // Simulate AI generation
        console.log("Generating with AI:", aiGenerationForm)
        // Here you would typically call an AI service
        setShowAIGenerator(false)
    }

    const resetFields = () => {
        setFormData({
            active: true,
            name: "",
            passingScore: 70,
            timer: 30,
            timerOption: false
        });
        setQuestions([]);
    }

    const validateScreeningQuestions = () => {
        setValidationErrors([]);

        const errors: string[] = [];

        // 1. Name is required
        if (!formData.name.trim()) {
            errors.push("The name field is required.");
        }

        // 2. Passing score is required
        if (formData.passingScore === null || formData.passingScore === undefined) {
            errors.push("The passing score is required.");
        }

        // 3. If timer option is enabled, timer must be entered and it can't be less than 5
        if (formData.timerOption && (formData.timer === null || formData.timer < 5)) {
            errors.push("If the timer option is enabled, the timer must be at least 5 minutes.");
        }

        // 4. At least 1 question must be associated
        if (questions.length === 0) {
            errors.push("At least one question must be associated (either short answer or multiple choice).");
        }

        // 5. Total weight must be 100
        const totalWeight = questions.reduce((sum, q) => sum + q.weight, 0);
        if (totalWeight !== 100) {
            errors.push("The total weight of all questions must equal 100%.");
        }

        return errors;
    };

    const handleSubmit = async () => {

        const errors = validateScreeningQuestions();

        if (errors.length > 0) {
            setValidationErrors(errors); // Display errors to the user
            return;
        }

        const screeningQuestion: Omit<ScreeningQuestionModel, "id"> = {
            timestamp: dayjs().format(timestampFormat),
            uid: user?.uid ?? "",
            active: formData.active,
            passingScore: formData.passingScore,
            name: formData.name,
            timer: formData.timer,
            timerEnabled: formData.timerOption,
            multipleChoiceQuestions: questions.filter(q => q.type === "multiple-choice").map(q => ({
                id: q.questionId,
                title: q.title,
                weight: q.weight,
            })),
            shortAnswerQuestions: questions.filter(q => q.type === "short-answer").map(q => ({
                id: q.questionId,
                title: q.title,
                weight: q.weight,
                gradingSeverity: q.gradingSeverity ?? 50,
            })),
        };

        console.log("screeningQuestion: ", screeningQuestion);

        setLoading(true);

        if (editingQuestion !== null) {
            screeningQuestion.timestamp = editingQuestion.timestamp;
            const res = await updateScreeningQuestion({ ...screeningQuestion, id: editingQuestion.id });
            if (res !== null) {
                showToast(`Screening question ${screeningQuestion.name} has been updated successfully`, "Success", "success");
                resetFields();
                onClose();
            }
            else showToast("Error updating screening question. Please try again.", "Error", "error");
        }
        else {
            const res = await createScreeningQuestion(screeningQuestion);
            if (res !== null) {
                showToast(`Screening question ${screeningQuestion.name} has been created successfully`, "Success", "success");
                resetFields();
                onClose();
            }
            else showToast("Error creating screening question. Please try again.", "Error", "error");
        }

        setLoading(false);
        onClose();
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
            const newQuestions = shortAnswerQuestions
                .filter((sa) => selectedQuestions.includes(sa.id))
                .map((sa) => ({
                    id: Math.random().toString(36).substr(2, 9),
                    type: "short-answer",
                    questionId: sa.id,
                    title: sa.question,
                    weight: 10,
                    gradingSeverity: gradingSeverity[0],
                }))
            setQuestions((prev) => [
                ...prev,
                ...newQuestions.map((q) => ({
                    ...q,
                    type: selectorType as "short-answer" | "multiple-choice",
                })),
            ])
        } else if (selectorType === "multiple-choice") {
            const newQuestions = multipleChoiceSets
                .filter((mc) => selectedQuestions.includes(mc.id))
                .map((mc) => ({
                    id: Math.random().toString(36).substr(2, 9),
                    type: "multiple-choice",
                    questionId: mc.id,
                    title: mc.name,
                    weight: 10,
                }))
            setQuestions((prev) => [
                ...prev,
                ...newQuestions.map((q) => ({
                    ...q,
                    type: selectorType as "short-answer" | "multiple-choice",
                })),
            ])
        }
        setShowQuestionSelector(false)
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingQuestion === null ? "Create " : "Edit "} Screening Question Set</DialogTitle>
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
                                                                    Current: {question.gradingSeverity}%
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
                            <Button onClick={handleSubmit} disabled={loading}>{loading ? "Saving ..." : "Save"}</Button>
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
                                    min={1}
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

            {/* Short Answer Selector Modal */}
            <Dialog open={showQuestionSelector} onOpenChange={setShowQuestionSelector}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            Select {selectorType === "short-answer" ? "Short Answer" : "Multiple Choice"} Question
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {selectorType === "short-answer"
                            ? shortAnswerQuestions.map((question) => (
                                <div
                                    key={question.id}
                                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedQuestions.includes(question.id)
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
                                            <h4 className="font-medium mb-1">{question.question}</h4>
                                            {/* <p className="text-sm text-gray-600">{question.description}</p> */}
                                        </div>
                                    </div>
                                </div>
                            ))
                            : multipleChoiceSets.map((question) => (
                                <div
                                    key={question.id}
                                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedQuestions.includes(question.id)
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
                                            <h4 className="font-medium mb-1">{question.name}</h4>
                                            <p className="text-sm text-gray-600 mb-2">{question.description}</p>
                                            {/* <div className="flex flex-wrap gap-1">
                                                {question.options.map((option, idx) => (
                                                    <Badge key={idx} variant="secondary" className="text-xs">
                                                        {option}
                                                    </Badge>
                                                ))}
                                            </div> */}
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
            {/* <Dialog open={showMultipleChoiceManager} onOpenChange={setShowMultipleChoiceManager}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Multiple Choice Management</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
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
            </Dialog> */}

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
