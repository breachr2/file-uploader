import { useQuery } from "@tanstack/react-query";
import { getAuthStatus } from "@/api/user-api";

const useAuth = () => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["auth-status"],
    queryFn: getAuthStatus,
  });

  if (isError) {
    return { isError: true, error: error.message };
  }
  if (isPending) {
    return { isPending: true, isAuthenticated: false, user: null };
  }

  return { isAuthenticated: data.isAuthenticated, user: data.user };
};

export default useAuth;
