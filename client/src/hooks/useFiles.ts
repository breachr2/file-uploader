import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getFiles } from "@/api/file-api";
import useAuth from "./useAuth";

const useFiles = (searchParams?: URLSearchParams) => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ["public-files", searchParams?.toString()],
    queryFn: () => getFiles(searchParams),
    enabled: !!isAuthenticated,
    placeholderData: keepPreviousData,
  });
};

export default useFiles;
