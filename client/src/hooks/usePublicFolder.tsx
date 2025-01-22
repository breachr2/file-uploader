import { useQuery } from "@tanstack/react-query";
import { getPublicFolder } from "@/api/public-folder-api";

const usePublicFolder = (folderSlug: string | undefined) => {
  return useQuery({
    queryKey: ["public-folder", folderSlug],
    queryFn: () => getPublicFolder(folderSlug),
  });
};

export default usePublicFolder;
