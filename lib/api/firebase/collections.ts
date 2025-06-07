import { collection } from "firebase/firestore";
import { db } from "./init";

export const companyCollection = collection(db, "company");
export const applicantCollection = collection(db, "applicant"); 
export const jobPostCollection = collection(db, "jobPost"); 
export const multipleChoiceCollection = collection(db, "multipleChoice"); 
export const shortAnswerCollection = collection(db, "shortAnswer"); 
export const screeningQuestionCollection = collection(db, "screeningQuestion"); 
