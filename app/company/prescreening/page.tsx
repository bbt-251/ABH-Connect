"use client"

import { useEffect, useState } from "react"
import { Plus, FileText, MessageSquare, Edit, Eye, Trash2, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import CreateScreeningForm from "@/components/create-screening-form"
import ShortAnswerManager from "@/components/short-answer-manager"
import MultipleChoiceManager from "@/components/multiple-choice-manager"
import { useAuth } from "@/context/authContext"
import ScreeningQuestionModel from "@/models/screening-question"
import { matchingCriteriaCollection, screeningQuestionCollection } from "@/lib/api/firebase/collections"
import { query, where, onSnapshot } from "firebase/firestore"
import { deleteScreeningQuestion } from "@/lib/api/job/screening-question-service"
import { useToast } from "@/context/toastContext"
import { educationLevels, experienceYears } from "@/app/auth/register/page"
import MatchingCriteriaModel from "@/models/matching-criteria"
import dayjs from "dayjs"
import { timestampFormat } from "@/lib/api/dayjs_format"
import { createMatchingCriteria, deleteMatchingCriteria, updateMatchingCriteria } from "@/lib/api/job/matching-criteria-service"

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

    const [editingQuestion, setEditingQuestion] = useState<ScreeningQuestionModel | null>(null);

    const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
    const [toDeleteID, setToDeleteID] = useState<string>("");
    const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

    const { user } = useAuth();
    const { showToast } = useToast();

    const [screeningQuestions, setScreeningQuestions] = useState<ScreeningQuestionModel[]>([]);
    useEffect(() => {
        // fetch using onSnapshot from firebase to actively listen for changes
        if (user) {
            const dataQuery = query(screeningQuestionCollection, where("uid", "==", user.uid));
            const unsubscribe = onSnapshot(dataQuery, (snapshot) => {
                const docs = snapshot.docs.map(doc => doc.data());
                setScreeningQuestions(docs as unknown as ScreeningQuestionModel[]);
            });

            return () => unsubscribe(); // Cleanup the listener on unmount
        } else {
            setScreeningQuestions([]);
        }
    }, []);

    const [matchingCriteria, setMatchingCriteria] = useState<MatchingCriteriaModel[]>([]);
    useEffect(() => {
        // fetch using onSnapshot from firebase to actively listen for changes
        if (user) {
            const dataQuery = query(matchingCriteriaCollection, where("uid", "==", user.uid));
            const unsubscribe = onSnapshot(dataQuery, (snapshot) => {
                const docs = snapshot.docs.map(doc => doc.data());
                setMatchingCriteria(docs as unknown as MatchingCriteriaModel[]);
            });

            return () => unsubscribe(); // Cleanup the listener on unmount
        } else {
            setMatchingCriteria([]);
        }
    }, []);

    const handleEdit = (question: ScreeningQuestionModel) => {
        setEditingQuestion(question);
        setShowCreateScreeningForm(true);
    }

    const handleView = (question: any) => {
        // setEditingQuestion(question)
        // setShowCreateForm(true)
    }

    const handleDelete = (questionId: string) => {
        setShowDeleteDialog(true);
        setToDeleteID(questionId);
    }

    const confirmDelete = async () => {
        if (toDeleteID) {
            console.log("Deleting question:", toDeleteID);
            setDeleteLoading(true);

            const res = await deleteScreeningQuestion(toDeleteID);
            if (res) showToast("Deleted!", "Success", "success");
            else showToast("Error deleting screening question. Please try again!", "Error", "error");

            setShowDeleteDialog(false); // Close the confirmation dialog
            setToDeleteID(""); // Reset the set to delete
            setDeleteLoading(false);
        }
    };

    const [criteriaSaving, setCriteriaSaving] = useState<boolean>(false);
    const [editingCriteria, setEditingCriteria] = useState<MatchingCriteriaModel | null>(null);
    const [toDeleteIDCriteria, setToDeleteIDCriteria] = useState<string>("");
    const [showDeleteCriteriaDialog, setShowDeleteCriteriaDialog] = useState<boolean>(false);

    const resetFields = () => {
        setCriteriaSetName("");
        setSelectedCriteria([]);
        setEditingCriteria(null);
    }

    const handleDeleteCriteria = (criteria: MatchingCriteriaModel) => {
        setToDeleteIDCriteria(criteria.id);
        setShowDeleteCriteriaDialog(true);
    }

    const handleEditCriteria = (criteria: MatchingCriteriaModel) => {
        if (criteria) {
            setEditingCriteria(criteria);
            setCriteriaSetName(criteria.name);
            setSelectedCriteria(criteria.criteria);
            setShowCreateCriteriaSetModal(true);
        }
    }

    const handleSaveCriteria = async () => {
        // validate
        setCriteriaSaving(true);

        if (validateCriteriaSet().length === 0) {

            const matchingCriteria: Omit<MatchingCriteriaModel, "id"> = {
                timestamp: dayjs().format(timestampFormat),
                uid: user?.uid ?? "",
                name: criteriaSetName,
                criteria: selectedCriteria.map(c => ({
                    type: String(c.type),
                    value: String(c.value),
                    condition: String(c.condition ?? ""),
                    min: (c.min && c.condition === "between") ? Number(c.min) : 0,
                    max: (c.max && c.condition === "between") ? Number(c.max) : 0,
                })),
            }

            console.log("matchingCriteria:", matchingCriteria);

            if (editingCriteria !== null) {
                matchingCriteria.timestamp = editingCriteria.timestamp;
                const res = await updateMatchingCriteria({ ...matchingCriteria, id: editingCriteria.id });
                if (res !== null) {
                    showToast(`Criteria ${matchingCriteria.name} has been updated successfully`, "Success", "success");
                    resetFields();
                    setShowCreateCriteriaSetModal(false);
                }
                else showToast("Error updating criteria. Please try again.", "Error", "error");
            }
            else {
                const res = await createMatchingCriteria(matchingCriteria);
                if (res !== null) {
                    showToast(`Criteria ${matchingCriteria.name} has been created successfully`, "Success", "success");
                    resetFields();
                    setShowCreateCriteriaSetModal(false);
                }
                else showToast("Error creating criteria. Please try again.", "Error", "error");
            }
        }

        setCriteriaSaving(false);
        // setShowCreateCriteriaSetModal(false);
    }

    const confirmDeleteCriteria = async () => {
        if (toDeleteIDCriteria) {
            console.log("Deleting criteria:", toDeleteIDCriteria);
            setDeleteLoading(true);

            const res = await deleteMatchingCriteria(toDeleteIDCriteria);
            if (res) showToast("Deleted!", "Success", "success");
            else showToast("Error deleting matching criteria. Please try again!", "Error", "error");

            setShowDeleteCriteriaDialog(false); // Close the confirmation dialog
            setToDeleteIDCriteria(""); // Reset the set to delete
            setDeleteLoading(false);
        }
    }

    const validateCriteriaSet = () => {
        const errors: string[] = [];

        // 1. Name is required
        if (!criteriaSetName.trim()) {
            errors.push("The criteria set name is required.");
        }

        // 2. At least 1 criteria is required
        if (selectedCriteria.length === 0) {
            errors.push("At least one criteria must be selected.");
        }

        // 3. Ensure inputs for each selected criteria are filled
        selectedCriteria.forEach((criteria) => {
            if (criteria.type === "gender" && !criteria.value) {
                errors.push("Gender criteria must have a selected value.");
            }

            if (criteria.type === "education" && !criteria.value) {
                errors.push("Education criteria must have a selected value.");
            }

            if (criteria.type === "experience" && !criteria.value) {
                errors.push("Experience criteria must have a selected value.");
            }

            if (criteria.type === "age") {
                if (criteria.condition === "between") {
                    if (!criteria.min || !criteria.max) {
                        errors.push("Age criteria must have both minimum and maximum values for 'Between' condition.");
                    }
                } else if (!criteria.value) {
                    errors.push("Age criteria must have a value.");
                }
            }

            if (criteria.type === "score") {
                if (criteria.condition === "between") {
                    if (!criteria.min || !criteria.max) {
                        errors.push("Score criteria must have both minimum and maximum values for 'Between' condition.");
                    }
                } else if (!criteria.value) {
                    errors.push("Score criteria must have a value.");
                }
            }
        });

        return errors;
    };

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
                <CreateScreeningForm
                    isOpen={showCreateScreeningForm}
                    onClose={() => setShowCreateScreeningForm(false)}
                    editingQuestion={editingQuestion}
                />
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
                                        {screeningQuestions.map((questionSet) => (
                                            <div key={questionSet.id} className="p-4 border border-gray-200 rounded-lg">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-gray-900">{questionSet.name}</h4>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            {questionSet.active
                                                                ? "This screening set is currently active."
                                                                : "This screening set is currently inactive."}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className={questionSet.active ? "text-green-600" : "text-gray-600"}>
                                                            {questionSet.active ? "Active" : "Inactive"}
                                                        </Badge>
                                                        <Button variant="ghost" size="sm" onClick={() => handleEdit(questionSet)}>
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="sm" onClick={() => handleView(questionSet)}>
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="sm" onClick={() => handleDelete(questionSet.id)}>
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                                                    <div>
                                                        <span className="text-gray-500">Multiple Choice Sets:</span>
                                                        <span className="ml-2 font-medium">
                                                            {questionSet.multipleChoiceQuestions.length} set
                                                            {questionSet.multipleChoiceQuestions.length !== 1 ? "s" : ""}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500">Short Answer Questions:</span>
                                                        <span className="ml-2 font-medium">
                                                            {questionSet.shortAnswerQuestions.length} question
                                                            {questionSet.shortAnswerQuestions.length !== 1 ? "s" : ""}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500">Est. Time:</span>
                                                        <span className="ml-2 font-medium">{questionSet.timerEnabled ? `${questionSet.timer} minutes` : "N/A"}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500">Used in Jobs:</span>
                                                        {/* <span className="ml-2 font-medium">{questionSet.usedInJobs || "No active positions"}</span> */}
                                                        <span className="ml-2 font-medium">0</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 text-xs">
                                                    {questionSet.multipleChoiceQuestions.map((mcq, index) => (
                                                        <Badge key={index} variant="secondary">
                                                            {mcq.title}
                                                        </Badge>
                                                    ))}
                                                    {questionSet.shortAnswerQuestions.map((saq, index) => (
                                                        <Badge key={index} variant="secondary">
                                                            {saq.title}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* <div className="space-y-3">
                                        <div className="p-4 border border-gray-200 rounded-lg">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900">Customer Service Skills Assessment</h4>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        Evaluate candidates on their communication, empathy, and problem-solving abilities in
                                                        customer service roles.
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline">Draft</Badge>
                                                    <Button variant="ghost" size="sm">
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm">
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm">
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                                                <div>
                                                    <span className="text-gray-500">Multiple Choice Sets:</span>
                                                    <span className="ml-2 font-medium">1 set (Customer Interaction Scenarios)</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Short Answer Questions:</span>
                                                    <span className="ml-2 font-medium">2 questions (Conflict Resolution, Empathy)</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Est. Time:</span>
                                                    <span className="ml-2 font-medium">10 minutes</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Used in Jobs:</span>
                                                    <span className="ml-2 font-medium">No active positions</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 text-xs">
                                                <Badge variant="secondary">Customer Interaction Scenarios</Badge>
                                                <Badge variant="secondary">Conflict Resolution Skills</Badge>
                                                <Badge variant="secondary">Empathy Assessment</Badge>
                                            </div>
                                        </div>
                                    </div> */}
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
                                    {
                                        matchingCriteria.map(criteria => {
                                            return (
                                                <div className="space-y-3" key={criteria.id}>
                                                    <div className="p-4 border border-gray-200 rounded-lg">
                                                        <div className="flex justify-between items-start mb-3">
                                                            <div>
                                                                <h4 className="font-medium text-gray-900">{criteria.name}</h4>
                                                                <p className="text-sm text-gray-600">{criteria.criteria.length} Criteria</p>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <Button variant="ghost" size="sm" onClick={() => handleEditCriteria(criteria)}>
                                                                    Edit
                                                                </Button>
                                                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDeleteCriteria(criteria)}>
                                                                    Delete
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {
                                                                criteria.criteria.map(c => {
                                                                    return (
                                                                        <div className="" key={c.type}>
                                                                            <Badge variant="outline">
                                                                                {c.type} : {(c.min !== 0 && c.max !== 0) ? `${c.min}${c.type === "score" ? `%` : ""} - ${c.max}${c.type === "score" ? `%` : ""}` : ((c.type === "score" || c.type === "age") ? `${c.condition} ${c.value}${c.type === "score" ? `%` : ""}` : c.value)}
                                                                            </Badge>
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
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

                        {validateCriteriaSet().length > 0 &&
                            <div className="max-w p-3">
                                {/* Validation Errors */}
                                {validateCriteriaSet().length > 0 && (
                                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                        <h4 className="text-sm font-medium text-red-800 mb-2 flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4" />
                                            Please fix the following errors:
                                        </h4>
                                        <ul className="text-sm text-red-700 space-y-1">
                                            {validateCriteriaSet().map((error, index) => (
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
                            {/* Set Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Set Name</label>
                                <Input
                                    value={criteriaSetName}
                                    onChange={(e) => setCriteriaSetName(e.target.value)}
                                    placeholder="e.g., Senior Developer Requirements"
                                />
                            </div>

                            {/* Criteria Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Select Criteria</label>
                                <div className="space-y-4">
                                    {/* Gender */}
                                    <div className="p-4 border border-gray-200 rounded-lg">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Checkbox
                                                checked={selectedCriteria.some((c) => c.type === "gender")}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        setSelectedCriteria((prev) => [...prev, { type: "gender", value: "" }]);
                                                    } else {
                                                        setSelectedCriteria((prev) => prev.filter((c) => c.type !== "gender"));
                                                    }
                                                }}
                                            />
                                            <span className="font-medium">Gender</span>
                                        </div>
                                        <div className="ml-6">
                                            <Select
                                                value={selectedCriteria.find((c) => c.type === "gender")?.value || ""}
                                                onValueChange={(value) =>
                                                    setSelectedCriteria((prev) =>
                                                        prev.map((c) => (c.type === "gender" ? { ...c, value } : c))
                                                    )
                                                }
                                            >
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

                                    {/* Years of Experience */}
                                    <div className="p-4 border border-gray-200 rounded-lg">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Checkbox
                                                checked={selectedCriteria.some((c) => c.type === "experience")}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        setSelectedCriteria((prev) => [...prev, { type: "experience", value: "" }]);
                                                    } else {
                                                        setSelectedCriteria((prev) => prev.filter((c) => c.type !== "experience"));
                                                    }
                                                }}
                                            />
                                            <span className="font-medium">Years of Experience</span>
                                        </div>
                                        <div className="ml-6">
                                            <Select
                                                value={selectedCriteria.find((c) => c.type === "experience")?.value || ""}
                                                onValueChange={(value) =>
                                                    setSelectedCriteria((prev) =>
                                                        prev.map((c) => (c.type === "experience" ? { ...c, value } : c))
                                                    )
                                                }
                                            >
                                                <SelectTrigger className="w-48">
                                                    <SelectValue placeholder="Select option" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {
                                                        experienceYears.map(year => {
                                                            return (
                                                                <SelectItem key={year} value={year}>{year}</SelectItem>
                                                            );
                                                        })
                                                    }
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Level of Education */}
                                    <div className="p-4 border border-gray-200 rounded-lg">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Checkbox
                                                checked={selectedCriteria.some((c) => c.type === "education")}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        setSelectedCriteria((prev) => [...prev, { type: "education", value: "" }]);
                                                    } else {
                                                        setSelectedCriteria((prev) => prev.filter((c) => c.type !== "education"));
                                                    }
                                                }}
                                            />
                                            <span className="font-medium">Level of Education</span>
                                        </div>
                                        <div className="ml-6">
                                            <Select
                                                value={selectedCriteria.find((c) => c.type === "education")?.value || ""}
                                                onValueChange={(value) =>
                                                    setSelectedCriteria((prev) =>
                                                        prev.map((c) => (c.type === "education" ? { ...c, value } : c))
                                                    )
                                                }
                                            >
                                                <SelectTrigger className="w-48">
                                                    <SelectValue placeholder="Select option" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {
                                                        educationLevels.map(level => {
                                                            return (
                                                                <SelectItem key={level} value={level}>{level}</SelectItem>
                                                            );
                                                        })
                                                    }
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Age */}
                                    <div className="p-4 border border-gray-200 rounded-lg">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Checkbox
                                                checked={selectedCriteria.some((c) => c.type === "age")}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        setSelectedCriteria((prev) => [...prev, { type: "age", condition: "equal", value: "" }]);
                                                    } else {
                                                        setSelectedCriteria((prev) => prev.filter((c) => c.type !== "age"));
                                                    }
                                                }}
                                            />
                                            <span className="font-medium">Age</span>
                                        </div>

                                        <div className="ml-6 flex gap-3">
                                            <Select
                                                value={selectedCriteria.find((c) => c.type === "age")?.condition || "equal"}
                                                onValueChange={(condition) =>
                                                    setSelectedCriteria((prev) =>
                                                        prev.map((c) => (c.type === "age" ? { ...c, condition, value: "" } : c))
                                                    )
                                                }
                                            >
                                                <SelectTrigger className="w-32">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="equal to">Equal to</SelectItem>
                                                    <SelectItem value="greater than">Higher than</SelectItem>
                                                    <SelectItem value="less than">Lower than</SelectItem>
                                                    <SelectItem value="between">Between</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {selectedCriteria.find((c) => c.type === "age")?.condition === "between" ? (
                                                <>
                                                    <Input
                                                        type="number"
                                                        placeholder="Min age"
                                                        className="w-32"
                                                        value={selectedCriteria.find((c) => c.type === "age")?.min || ""}
                                                        onChange={(e) =>
                                                            setSelectedCriteria((prev) =>
                                                                prev.map((c) =>
                                                                    c.type === "age" ? { ...c, min: e.target.value } : c
                                                                )
                                                            )
                                                        }
                                                    />
                                                    <Input
                                                        type="number"
                                                        placeholder="Max age"
                                                        className="w-32"
                                                        value={selectedCriteria.find((c) => c.type === "age")?.max || ""}
                                                        onChange={(e) =>
                                                            setSelectedCriteria((prev) =>
                                                                prev.map((c) =>
                                                                    c.type === "age" ? { ...c, max: e.target.value } : c
                                                                )
                                                            )
                                                        }
                                                    />
                                                </>
                                            ) : (
                                                <Input
                                                    type="number"
                                                    placeholder="Value in years"
                                                    className="w-32"
                                                    value={selectedCriteria.find((c) => c.type === "age")?.value || ""}
                                                    onChange={(e) =>
                                                        setSelectedCriteria((prev) =>
                                                            prev.map((c) => (c.type === "age" ? { ...c, value: e.target.value } : c))
                                                        )
                                                    }
                                                />
                                            )}
                                        </div>
                                    </div>

                                    {/* Passing Score */}
                                    <div className="p-4 border border-gray-200 rounded-lg">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Checkbox
                                                checked={selectedCriteria.some((c) => c.type === "score")}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        setSelectedCriteria((prev) => [...prev, { type: "score", condition: "equal", value: "" }]);
                                                    } else {
                                                        setSelectedCriteria((prev) => prev.filter((c) => c.type !== "score"));
                                                    }
                                                }}
                                            />
                                            <span className="font-medium">Score</span>
                                        </div>

                                        <div className="ml-6 flex gap-3">
                                            <Select
                                                value={selectedCriteria.find((c) => c.type === "score")?.condition || "equal"}
                                                onValueChange={(condition) =>
                                                    setSelectedCriteria((prev) =>
                                                        prev.map((c) => (c.type === "score" ? { ...c, condition, value: "" } : c))
                                                    )
                                                }
                                            >
                                                <SelectTrigger className="w-32">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="equal to">Equal to</SelectItem>
                                                    <SelectItem value="greater than">Higher than</SelectItem>
                                                    <SelectItem value="less than">Lower than</SelectItem>
                                                    <SelectItem value="between">Between</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {selectedCriteria.find((c) => c.type === "score")?.condition === "between" ? (
                                                <>
                                                    <Input
                                                        type="number"
                                                        placeholder="Min score"
                                                        className="w-32"
                                                        value={selectedCriteria.find((c) => c.type === "score")?.min || ""}
                                                        onChange={(e) =>
                                                            setSelectedCriteria((prev) =>
                                                                prev.map((c) =>
                                                                    c.type === "score" ? { ...c, min: e.target.value } : c
                                                                )
                                                            )
                                                        }
                                                    />
                                                    <Input
                                                        type="number"
                                                        placeholder="Max score"
                                                        className="w-32"
                                                        value={selectedCriteria.find((c) => c.type === "score")?.max || ""}
                                                        onChange={(e) =>
                                                            setSelectedCriteria((prev) =>
                                                                prev.map((c) =>
                                                                    c.type === "score" ? { ...c, max: e.target.value } : c
                                                                )
                                                            )
                                                        }
                                                    />
                                                </>
                                            ) : (
                                                <Input
                                                    type="number"
                                                    placeholder="Value in %"
                                                    className="w-32"
                                                    value={selectedCriteria.find((c) => c.type === "score")?.value || ""}
                                                    onChange={(e) =>
                                                        setSelectedCriteria((prev) =>
                                                            prev.map((c) => (c.type === "score" ? { ...c, value: e.target.value } : c))
                                                        )
                                                    }
                                                />
                                            )}
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
                                disabled={criteriaSaving}
                                onClick={handleSaveCriteria}
                            >
                                {criteriaSaving ? "Saving ..." : "Save"}
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

            {/* Delete Screening Question Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-gray-600">
                        Are you sure you want to delete this screening question? This action cannot be undone.
                    </p>
                    <div className="flex justify-end mt-4 gap-2">
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" disabled={deleteLoading} onClick={confirmDelete}>
                            {deleteLoading ? "Deleting ..." : "Delete"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Matching Criteria Confirmation Dialog */}
            <Dialog open={showDeleteCriteriaDialog} onOpenChange={setShowDeleteCriteriaDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-gray-600">
                        Are you sure you want to delete this matching criteria? This action cannot be undone.
                    </p>
                    <div className="flex justify-end mt-4 gap-2">
                        <Button variant="outline" onClick={() => setShowDeleteCriteriaDialog(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" disabled={deleteLoading} onClick={confirmDeleteCriteria}>
                            {deleteLoading ? "Deleting ..." : "Delete"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
