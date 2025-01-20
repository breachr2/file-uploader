import FileItem from "@/components/file-item";
import useFolder from "@/hooks/useFolder";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "@/context/auth-context";
import { Skeleton } from "@/components/ui/skeleton";

function SubFolder() {
  const { folderId } = useParams();
  const { isAuthenticated } = useContext(AuthContext);
  const { data, isPending, isError, error } = useFolder(
    folderId,
  );

  if (isError) {
    return <h1 className="text-center">{error.message}</h1>;
  }

  if (!isAuthenticated) {
    return <h1 className="text-center">Log in to get started</h1>;
  }

  if (isPending) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="rounded-sm h-8" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {data.files.map((file) => (
        <FileItem key={file.id} file={file} />
      ))}
      {data.files.length === 0 && (
        <h1 className="text-center">This folder is empty...</h1>
      )}
    </div>
  );
}

export default SubFolder;
