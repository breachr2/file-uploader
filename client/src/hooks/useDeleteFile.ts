import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFile } from "@/api/file-api";

const useDeleteFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["public-files"] });
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      queryClient.invalidateQueries({ queryKey: ["folder"] });
    },
  });
};

export default useDeleteFile;
