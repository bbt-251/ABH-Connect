"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Upload, Crown } from "lucide-react"
import CreateMultipleChoiceForm from "./create-multiple-choice-form"

interface MultipleChoiceManagerProps {
    isOpen: boolean
    onClose: () => void
}

export default function MultipleChoiceManager({ isOpen, onClose }: MultipleChoiceManagerProps) {
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [editingSet, setEditingSet] = useState<any>(null)

    // Sample multiple choice sets
    const multipleChoiceSets = [
        {
            id: "mc-set-1",
            name: "Technical Skills Assessment",
            active: true,
            questionCount: 8,
            description: "Programming languages, frameworks, and technical tools",
        },
        {
            id: "mc-set-2",
            name: "Communication Skills",
            active: true,
            questionCount: 5,
            description: "Verbal and written communication abilities",
        },
        {
            id: "mc-set-3",
            name: "Project Management Experience",
            active: false,
            questionCount: 6,
            description: "Methodologies, tools, and leadership experience",
        },
        {
            id: "mc-set-4",
            name: "Work Environment Preferences",
            active: true,
            questionCount: 4,
            description: "Remote work, team size, and schedule preferences",
        },
    ]

    const handleCreateNew = () => {
        setShowCreateForm(true)
    }

    const handleImport = () => {
        alert("Import is a premium feature. Please upgrade to Pro to access this functionality.")
    }

    const handleSaveMultipleChoice = (multipleChoiceSet: any) => {
        console.log("Saved multiple choice set:", multipleChoiceSet)
        setShowCreateForm(false)
        setEditingSet(null)
        // Here you would add the new set to your list
    }

    const handleEditSet = (set: any) => {
        setEditingSet(set)
        setShowCreateForm(true)
    }

    const handleDeleteSet = (setId: string) => {
        if (confirm("Are you sure you want to delete this multiple choice set?")) {
            console.log("Deleting set:", setId)
            // Here you would implement the actual delete logic
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Multiple Choice Management</DialogTitle>
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
                        <Input placeholder="Search multiple choice sets..." className="pl-10" />
                    </div>

                    {/* Multiple Choice Sets List */}
                    <div className="space-y-3">
                        {multipleChoiceSets.map((set) => (
                            <div key={set.id} className="p-4 border border-gray-200 rounded-lg">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h4 className="font-medium">{set.name}</h4>
                                            <Badge variant={set.active ? "default" : "secondary"}>{set.active ? "Active" : "Inactive"}</Badge>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">{set.description}</p>
                                        <p className="text-sm text-gray-500">
                                            {set.questionCount} question{set.questionCount !== 1 ? "s" : ""}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline" onClick={() => handleEditSet(set)}>
                                            Edit
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={() => handleDeleteSet(set.id)}>
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
            <CreateMultipleChoiceForm
                isOpen={showCreateForm}
                onClose={() => {
                    setShowCreateForm(false)
                    setEditingSet(null)
                }}
                onSave={handleSaveMultipleChoice}
                editingSet={editingSet}
            />
        </Dialog>
    )
}
