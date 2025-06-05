import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/api/firebase/init";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/api/firebase/init"; // Ensure you import your Firestore instance
import CompanyModel from "@/models/company";
import ApplicantModel from "@/models/applicant";
import { LoggedInUser } from "@/hooks/auth/useLogin";
import { getCompany } from "@/lib/api/user/company-service";
import { getApplicant } from "@/lib/api/user/applicant-service";

interface AuthContextType {
    user: User | null;
    authLoading: boolean;
    userData: LoggedInUser | null;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    authLoading: true,
    userData: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [userData, setUserData] = useState<LoggedInUser | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);

            if (user) {
                try {

                    // fetch from company collection. if not found, fetch from applicant collection
                    const company = await getCompany(user.uid);
                    const applicant = await getApplicant(user.uid);

                    setUserData({ company, applicant });
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    setUserData(null);
                }
            } else {
                setUserData(null);
            }

            setAuthLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, authLoading, userData }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);