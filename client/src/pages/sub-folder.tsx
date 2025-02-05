import { Folder } from "@/lib/types";
import FolderSkeleton from "@/components/folder-skeleton";
import FileList from "@/components/file-list";

type SubFolderProps = {
  folder: Folder | undefined;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
};

function SubFolder({ folder, isPending, isError, error }: SubFolderProps) {
  if (isError) {
    return <h1 className="text-center">{(error as Error).message}</h1>;
  }

  if (isPending) {
    return (
      <div className="flex flex-col gap-2">
        <FolderSkeleton />
      </div>
    );
  }

  if (!folder) {
    return <div>Faled to fetch folder contents.</div>;
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
