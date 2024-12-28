import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "@/lib/constants";

type UpdateFolderType = {
  folderId: string | undefined;
  folderName?: string;
  expiresAt?: string;
};

const updateFolder = async ({
  folderId,
  folderName,
  expiresAt,
}: UpdateFolderType) => {
  
  const updateFields: Record<string, any> = {};
  if (folderName) updateFields.folderName = folderName;
  if (expiresAt) updateFields.expiresAt = expiresAt;

  console.log(updateFields)

  const response = await fetch(`${API_URL}/folders/${folderId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(updateFields),
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
