import FileItem from "@/components/file-item";
import { Folder } from "@/lib/types";
import FolderSkeleton from "@/components/folder-skeleton";

type SubFolderProps = {
  data: Folder | undefined;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
};

function SubFolder({ data, isPending, isError, error }: SubFolderProps) {
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

  if (!data) {
    return <div>Faled to fetch folder contents.</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      {data.files.map((file) => (
        <FileItem key={file.id} file={file} />
      ))}
      {data.files.length === 0 && (
        <h1 className="text-center">This folder is empty.</h1>
      )}
    </div>
  );
}

export default SubFolder;
