"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Upload, Crown } from "lucide-react"
import CreateShortAnswerForm from "./create-short-answer-form"
import { useAuth } from "@/context/authContext"
import { useToast } from "@/context/toastContext"
import { onSnapshot, query, where } from "firebase/firestore"
import { shortAnswerCollection } from "@/lib/api/firebase/collections"
import ShortAnswerModel from "@/models/short-answer"
import { deleteShortAnswer } from "@/lib/api/job/short-answer-service"

interface ShortAnswerManagerProps {
    isOpen: boolean
    onClose: () => void
}

export default function ShortAnswerManager({ isOpen, onClose }: ShortAnswerManagerProps) {
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [editingQuestion, setEditingQuestion] = useState<any>(null)
    const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
    const [toDeleteID, setToDeleteID] = useState<string>("");
    const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

    const { user } = useAuth();
    const { showToast } = useToast();

    const [shortAnswerQuestions, setShortAnswerQuestions] = useState<ShortAnswerModel[]>([]);
    useEffect(() => {
        // fetch using onSnapshot from firebase to actively listen for changes
        if (user) {
            const dataQuery = query(shortAnswerCollection, where("uid", "==", user.uid));
            const unsubscribe = onSnapshot(dataQuery, (snapshot) => {
                const docs = snapshot.docs.map(doc => doc.data());
                setShortAnswerQuestions(docs as unknown as ShortAnswerModel[]);
            });

            return () => unsubscribe(); // Cleanup the listener on unmount
        } else {
            setShortAnswerQuestions([]);
        }
    }, []);

    const handleCreateNew = () => {
        setShowCreateForm(true)
    }

    const handleImport = () => {
        showToast("Import is a premium feature. Please upgrade to Pro to access this functionality.", "Oops", "warning");
    }

    const handleEditQuestion = (question: any) => {
        setEditingQuestion(question)
        setShowCreateForm(true)
    }

    const handleDeleteQuestion = (questionId: string) => {
        setShowDeleteDialog(true);
        setToDeleteID(questionId);
    }

    const confirmDelete = async () => {
        if (toDeleteID) {
            console.log("Deleting question:", toDeleteID);
            setDeleteLoading(true);

            const res = await deleteShortAnswer(toDeleteID);
            if (res) showToast("Deleted!", "Success", "success");
            else showToast("Error deleting short answer. Please try again!", "Error", "error");

            setShowDeleteDialog(false); // Close the confirmation dialog
            setToDeleteID(""); // Reset the set to delete
            setDeleteLoading(false);
        }
    };

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
                editingQuestion={editingQuestion}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-gray-600">
                        Are you sure you want to delete this multiple-choice set? This action cannot be undone.
                    </p>
                    <div className="flex justify-end mt-4 gap-2">
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            {deleteLoading ? "Deleting ..." : "Delete"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </Dialog>
    )
}
