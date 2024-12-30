import { useMutation } from "@tanstack/react-query";
import { createFile } from "@/api/file-api";

const useCreateFile = () => {
  return useMutation({
    mutationFn: createFile,
  });
};

export default useCreateFile;
