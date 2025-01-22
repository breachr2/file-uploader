import usePublicFolder from "@/hooks/usePublicFolder";
import { useParams } from "react-router-dom";
import FolderItem from "@/components/folder-item";
import FolderSkeleton from "@/components/folder-skeleton";

function PublicFolder() {
  const { folderSlug } = useParams();
  const { data, isPending, isError, error } = usePublicFolder(folderSlug);

  if (isError) {
    return <div className="text-center">{error.message}</div>;
  }

  if (isPending) {
    return (
      <div className="flex flex-col gap-2">
        <FolderSkeleton />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {data?.map((folder) => (
        <FolderItem key={folder.id} folder={folder} />
      ))}
    </div>
  );
}

export default PublicFolder;
