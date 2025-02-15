import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFolder } from "@/api/folder-api";

const useDeleteFolder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });
};

export default useDeleteFolder;
