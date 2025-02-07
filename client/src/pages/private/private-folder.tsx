import useFiles from "@/hooks/useFiles";
import useFolders from "@/hooks/useFolders";
import { Navigate } from "react-router-dom";
import FolderSkeleton from "@/components/folder-skeleton";
import useAuth from "@/hooks/useAuth";
import FileList from "@/components/file-list";
import { useSearchParams } from "react-router-dom";
import FolderItem from "@/components/folder-item";

function PrivateFolder() {
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
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
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-semibold">Folders</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {folders.data.map((folder) => (
          <FolderItem key={folder.id} folder={folder} />
        ))}
      </div>
      {files.data.length > 0 && (
        <>
          <h3 className="text-lg font-semibold">Public Files</h3>
          <FileList files={files.data} />
        </>
      )}
    </div>
  );
}

export default PrivateFolder;
