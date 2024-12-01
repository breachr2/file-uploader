import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "@/lib/constants";

const createFolder = async (folderName: string) => {
  const response = await fetch(`${API_URL}/folders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ folderName }),
  });

  if (!response.ok) {
    const res = await response.json();
    throw new Error(res || "An error has occured creating a folder");
  }

  return response.json();
};

const useCreateFolder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"], exact: true });
    },
  });
};

export default useCreateFolder;
