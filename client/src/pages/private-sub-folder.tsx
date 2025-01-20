import { useParams, Navigate } from "react-router-dom";
import useFolder from "@/hooks/useFolder";
import { AuthContext } from "@/context/auth-context";
import { useContext } from "react";
import SubFolder from "./sub-folder";

function PrivateSubFolder() {
  const { folderId } = useParams();
  const { data, isPending, isError, error } = useFolder(folderId);
  const { isAuthenticated } = useContext(AuthContext);

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
