import { deleteDoc, doc, DocumentData, getDocs, query, QuerySnapshot, setDoc, updateDoc, where } from "firebase/firestore";
import { jobPostCollection, matchingCriteriaCollection } from "../firebase/collections";
import { db } from "../firebase/init";
import MatchingCriteriaModel from "@/models/matching-criteria";

const collectionRef = matchingCriteriaCollection;
const collectionName = collectionRef.id;

export async function createMatchingCriteria(data: Omit<MatchingCriteriaModel, "id">) {

    const docRef = doc(collectionRef);

    await setDoc(docRef, { ...data, id: docRef.id })
        .then(() => {
        })
        .catch((err) => {
            console.log("err", err);
            return false;
        })

    return await getMatchingCriteria(data.uid);
}

export async function getMatchingCriteriaAll() {
    const q = query(collectionRef);

    const response: MatchingCriteriaModel[] = await getDocs(q)
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

export async function getMatchingCriteriaCreatedByUser(uid: string) {
    const q = query(collectionRef);

    const response: MatchingCriteriaModel[] = await getDocs(q)
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

export async function getMatchingCriteria(id: string) {
    const q = query(collectionRef, where("id", "==", id));

    const response: MatchingCriteriaModel | null = await getDocs(q)
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

export async function updateMatchingCriteria(data: Partial<MatchingCriteriaModel>) {
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

export async function deleteMatchingCriteria(id: string) {
    let result: boolean = await deleteDoc(doc(db, collectionName, id))
        .then(() => {
            return true;
        })
        .catch(() => {
            return false;
        });

    return result;
}
