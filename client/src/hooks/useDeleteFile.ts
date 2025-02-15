import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFile } from "@/api/file-api";

const useDeleteFile = (folderId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFile,
    onSuccess: () => {
      if (folderId) {
        queryClient.invalidateQueries({
          queryKey: ["folder", folderId],
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ["public-files"] });
      }
    },
  });
};

export default useDeleteFile;
