import { useQuery } from "@tanstack/react-query";
import { getFolders } from "@/api/folder-api";
import useAuth from "./useAuth";

const useFolders = () => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ["folders", { isAuthenticated }],
    queryFn: getFolders,
    enabled: isAuthenticated,
  });
};

export default useFolders;
