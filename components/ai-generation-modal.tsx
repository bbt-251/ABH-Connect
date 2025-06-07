"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"

interface AIGenerationModalProps {
    isOpen: boolean
    onClose: () => void
    onGenerate: (params: AIGenerationParams) => void
}

interface AIGenerationParams {
    numberOfQuestions: number
    numberOfChoices: number
    knowledgeArea: string
    complexityLevel: number
}

export default function AIGenerationModal({ isOpen, onClose, onGenerate }: AIGenerationModalProps) {
    const [numberOfQuestions, setNumberOfQuestions] = useState("")
    const [numberOfChoices, setNumberOfChoices] = useState("")
    const [knowledgeArea, setKnowledgeArea] = useState("")
    const [complexityLevel, setComplexityLevel] = useState("")

    const handleGenerate = () => {
        const params: AIGenerationParams = {
            numberOfQuestions: Number.parseInt(numberOfQuestions),
            numberOfChoices: Number.parseInt(numberOfChoices),
            knowledgeArea,
            complexityLevel: Number.parseInt(complexityLevel),
        }
        onGenerate(params)
    }

    const handleDone = () => {
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="flex flex-row items-center justify-between">
                    <DialogTitle>Generated AI Results</DialogTitle>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="numQuestions">
                            <span className="text-red-500">*</span> Number of Questions
                        </Label>
                        <Input
                            id="numQuestions"
                            value={numberOfQuestions}
                            onChange={(e) => setNumberOfQuestions(e.target.value)}
                            type="number"
                            min="1"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="numChoices">
                            <span className="text-red-500">*</span> Number of Choices for a Given Question
                        </Label>
                        <Input
                            id="numChoices"
                            value={numberOfChoices}
                            onChange={(e) => setNumberOfChoices(e.target.value)}
                            type="number"
                            min="2"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="knowledgeArea">
                            <span className="text-red-500">*</span> What specific Area of knowledge do you want to assess in the
                            applicant?
                        </Label>
                        <Textarea
                            id="knowledgeArea"
                            value={knowledgeArea}
                            onChange={(e) => setKnowledgeArea(e.target.value)}
                            placeholder="Be Specific"
                            rows={4}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="complexity">
                            <span className="text-red-500">*</span> Level of Complexity (From scale of 1 to 5 - 1 is simple and 5 is
                            very hard)
                        </Label>
                        <Input
                            id="complexity"
                            value={complexityLevel}
                            onChange={(e) => setComplexityLevel(e.target.value)}
                            type="number"
                            min="1"
                            max="5"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-8">
                    <Button
                        onClick={handleGenerate}
                        disabled={!numberOfQuestions || !numberOfChoices || !knowledgeArea || !complexityLevel}
                    >
                        Generate
                    </Button>
                    <Button variant="outline" onClick={handleDone}>
                        Done
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
