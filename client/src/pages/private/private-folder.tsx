import useFiles from "@/hooks/useFiles";
import useFolders from "@/hooks/useFolders";
import FolderItem from "@/components/folder-item";
import FileItem from "@/components/file-item";
import { Navigate, useOutletContext } from "react-router-dom";
import FolderSkeleton from "@/components/folder-skeleton";
import useAuth from "@/hooks/useAuth";
import { OutletContext } from "@/lib/types";

function PrivateFolder() {
  const { isAuthenticated } = useAuth();
  const { searchParams } = useOutletContext<OutletContext>();
  const folders = useFolders();
  const files = useFiles(searchParams);

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  if (folders.isError) {
    return <div className="text-center">{folders.error.message}</div>;
  }

  if (files.isError) {
    return <div className="text-center">{files.error.message}</div>;
  }

  if (folders.isPending || files.isPending) {
    return <FolderSkeleton />;
  }

  return (
    <div className="flex flex-col gap-2">
      {folders.data?.map((folder) => (
        <FolderItem key={folder.id} folder={folder} />
      ))}
      {files.data?.map((file) => (
        <FileItem key={file.id} file={file} />
      ))}
    </div>
  );
}

export default PrivateFolder;
