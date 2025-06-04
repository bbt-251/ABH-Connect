import { companyCollection } from "../firebase/collections";
import { doc, setDoc, query, getDocs, QuerySnapshot, DocumentData, where, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/init";
import CompanyModel from "@/models/company";

const collectionRef = companyCollection;
const collectionName = collectionRef.id;

export async function createCompany(data: Omit<CompanyModel, "id">) {

    const docRef = doc(collectionRef);

    await setDoc(docRef, { ...data, id: docRef.id })
        .then(() => {
        })
        .catch((err) => {
            console.log("err", err);
            return false;
        })

    return await getCompany(docRef.id);
}

export async function getCompanies() {
    const q = query(collectionRef);

    const response: CompanyModel[] = await getDocs(q)
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

export async function getCompany(uid: string) {
    const q = query(collectionRef, where("uid", "==", uid));

    const response: CompanyModel | null = await getDocs(q)
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

export async function updateCompany(data: Partial<CompanyModel>) {
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

export async function deleteCompany(id: string) {
    let result: boolean = await deleteDoc(doc(db, collectionName, id))
        .then(() => {
            return true;
        })
        .catch(() => {
            return false;
        });

    return result;
}
