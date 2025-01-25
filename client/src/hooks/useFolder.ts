import { useQuery } from "@tanstack/react-query";
import { getFolder } from "@/api/folder-api";
import useAuth from "./useAuth";

const useFolder = (folderId: string | undefined) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["folder", folderId, { isAuthenticated }],
    queryFn: () => getFolder(folderId),
    enabled: isAuthenticated && !!folderId,
  });
};

export default useFolder;
