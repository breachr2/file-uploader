import { useQuery } from "@tanstack/react-query";
import { Folder } from "@/lib/types";
import { API_URL } from "@/lib/constants";

const fetchFolderById = async (
  folderId: string | undefined
): Promise<Folder> => {
  const response = await fetch(`${API_URL}/folders/${folderId}`, {
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    console.log(error);
    throw new Error(error);
  }

  return response.json();
};

const useFolder = (folderId: string | undefined, isAuthenticated: boolean) => {
  return useQuery({
    queryKey: ["folder", folderId, { isAuthenticated }],
    queryFn: () => fetchFolderById(folderId),
    enabled: isAuthenticated && !!folderId,
  });
};

export default useFolder;
