import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFile } from "@/api/file-api";

const useDeleteFile = (fileId: number, folderId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteFile(fileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["public-files"] });
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      if (folderId) {
        queryClient.invalidateQueries({ queryKey: ["folder", folderId] });
      }
    },
  });
};

export default useDeleteFile;
