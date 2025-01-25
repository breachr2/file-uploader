import { useQuery } from "@tanstack/react-query";
import { getFiles } from "@/api/file-api";
import useAuth from "./useAuth";

const useFiles = () => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ["public-files", { isAuthenticated }],
    queryFn: getFiles,
    enabled: isAuthenticated,
  });
};

export default useFiles;
