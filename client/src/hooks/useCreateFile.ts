import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "@/lib/constants";

type CreateFileType = {
  file: File;
  folderId: string | undefined;
};

const createFile = async ({
  file,
  folderId,
}: CreateFileType): Promise<File> => {
  const formData = new FormData();
  formData.append("file", file);

  if (folderId) {
    formData.append("folderId", folderId);
  }
  const response = await fetch(`${API_URL}/files`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    const res = await response.json();
    throw new Error(res || "Error creating file");
  }

  return response.json();
};

const useCreateFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFile,
    // onSuccess: (_data, variables) => {
    //   const { folderId } = variables;
    //   if (folderId) {
    //     queryClient.invalidateQueries({ queryKey: ["folder", folderId] });
    //     queryClient.invalidateQueries({ queryKey: ["folders"] });
    //   } else {
    //     queryClient.invalidateQueries({ queryKey: ["folders"] });
    //     queryClient.invalidateQueries({ queryKey: ["public-files"] });
    //   }
    // },
  });
};

export default useCreateFile;
