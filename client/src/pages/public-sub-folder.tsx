import { useParams } from "react-router-dom";
import SubFolder from "./sub-folder";

function PublicSubFolder() {
  const { folderId } = useParams();
 

  return (
    <SubFolder
      data={data}
      isPending={isPending}
      isError={isError}
      error={error}
    />
  );
}

export default PublicSubFolder;
