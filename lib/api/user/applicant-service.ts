import { applicantCollection } from "../firebase/collections";
import { doc, setDoc, query, getDocs, QuerySnapshot, DocumentData, where, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/init";
import ApplicantModel from "@/models/applicant";

const collectionRef = applicantCollection;
const collectionName = collectionRef.id;

export async function createApplicant(data: Omit<ApplicantModel, "id">) {

    const docRef = doc(collectionRef);

    await setDoc(docRef, { ...data, id: docRef.id })
        .then(() => {
        })
        .catch((err) => {
            console.log("err", err);
            return false;
        })

    return await getApplicant(data.uid);
}

export async function getApplicants() {
    const q = query(collectionRef);

    const response: ApplicantModel[] = await getDocs(q)
        .then((snapshot: QuerySnapshot<DocumentData>) => {
            const data: any[] = [];
            snapshot.docs.map((doc) => {
                data.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            return data;
        })
        .catch((e: any) => {
            console.log("err: ", e);
            return [];
        });

    return response;
}

export async function getApplicant(uid: string) {
    const q = query(collectionRef, where("uid", "==", uid));

    const response: ApplicantModel | null = await getDocs(q)
        .then((snapshot: QuerySnapshot<DocumentData>) => {
            const data: any[] = [];
            snapshot.docs.map((doc) => {
                data.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            return data.find(c => c.uid === uid);
        })
        .catch((e: any) => {
            console.log("err: ", e);
            return null;
        });

    return response;
}

export async function updateApplicant(data: Partial<ApplicantModel>) {
    let result: boolean = false;

    const docRef = doc(db, collectionName, data.id ?? "");

    result = await updateDoc(docRef, data as any)
        .then(() => true)
        .catch(err => {
            console.log(err);
            return false;
        });

    return result;
}

export async function deleteApplicant(id: string) {
    let result: boolean = await deleteDoc(doc(db, collectionName, id))
        .then(() => {
            return true;
        })
        .catch(() => {
            return false;
        });

    return result;
}
