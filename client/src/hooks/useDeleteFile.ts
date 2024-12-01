import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "@/lib/constants";

const deleteFile = async (fileId: number) => {
  const response = await fetch(`${API_URL}/files/${fileId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const res = await response.json();
    throw new Error(res || "Error occured deleting folder");
  }
  return response.json();
};

const useDeleteFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["public-files"] });
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });
};

export default useDeleteFile;
