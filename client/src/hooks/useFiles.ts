import { useQuery } from "@tanstack/react-query";
import { File } from "@/lib/types";
import { API_URL } from "@/lib/constants";

const fetchFiles = async (): Promise<File[]> => {
  const response = await fetch(`${API_URL}/files}`, {
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    console.log(error);
    throw new Error(error);
  }

  return response.json();
};

const useFiles = () => {
  return useQuery({
    queryKey: ["public-files"],
    queryFn: fetchFiles,
  });
};

export default useFiles;
