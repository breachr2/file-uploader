import { useQuery } from "@tanstack/react-query";
import { Folder, File } from "@/lib/types";
import { API_URL } from "@/lib/constants";

const fetchFolderById = async (folderId: string): Promise<File[]> => {
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

const useFolder = (folderId: string) => {
  return useQuery({
    queryKey: ["folder", folderId],
    queryFn: () => fetchFolderById(folderId),
  });
};

export default useFolder;
