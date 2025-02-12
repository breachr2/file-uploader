import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFolder } from "@/api/folder-api";

const useCreateFolder = () => {
  return useMutation({
    mutationFn: createFolder,
  });
};

export default useCreateFolder;
