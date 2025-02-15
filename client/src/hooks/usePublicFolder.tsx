import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getPublicFolder } from "@/api/public-folder-api";

const usePublicFolder = (
  folderSlug: string | undefined,
  searchParams?: URLSearchParams
) => {
  return useQuery({
    queryKey: ["public-folder", folderSlug, searchParams?.toString()],
    queryFn: () => getPublicFolder(folderSlug, searchParams),
    placeholderData: keepPreviousData,
  });
};

export default usePublicFolder;
