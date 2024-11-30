import { API_URL } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { Folder } from "@/lib/types";

const fetchFolders = async (): Promise<Folder[]> => {
  const response = await fetch(`${API_URL}/folders`, {
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    console.log(error);
    throw new Error(error);
  }

  return response.json();
};

const useFolders = () => {
  return useQuery({
    queryKey: ["folders"],
    queryFn: fetchFolders,
  });
};

export default useFolders;
