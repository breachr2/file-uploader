import { API_URL } from "@/lib/constants";
import { User } from "@/lib/types";

export type FormData = {
  username: "";
  password: "";
  confirmPassword: "";
};

const signin = async (username: string, password: string) => {
  const response = await fetch(`${API_URL}/log-in`, {
    method: "POST",
    body: JSON.stringify({ username, password }),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const res = await response.json();
    throw new Error(res);
  }
  return response.json();
};

const signup = async (formData: FormData) => {
  if (formData.password !== formData.confirmPassword) {
    throw new Error("Passwords do not match");
  }
  const response = await fetch(`${API_URL}/sign-up`, {
    method: "POST",
    body: JSON.stringify({ formData }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const res = await response.json();
    throw new Error(res.error);
  }

  return response.json();
};

const logout = async () => {
  const response = await fetch(`${API_URL}/log-out`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Logout Failed");
  }
  return response.json();
};

const getAuthStatus = async (): Promise<{
  isAuthenticated: boolean;
  user: User | null;
}> => {
  const response = await fetch(`${API_URL}/auth/status`, {
    credentials: "include",
  });
  return response.json();
};

export { signin, signup, logout, getAuthStatus };
