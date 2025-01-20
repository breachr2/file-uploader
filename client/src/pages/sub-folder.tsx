import FileItem from "@/components/file-item";
import { Skeleton } from "@/components/ui/skeleton";
import { Folder } from "@/lib/types";

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
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="rounded-sm h-8" />
        ))}
      </div>
    );
  }

  if (!data) {
    return <div>This folder is empty</div>;
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
