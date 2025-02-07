import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getFolder } from "@/api/folder-api";
import useAuth from "./useAuth";

const useFolder = (
  folderId: string | undefined,
  searchParams?: URLSearchParams
) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: [
      "folder",
      folderId,
      searchParams?.toString(),
      { isAuthenticated },
    ],
    queryFn: () => getFolder(folderId, searchParams),
    enabled: isAuthenticated && !!folderId,
    placeholderData: keepPreviousData,
  });
};

export default useFolder;
