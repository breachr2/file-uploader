import { useParams, Navigate } from "react-router-dom";
import useFolder from "@/hooks/useFolder";
import SubFolder from "../sub-folder";
import useAuth from "@/hooks/useAuth";
import { useSearchParams } from "react-router-dom";

function PrivateSubFolder() {
  const [searchParams] = useSearchParams();
  const { folderId } = useParams();
  const { data, isPending, isError, error } = useFolder(folderId, searchParams);
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
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
