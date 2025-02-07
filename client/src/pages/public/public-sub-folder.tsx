import { useParams, useSearchParams } from "react-router-dom";
import SubFolder from "../sub-folder";
import usePublicFolder from "@/hooks/usePublicFolder";
import ErrorPage from "../error-page";

function PublicSubFolder() {
  const { folderSlug } = useParams();
  const [searchParams] = useSearchParams();
  const { data, isPending, isError, error } = usePublicFolder(
    folderSlug,
    searchParams
  );

  if (!data) {
    return <ErrorPage>There was an error fetching this folder.</ErrorPage>;
  }

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
