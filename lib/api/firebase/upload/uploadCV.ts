import CompanyModel, { DocumentModel } from "@/models/company"
import dayjs from "dayjs"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { v4 as uuidv4 } from "uuid"
import { timestampFormat } from '../../dayjs_format'
import { db, storage } from "../init"
import ApplicantModel from "@/models/applicant"

export async function uploadCV(
    id: string,
    file: File,
): Promise<DocumentModel> {
    try {
        // Generate a unique ID for the document
        const documentId = uuidv4()
        const fileName = `${documentId}-${file.name}`
        const filePath = `cv/${id}/${fileName}`

        // Create a storage reference
        const storageRef = ref(storage, filePath)

        // Convert File to ArrayBuffer
        const arrayBuffer = await file.arrayBuffer()
        const bytes = new Uint8Array(arrayBuffer)

        // Upload the file
        await uploadBytes(storageRef, bytes, {
            contentType: file.type,
        })

        // Get the download URL
        const downloadUrl = await getDownloadURL(storageRef)

        // Create the document object
        const document = {
            id: documentId,
            name: file.name,
            type: "CV" as any,
            url: downloadUrl,
            uploadedAt: dayjs().format(timestampFormat),
        }

        // Add the document to the project's documents array
        const applicantRef = doc(db, "applicant", id)
        const applicantSnap = await getDoc(applicantRef)

        if (applicantSnap.exists()) {
            const applicantData = applicantSnap.data() as ApplicantModel
            let oldCV = applicantData.cvDocument;

            // If there's an old logo, delete it from storage
            if (oldCV) {
                const oldCVRef = ref(storage, oldCV.url);
                await deleteObject(oldCVRef);
            }

            // Update the project
            await updateDoc(applicantRef, {
                cvDocument: document,
            })

            return document
        } else {
            throw new Error("Applicant not found")
        }
    } catch (error) {
        console.error("Error uploading applicant cv document:", error)
        throw error
    }
}