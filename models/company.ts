export default interface CompanyModel {
    id: string;
    uid: String;
    companyName: string;
    companyType: string;
    companySize: string;
    country: string;
    cityLocation: string | null;
    officialEmail: string | null;
    officialPhoneCountryCode: string;
    officialPhone: string | null;
    websiteUrl: string | null;
    fullName: string;
    email: string;
    adminPhoneCountryCode: string;
    adminPhone: string;
    tinNumber: string;
    businessLicenseDocument: DocumentModel | null;
    companyLogoDocument: DocumentModel | null;
    companyLogoUrl: string | null;
}

export interface DocumentModel {
    id: string;
    name: string;
    type: "business license" | "company logo";
    url: string;
    uploadedAt: string;
}