export default interface ApplicantModel {
    id: string;
    uid: string;
    firstName: string;
    surname: string;
    birthdate: string;
    birthplace: string | null;
    gender: "Male" | "Female";
    levelOfEducation: string;
    yearsOfExperience: string;
    email: string;
    phoneCountryCode: string;
    phoneNumber: string;
    faydaNumber: string | null;
    tinNumber: string | null;

    // step 2
    cvDocument: {
        id: string;
        name: string;
        type: "CV";
        url: string;
        uploadedAt: string;
    } | null;
    workExperienceSummary: string | null;
    desiredPosition: string | null;
    expectedSalary: string | null;
    professionalExperiences: ProfessionalExperience[];
    educationExperiences: EducationExperience[];
    skills: string[];
    languages: string[];
    certifications: string[];
    photo: string | null;
}

export interface ProfessionalExperience {
    id: string;
    companyName: string;
    title: string;
    startDate: string;
    endDate: string | null;
    currentlyWorking: boolean;
    mainActivities: string;
    reference: string;
}

export interface EducationExperience {
    id: string;
    startDate: string;
    endDate: string | null;
    currentlyStudying: boolean;
    educationLevel: string;
    title: string;
    school: string;
}