import { useMutation } from "@tanstack/react-query";
import { updateFolder } from "@/api/folder-api";

const useUpdateFolder = () => {
  return useMutation({
    mutationFn: updateFolder,
  });
};

export default useUpdateFolder;
