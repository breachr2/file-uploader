import React, { createContext, useEffect, useState } from "react";
import { API_URL } from "@/lib/constants";
import { User } from "@/lib/types";

type AuthStatus = {
  isAuthenticated: boolean;
  user: User | null;
};

type AuthContextType = {
  authStatus: AuthStatus;
  setAuthStatus: React.Dispatch<React.SetStateAction<AuthStatus>>;
};

export const AuthContext = createContext<AuthContextType>({
  authStatus: { isAuthenticated: false, user: null },
  setAuthStatus: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authStatus, setAuthStatus] = useState<AuthStatus>({
    isAuthenticated: false,
    user: null,
  });

  useEffect(() => {
    const fetchAuthStatus = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/status`, {
          credentials: "include",
        });
        const data = await response.json();
        setAuthStatus(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ authStatus, setAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
}
