import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFile } from "@/api/file-api";

const useCreateFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFile,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      if (variables.folderId) {
        queryClient.invalidateQueries({
          queryKey: ["folder", variables.folderId],
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ["public-files"] });
      }
    },
  });
};

export default useCreateFile;
