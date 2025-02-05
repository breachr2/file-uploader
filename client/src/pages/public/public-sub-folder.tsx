import { useParams } from "react-router-dom";
import SubFolder from "../sub-folder";
import usePublicFolder from "@/hooks/usePublicFolder";
import { useSearchParams } from "react-router-dom";

function PublicSubFolder() {
  const { folderSlug } = useParams();
  const [searchParams] = useSearchParams();
  const { data, isPending, isError, error } = usePublicFolder(
    folderSlug,
    searchParams
  );

  return (
    <SubFolder
      folder={data && data[0]}
      isPending={isPending}
      isError={isError}
      error={error}
    />
  );
}

export default PublicSubFolder;
