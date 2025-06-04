import UserModel from "@/models/user";
import { usersCollection } from "../firebase/collections";
import { doc, setDoc, query, getDocs, QuerySnapshot, DocumentData, where, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/init";

const collectionRef = usersCollection;
const collectionName = collectionRef.id;

export async function createUser(data: UserModel) {
    let result: boolean = false;
    
    const docRef = doc(collectionRef);

    result = await setDoc(docRef, { ...data, id: docRef.id })
        .then(() => true)
        .catch((err) => {
            console.log("err", err);
            return false;
        })

    return result;
}

export async function getUsers() {
    const q = query(collectionRef);

    const response: UserModel[] = await getDocs(q)
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

export async function getUser(uid: string) {
    const q = query(collectionRef, where("uid", "==", uid));

    const response: UserModel[] = await getDocs(q)
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

export async function updateUser(data: UserModel) {
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

export async function deleteUser(id: string) {
    let result: boolean = await deleteDoc(doc(db, collectionName, id))
        .then(() => {
            return true;
        })
        .catch(() => {
            return false;
        });

    return result;
}
