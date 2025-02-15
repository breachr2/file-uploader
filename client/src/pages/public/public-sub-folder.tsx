import { useParams, useSearchParams } from "react-router-dom";
import SubFolder from "../sub-folder";
import usePublicFolder from "@/hooks/usePublicFolder";
import FolderSkeleton from "@/components/folder-skeleton";

function PublicSubFolder() {
  const { folderSlug } = useParams();
  const [searchParams] = useSearchParams();
  const { data, isPending, isError, error } = usePublicFolder(
    folderSlug,
    searchParams
  );

  if (isPending) {
    return <FolderSkeleton />;
  }

  if (isError) {
    return <h1 className="text-center">{(error as Error).message}</h1>;
  }

  return <SubFolder folder={data && data[0]} />;
}

export default PublicSubFolder;
