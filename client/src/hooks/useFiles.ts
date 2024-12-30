import { useQuery } from "@tanstack/react-query";
import { getFiles } from "@/api/file-api";

const useFiles = (isAuthenticated: boolean) => {
  return useQuery({
    queryKey: ["public-files", { isAuthenticated }],
    queryFn: getFiles,
    enabled: isAuthenticated,
  });
};

export default useFiles;
