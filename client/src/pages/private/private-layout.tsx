import { useParams, Navigate } from "react-router-dom";
import useFolders from "@/hooks/useFolders";
import useAuth from "@/hooks/useAuth";
import Layout from "../layout";
import ErrorPage from "../error-page";

function PrivateLayout() {
  const { isAuthenticated } = useAuth();
  const { data, isPending, isError, error } = useFolders();
  const { folderId } = useParams();
  const activeFolder = data?.find((folder) => Number(folderId) === folder.id);

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  if (isError) {
    return <ErrorPage>{error.message}</ErrorPage>;
  }

  if (!data) {
    return <ErrorPage>An error has occured while fetching data.</ErrorPage>;
  }

  return (
    <Layout data={data} isPending={isPending} activeFolder={activeFolder} />
  );
}

export default PrivateLayout;
