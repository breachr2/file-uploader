import { useParams } from "react-router-dom";
import usePublicFolder from "@/hooks/usePublicFolder";
import Layout from "../layout";
import ErrorPage from "../error-page";

function PublicLayout() {
  const { folderSlug, folderId } = useParams();
  const { data, isError, isPending, error } = usePublicFolder(folderSlug);
  const activeFolder = data?.find((folder) => folder.id === Number(folderId));

  if (isPending) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <ErrorPage>{error.message}</ErrorPage>;
  }

  return (
    <Layout data={data} isPending={isPending} activeFolder={activeFolder} />
  );
}

export default PublicLayout;
