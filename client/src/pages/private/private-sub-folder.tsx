import { useParams, Navigate, useSearchParams } from "react-router-dom";
import useFolder from "@/hooks/useFolder";
import SubFolder from "../sub-folder";
import useAuth from "@/hooks/useAuth";
import ErrorPage from "../error-page";

function PrivateSubFolder() {
  const [searchParams] = useSearchParams();
  const { folderId } = useParams();
  const { data, isPending, isError, error } = useFolder(folderId, searchParams);
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  if (!data) {
    return <ErrorPage>There was an error fetching this folder.</ErrorPage>;
  }

  return (
    <SubFolder
      folder={data}
      isPending={isPending}
      isError={isError}
      error={error}
    />
  );
}

export default PrivateSubFolder;
