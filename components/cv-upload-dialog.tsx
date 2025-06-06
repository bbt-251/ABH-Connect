import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/context/toastContext";
import React, { useState } from "react";

interface CVUploadDialogProps {
    open: boolean; // Control the open state of the dialog
    setOpen: (val: boolean) => void;
    setFile: (file: File | null) => void; // State function to update the file in the parent component
    message?: string; // Optional prop to replace the dialog description
    onSubmit: () => void; // Function to be called when the submit button is clicked
}

export default function CVUploadDialog({ open, setOpen, setFile, message, onSubmit }: CVUploadDialogProps) {
    const [cvFile, setCvFile] = useState<File | null>(null);
    const { showToast } = useToast();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            console.log("CV selected:", file.name);

            // Validate file type
            const validExtensions = [".pdf"];
            const fileExtension = file.name.split(".").pop()?.toLowerCase();

            if (!validExtensions.includes(`.${fileExtension}`)) {
                showToast("Invalid file type. Please upload a PDF file.", "Error", "error");
                setCvFile(null);
                setFile(null); // Update parent state
                return;
            }

            setCvFile(file);
            setFile(file); // Update parent state
        }
    };

    const handleSubmit = () => {
        if (!cvFile) {
            showToast("Please upload a CV file before submitting.", "Error", "error");
            return;
        }

        onSubmit(); // Call the parent-provided onSubmit function
        setOpen(false); // Close the dialog
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload Your CV</DialogTitle>
                    <DialogDescription>
                        {message || "Upload your CV file to automatically fill in your information."}
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors bg-gray-50 mt-1">
                        <input
                            type="file"
                            id="cv-upload"
                            accept=".pdf"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <label htmlFor="cv-upload" className="cursor-pointer">
                            <div className="flex flex-col items-center space-y-2">
                                <div className="w-10 h-10 text-gray-400">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                        />
                                    </svg>
                                </div>
                                <div className="text-sm text-gray-600">
                                    {
                                        cvFile ?
                                            <>
                                                <span className="font-medium">
                                                    {cvFile.name}
                                                </span>
                                            </>
                                            :
                                            <>
                                                <span className="font-medium">
                                                    Click to upload
                                                </span> or drag and drop
                                            </>
                                    }
                                </div>
                                <div className="text-xs text-gray-400">PDF (max 5MB)</div>
                            </div>
                        </label>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        className="bg-[#d2f277] text-black hover:bg-[#c2e267]"
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}