// hooks/useLogin.ts
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/api/firebase/init';
import { getCompany } from '@/lib/api/user/company-service';
import { getApplicant } from '@/lib/api/user/applicant-service';
import CompanyModel from '@/models/company';
import ApplicantModel from '@/models/applicant';

interface LoginProps {
    email: string;
    password: string;
}

interface LoginHook {
    login: (props: LoginProps) => Promise<any>;
    isLoading: boolean;
    error: string | null;
}

export interface LoggedInUser {
    company: CompanyModel | null;
    applicant: ApplicantModel | null;
}

export const useLogin = (): LoginHook => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = async ({ email, password }: LoginProps) => {
        setIsLoading(true);
        setError(null);

        let returnData: LoggedInUser | null = null;

        try {
            const user = await signInWithEmailAndPassword(auth, email, password);

            // fetch from company collection. if not found, fetch from applicant collection
            const company = await getCompany(user.user.uid);
            const applicant = await getApplicant(user.user.uid);

            returnData = {
                company: company,
                applicant: applicant,
            };

        } catch (err) {
            let errorMessage = 'Login failed. Please try again.';

            if (err instanceof Error) {
                switch (err.message) {
                    case 'Firebase: Error (auth/invalid-email).':
                        errorMessage = 'Invalid email address.';
                        break;
                    case 'Firebase: Error (auth/user-disabled).':
                        errorMessage = 'This account has been disabled.';
                        break;
                    case 'Firebase: Error (auth/user-not-found).':
                        errorMessage = 'No account found with this email.';
                        break;
                    case 'Firebase: Error (auth/wrong-password).':
                        errorMessage = 'Incorrect password.';
                        break;
                    case 'Firebase: Error (auth/too-many-requests).':
                        errorMessage = 'Too many attempts. Try again later.';
                        break;
                }
            }

            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }

        return returnData;
    };

    return { login, isLoading, error };
};