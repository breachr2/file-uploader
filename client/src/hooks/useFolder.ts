import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "@/context/auth-context";
import { useContext } from "react";
import { getFolder } from "@/api/folder-api";

const useFolder = (folderId: string | undefined) => {
  const { isAuthenticated } = useContext(AuthContext);

  return useQuery({
    queryKey: ["folder", folderId, { isAuthenticated }],
    queryFn: () => getFolder(folderId),
    enabled: isAuthenticated && !!folderId,
  });
};

export default useFolder;
