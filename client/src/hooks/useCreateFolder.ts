import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFolder } from "@/api/folder-api";

const useCreateFolder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });
};

export default useCreateFolder;
