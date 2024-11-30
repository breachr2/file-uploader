import { useParams } from "react-router-dom";
import { useContext } from "react";
import { API_URL } from "@/lib/constants";
import { FileItem } from "./public-folder";
import { File } from "@/lib/types";
import { AuthContext } from "@/context/auth-context";
import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "./public-folder";

function Folder() {
  const { folderId } = useParams();
  const { isAuthenticated } = useContext(AuthContext);

  const fetchFolderById = (): Promise<File[]> =>
    fetchWithAuth(`${API_URL}/folders/${folderId}`, isAuthenticated);

  const result = useQuery({
    queryKey: ["folder", folderId],
    queryFn: fetchFolderById,
  });

  if (result.isPending) {
    return <h1>Loading...</h1>;
  }

  if (result.isError) {
    return <h1 className="text-center">{result.error.message}</h1>;
  }

  return (
    <div className="flex flex-col gap-2">
      {result.data &&
        result.data.map((file) => <FileItem key={file.id} file={file} />)}
      {result.data.length === 0 && (
        <h1 className="text-center">This folder is empty...</h1>
      )}
    </div>
  );
}

export default Folder;
