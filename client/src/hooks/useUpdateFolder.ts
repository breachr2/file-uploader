import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateFolder } from "@/api/folder-api";

const useUpdateFolder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateFolder,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      queryClient.invalidateQueries({
        queryKey: ["folder", variables.folderId],
      });
    },
  });
};

export default useUpdateFolder;
