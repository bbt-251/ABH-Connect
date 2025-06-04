import { collection } from "firebase/firestore";
import { db } from "./init";

export const usersCollection = collection(db, "users");
