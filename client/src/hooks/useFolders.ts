import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "@/context/auth-context";
import { getFolders } from "@/api/folder-api";

const useFolders = () => {
  const { isAuthenticated } = useContext(AuthContext);
  return useQuery({
    queryKey: ["folders", { isAuthenticated }],
    queryFn: getFolders,
    enabled: isAuthenticated,
  });
};

export default useFolders;
