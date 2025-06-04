import CompanyModel, { DocumentModel } from "@/models/company"
import dayjs from "dayjs"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { v4 as uuidv4 } from "uuid"
import { timestampFormat } from '../../dayjs_format'
import { db, storage } from "../init"

export async function uploadCompanyLogo(
    id: string,
    file: File,
): Promise<DocumentModel> {
    try {
        // Generate a unique ID for the document
        const documentId = uuidv4()
        const fileName = `${documentId}-${file.name}`
        const filePath = `company_logos/${id}/${fileName}`

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
        const document: DocumentModel = {
            id: documentId,
            name: file.name,
            type: "company logo",
            url: downloadUrl,
            uploadedAt: dayjs().format(timestampFormat),
        }

        // Add the document to the project's documents array
        const companyRef = doc(db, "company", id)
        const companySnap = await getDoc(companyRef)

        if (companySnap.exists()) {
            const companyData = companySnap.data() as CompanyModel
            let oldLogo = companyData.companyLogoDocument;

            // If there's an old logo, delete it from storage
            if (oldLogo) {
                const oldLogoRef = ref(storage, oldLogo.url);
                await deleteObject(oldLogoRef);
            }

            // Update the project
            await updateDoc(companyRef, {
                companyLogoDocument: document,
                companyLogoUrl: downloadUrl,
            })

            return document
        } else {
            throw new Error("Company not found")
        }
    } catch (error) {
        console.error("Error uploading company logo document:", error)
        throw error
    }
}