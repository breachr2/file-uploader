import { useParams } from "react-router-dom";
import SubFolder from "../sub-folder";
import usePublicFolder from "@/hooks/usePublicFolder";

function PublicSubFolder() {
  const { folderSlug } = useParams();
  const { data, isPending, isError, error } = usePublicFolder(folderSlug);

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
