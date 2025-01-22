import { useParams } from "react-router-dom";
import SubFolder from "./sub-folder";
import { useQuery } from "@tanstack/react-query";
import { getPublicFolder } from "@/api/public-folder-api";

function PublicSubFolder() {
  const { folderSlug, folderId } = useParams();
  console.log(folderId)
  console.log(folderSlug)
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["public-folder", folderSlug],
    queryFn: () => getPublicFolder(folderSlug),
  });

  return (
    <SubFolder
      data={data && data[0]}
      isPending={isPending}
      isError={isError}
      error={error}
    />
  );
}

export default PublicSubFolder;
