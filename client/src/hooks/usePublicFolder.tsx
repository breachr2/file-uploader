import { useQuery } from "@tanstack/react-query";
import { getPublicFolder } from "@/api/public-folder-api";

const usePublicFolder = (
  folderSlug: string | undefined,
  searchParams?: URLSearchParams
) => {
  return useQuery({
    queryKey: ["public-folder", searchParams?.toString(), folderSlug],
    queryFn: () => getPublicFolder(folderSlug, searchParams),
  });
};

export default usePublicFolder;
