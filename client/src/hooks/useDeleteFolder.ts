import { useMutation } from "@tanstack/react-query";
import { deleteFolder } from "@/api/folder-api";

const useDeleteFolder = () => {
  return useMutation({
    mutationFn: deleteFolder,
  });
};

export default useDeleteFolder;
