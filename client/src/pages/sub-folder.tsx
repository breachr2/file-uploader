import { Folder } from "@/lib/types";
import FolderSkeleton from "@/components/folder-skeleton";
import FileList from "@/components/file-list";
import { useState, useEffect } from "react";

type SubFolderProps = {
  folder: Folder;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
};

function SubFolder({ folder, isPending, isError, error }: SubFolderProps) {
  const [showSkeleton, setShowSkeleton] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isPending) {
      timeout = setTimeout(() => setShowSkeleton(true), 300);
    } else {
      setShowSkeleton(false);
    }
    return () => clearTimeout(timeout);
  }, [isPending]);

  if (isError) {
    return <h1 className="text-center">{(error as Error).message}</h1>;
  }

  if (showSkeleton) {
    return <FolderSkeleton />;
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{folder.name}</h1>
      <FileList files={folder.files} />
      {folder.files.length === 0 && (
        <p className="text-center mt-2">This folder is empty.</p>
      )}
    </div>
  );
}

export default SubFolder;
