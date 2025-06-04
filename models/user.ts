export default interface UserModel {
    id: string;
    uid: string;
    createdAt: string;
    updatedAt: string;
    firstName: string;
    lastName: string;
    birthdate: string;
    birthplace: string | null;
    gender: "Male" | "Female";
    levelOfEducation: typeof educationLevels[number] | null;
    yearsOfExperience: typeof experienceYears[number] | null;
    email: string;
    phoneNumber: string;
    faydaNumber: string | null;
    tinNumber: string | null;
}

// Reference data
const educationLevels = [
    "Primary Education",
    "Secondary Education",
    "Certificate",
    "Diploma",
    "Bachelor's Degree",
    "Master's Degree",
    "PhD/Doctorate",
    "Professional Certification",
    "Other",
]

const experienceYears = [
    "Fresh Graduate (0 years)",
    "1-2 years",
    "3-5 years",
    "6-10 years",
    "11-15 years",
    "16-20 years",
    "20+ years",
]