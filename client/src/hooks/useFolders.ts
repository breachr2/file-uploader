import { API_URL } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { Folder } from "@/lib/types";
import { useContext } from "react";
import { AuthContext } from "@/context/auth-context";

const fetchFolders = async (): Promise<Folder[]> => {
  const response = await fetch(`${API_URL}/folders`, {
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    console.log(error);
    throw new Error(error);
  }

  return response.json();
};

const useFolders = () => {
  const { isAuthenticated } = useContext(AuthContext);
  return useQuery({
    queryKey: ["folders", { isAuthenticated }],
    queryFn: fetchFolders,
    enabled: isAuthenticated,
  });
};

export default useFolders;
