import { useParams, Navigate, useSearchParams } from "react-router-dom";
import useFolder from "@/hooks/useFolder";
import SubFolder from "../sub-folder";
import useAuth from "@/hooks/useAuth";
import FolderSkeleton from "@/components/folder-skeleton";

function PrivateSubFolder() {
  const [searchParams] = useSearchParams();
  const { folderId } = useParams();
  const { data, isPending, isError, error } = useFolder(folderId, searchParams);
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  if (isPending) {
    return <FolderSkeleton />;
  }

  if (isError) {
    return <h1 className="text-center">{(error as Error).message}</h1>;
  }

  return <SubFolder folder={data} />;
}

export default PrivateSubFolder;
