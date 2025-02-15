import usePublicFolder from "@/hooks/usePublicFolder";
import { useParams } from "react-router-dom";
import FolderItem from "@/components/folder-item";
import FolderSkeleton from "@/components/folder-skeleton";

function PublicFolder() {
  const { folderSlug } = useParams();
  const { data, isPending, isError, error } = usePublicFolder(folderSlug);

  if (isPending) {
    return (
      <div className="flex flex-col gap-2">
        <FolderSkeleton />
      </div>
    );
  }

  if (isError) {
    return <div className="text-center">{error.message}</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-semibold">Folders</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ">
        {data.map((folder) => (
          <FolderItem key={folder.id} folder={folder} />
        ))}
      </div>
    </div>
  );
}

export default PublicFolder;
