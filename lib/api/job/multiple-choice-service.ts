import MultipleChoiceModel from "@/models/multiple-choice";
import { deleteDoc, doc, DocumentData, getDocs, query, QuerySnapshot, setDoc, updateDoc, where } from "firebase/firestore";
import { multipleChoiceCollection } from "../firebase/collections";
import { db } from "../firebase/init";

const collectionRef = multipleChoiceCollection;
const collectionName = collectionRef.id;

export async function createMultipleChoice(data: Omit<MultipleChoiceModel, "id">) {

    const docRef = doc(collectionRef);

    await setDoc(docRef, { ...data, id: docRef.id })
        .then(() => {
        })
        .catch((err) => {
            console.log("err", err);
            return false;
        })

    return await getMultipleChoice(data.uid);
}

export async function getMultipleChoices() {
    const q = query(collectionRef);

    const response: MultipleChoiceModel[] = await getDocs(q)
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

export async function getMultipleChoicesCreatedByUser(uid: string) {
    const q = query(collectionRef);

    const response: MultipleChoiceModel[] = await getDocs(q)
        .then((snapshot: QuerySnapshot<DocumentData>) => {
            const data: any[] = [];
            snapshot.docs.map((doc) => {
                data.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            return data.filter(doc => doc.uid === uid);
        })
        .catch((e: any) => {
            console.log("err: ", e);
            return [];
        });

    return response;
}

export async function getMultipleChoice(id: string) {
    const q = query(collectionRef, where("id", "==", id));

    const response: MultipleChoiceModel | null = await getDocs(q)
        .then((snapshot: QuerySnapshot<DocumentData>) => {
            const data: any[] = [];
            snapshot.docs.map((doc) => {
                data.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            return data.find(c => c.id === id);
        })
        .catch((e: any) => {
            console.log("err: ", e);
            return null;
        });

    return response;
}

export async function updateMultipleChoice(data: Partial<MultipleChoiceModel>) {
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

export async function deleteMultipleChoice(id: string) {
    let result: boolean = await deleteDoc(doc(db, collectionName, id))
        .then(() => {
            return true;
        })
        .catch(() => {
            return false;
        });

    return result;
}
