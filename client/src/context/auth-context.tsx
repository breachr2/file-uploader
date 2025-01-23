import React, { createContext } from "react";
import { API_URL } from "@/lib/constants";
import { User } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
};

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const fetchAuthStatus = async (): Promise<AuthContextType> => {
    const response = await fetch(`${API_URL}/auth/status`, {
      credentials: "include",
    });
    return response.json();
  };

  const {
    data: authStatus,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["auth-status"],
    queryFn: fetchAuthStatus,
  });

  if (isPending) {
    return;
  }

  if (isError) {
    return;
  }

  return (
    <AuthContext.Provider value={authStatus}>{children}</AuthContext.Provider>
  );
}
