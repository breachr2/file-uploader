import useFiles from "@/hooks/useFiles";
import useFolders from "@/hooks/useFolders";
import FolderItem from "@/components/folder-item";
import FileItem from "@/components/file-item";
import { useContext } from "react";
import { AuthContext } from "@/context/auth-context";
import { Navigate } from "react-router-dom";
import FolderSkeleton from "@/components/folder-skeleton";

function RootFolder() {
  const { isAuthenticated } = useContext(AuthContext);
  const folders = useFolders();
  const files = useFiles();

  if (!isAuthenticated) {
    return <Navigate to={"/auth"} />;
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

export default RootFolder;
