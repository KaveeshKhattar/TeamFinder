import { createContext, ReactNode, useState } from "react";

interface AuthContextType {
    isSignedIn: boolean;
    signIn: () => void;
    signOut: () => void;
}


// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isSignedIn, setIsSignedIn] = useState<boolean>(() => {
        // Check localStorage for the auth state on page load
        const savedAuthState = localStorage.getItem("isSignedIn");
        return savedAuthState === "true" ? true : false;
    });
  
    const signIn = () => {
      setIsSignedIn(true);
      localStorage.setItem("isSignedIn", "true"); // Persist in localStorage
    };
  
    const signOut = () => {
      setIsSignedIn(false);
      localStorage.removeItem("isSignedIn"); // Persist in localStorage
    };
  
    return (
      <AuthContext.Provider value={{ isSignedIn, signIn, signOut }}>
        {children}
      </AuthContext.Provider>
    );
};

export default AuthContext;