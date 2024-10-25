import { jwtDecode } from "jwt-decode";
import { createContext, ReactNode, useCallback, useEffect, useState } from "react";

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

  const signOut = useCallback(() => {
    setIsSignedIn(false);
    localStorage.removeItem("isSignedIn"); // Persist in localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("profileTeams");
  }, []);

  const checkTokenExpiration = useCallback(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const { exp } = jwtDecode<{ exp: number }>(token);
      if (Date.now() >= exp * 1000) {
        signOut();
      }
    }
  }, [signOut]);

  useEffect(() => {
    checkTokenExpiration(); // Initial check
    const interval = setInterval(checkTokenExpiration, 1000 * 60); // Check every minute
    return () => clearInterval(interval); // Clean up interval on unmount
  }, [checkTokenExpiration]);

  return (
    <AuthContext.Provider value={{ isSignedIn, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;