import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "@/lib/constants";
import { useNavigate } from "react-router-dom";

const logout = async () => {
  const response = await fetch(`${API_URL}/log-out`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Logout Failed");
  }
  return response.json();
};

const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth-status"] });
      navigate("/auth");
    },
  });
};

export default useLogout;
