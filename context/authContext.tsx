import { LoggedInUser } from "@/hooks/auth/useLogin";
import { auth } from "@/lib/api/firebase/init";
import { getApplicant } from "@/lib/api/user/applicant-service";
import { getCompany } from "@/lib/api/user/company-service";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
    user: User | null;
    authLoading: boolean;
    userData: LoggedInUser | null;
    signout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    authLoading: true,
    userData: null,
    signout: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [userData, setUserData] = useState<LoggedInUser | null>(null);

    const router = useRouter();
    const signout = async () => {
        try {
            await signOut(auth); // Firebase sign-out
            setUser(null); // Clear user state
            setUserData(null); // Clear user data
            router.push("/auth"); // Redirect to auth page
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

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
        <AuthContext.Provider value={{ user, authLoading, userData, signout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);