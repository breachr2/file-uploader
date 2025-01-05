import { useQuery } from "@tanstack/react-query";
import { getFiles } from "@/api/file-api";
import { useContext } from "react";
import { AuthContext } from "@/context/auth-context";

const useFiles = () => {
  const { isAuthenticated } = useContext(AuthContext);
  return useQuery({
    queryKey: ["public-files", { isAuthenticated }],
    queryFn: getFiles,
    enabled: isAuthenticated,
  });
};

export default useFiles;
