import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { API_URL } from "@/lib/constants";

const deleteFolder = async (folderId: number) => {
  const response = await fetch(`${API_URL}/folders/${folderId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const res = await response.json();
    throw new Error(res || "Error occured deleting folder");
  }
  return response.json();
};

const useDeleteFolder = (folderId: number) => {
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
