import { useParams, Navigate } from "react-router-dom";
import useFolder from "@/hooks/useFolder";
import SubFolder from "../sub-folder";
import useAuth from "@/hooks/useAuth";

function PrivateSubFolder() {
  const { folderId } = useParams();
  const { data, isPending, isError, error } = useFolder(folderId);
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  return (
    <SubFolder
      data={data}
      isPending={isPending}
      isError={isError}
      error={error}
    />
  );
}

export default PrivateSubFolder;
