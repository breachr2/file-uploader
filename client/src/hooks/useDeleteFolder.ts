import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { deleteFolder } from "@/api/folder-api";

const useDeleteFolder = (folderId: string) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: () => deleteFolder(folderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      navigate("/folders");
    },
  });
};

export default useDeleteFolder;
