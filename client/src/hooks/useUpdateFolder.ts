import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "@/lib/constants";

type UpdateFolderType = {
  folderId: string | undefined;
  folderName?: string;
};

const updateFolder = async ({ folderId, folderName }: UpdateFolderType) => {
  const response = await fetch(`${API_URL}/folders/${folderId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ folderName }),
  });

  if (!response.ok) {
    const res = await response.json();
    throw new Error(res || "An error has occured creating a folder");
  }

  return response.json();
};

const useUpdateFolder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      queryClient.invalidateQueries({ queryKey: ["folder"] });
    },
  });
};

export default useUpdateFolder;
