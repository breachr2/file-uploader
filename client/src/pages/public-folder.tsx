import { useContext } from "react";
import { AuthContext } from "@/context/auth-context";
import useFiles from "@/hooks/useFiles";
import useFolders from "@/hooks/useFolders";
import FolderItem from "@/components/folder-item";
import FileItem from "@/components/file-item";

function PublicFolder() {
  const { isAuthenticated } = useContext(AuthContext);
  const foldersResult = useFolders();
  const filesResult = useFiles(isAuthenticated);

  if (foldersResult.isError) {
    return <div className="text-center">{foldersResult.error.message}</div>;
  }

  if (filesResult.isError) {
    return <div className="text-center">{filesResult.error.message}</div>;
  }

  if (foldersResult.isLoading || filesResult.isLoading) {
    return <p>Loading...</p>;
  }

  if (!isAuthenticated) {
    return <div className="flex flex-col gap-2">Login to get started</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      {foldersResult.data &&
        foldersResult.data.map((folder) => (
          <FolderItem key={folder.id} folder={folder} />
        ))}
      {filesResult.data &&
        filesResult.data.map((file) => <FileItem key={file.id} file={file} />)}
    </div>
  );
}

export default PublicFolder;
