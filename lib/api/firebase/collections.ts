import { collection } from "firebase/firestore";
import { db } from "./init";

export const companyCollection = collection(db, "company");
export const applicantCollection = collection(db, "applicant");
