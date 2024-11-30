import { useParams } from "react-router-dom";
import { FileItem } from "./public-folder";
import useFolder from "@/hooks/useFolder";

function Folder() {
  const { folderId } = useParams();

  if (!folderId) {
    return <div>Folder Id not found</div>;
  }
  const { data, isPending, isError, error } = useFolder(folderId);

  if (isPending) {
    return <h1>Loading...</h1>;
  }

  if (isError) {
    return <h1 className="text-center">{error.message}</h1>;
  }

  return (
    <div className="flex flex-col gap-2">
      {data.map((file) => (
        <FileItem key={file.id} file={file} />
      ))}
      {data.length === 0 && (
        <h1 className="text-center">This folder is empty...</h1>
      )}
    </div>
  );
}

export default Folder;
