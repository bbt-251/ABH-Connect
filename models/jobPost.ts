export default interface JobPostModel {
    id: string;
    createdAt: string;
    jobTitle: string;
    department: string;
    location: string;
    employmentType: string;
    minSalary: string;
    maxSalary: string;
    applicationDeadline: string;
    levelOfEducation: string;
    yearsOfExperience: string;
    jobDescription: string;
    uid: string;

    useScreeningQuestions: boolean;
    selectedScreeningSet: string;

    useCustomCriteria: boolean,
    selectedCriteriaSet: string,
}