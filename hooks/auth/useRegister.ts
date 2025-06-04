// hooks/useRegister.ts
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/api/firebase/init';
import UserModel from '@/models/user';
import { createUser } from '@/lib/api/user/user-service';

interface RegisterProps {
    email: string;
    password: string;
    user: UserModel;
}

interface RegisterHook {
    register: (props: RegisterProps) => Promise<void>;
    isLoading: boolean;
    error: string | null;
}

export const useRegister = (): RegisterHook => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const register = async ({ email, password, user }: RegisterProps) => {
        setIsLoading(true);
        setError(null);

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            
            // Here you would typically save the user data to your database
            await createUser(user);
        } catch (err) {
            let errorMessage = 'Registration failed. Please try again.';

            if (err instanceof Error) {
                switch (err.message) {
                    case 'Firebase: Error (auth/email-already-in-use).':
                        errorMessage = 'Email is already in use.';
                        break;
                    case 'Firebase: Error (auth/invalid-email).':
                        errorMessage = 'Invalid email address.';
                        break;
                    case 'Firebase: Error (auth/weak-password).':
                        errorMessage = 'Password should be at least 6 characters.';
                        break;
                }
            }

            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return { register, isLoading, error };
};