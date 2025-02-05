import useFiles from "@/hooks/useFiles";
import useFolders from "@/hooks/useFolders";
import FolderItem from "@/components/folder-item";
import FileItem from "@/components/file-item";
import { Navigate, useOutletContext } from "react-router-dom";
import FolderSkeleton from "@/components/folder-skeleton";
import useAuth from "@/hooks/useAuth";
import { OutletContext } from "@/lib/types";
import { Link } from "react-router-dom";
import { Folder } from "lucide-react";

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
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-semibold">Folders</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {folders.data?.map((folder) => (
          <Link
            key={folder.id}
            to={`/folders/${folder.id}`}
            className="block p-4 rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center mb-2 gap-2">
              <Folder className="text-red-500" size={24} />
              <h2>{folder.name}</h2>
            </div>
            <div className="flex items-center text-sm text-gray-500 gap-1">
              <Folder size={16} />
              <span>{folder.files.length} items </span>
            </div>
          </Link>
        ))}
      </div>
      <h3 className="text-lg font-semibold">Public Files</h3>
      <div className="bg-white rounded-lg shadow-mg">
        {files.data?.map((file) => (
          <FileItem key={file.id} file={file} />
        ))}
      </div>
      {/* {folders.data?.map((folder) => (
        <FolderItem key={folder.id} folder={folder} />
      ))}
      {files.data?.map((file) => (
        <FileItem key={file.id} file={file} />
      ))} */}
    </div>
  );
}

export default PrivateFolder;
