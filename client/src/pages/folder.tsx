import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { API_URL } from "@/lib/constants";
import { FileItem } from "./public-folder";
import { File } from "@/lib/types";
import { AuthContext } from "@/context/auth-context";
import { useQuery } from "@tanstack/react-query";

function Folder() {
  const [files, setFiles] = useState<File[] | null>(null);
  const { folderId } = useParams();
  const { authStatus } = useContext(AuthContext);

  useEffect(() => {
    if (!authStatus.isAuthenticated) {
      return;
    }
    const fetchFolderById = async () => {
      try {
        const response = await fetch(`${API_URL}/folders/${folderId}`, {
          credentials: "include",
        });
        const data = await response.json();
        setFiles(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchFolderById();
  }, [folderId]);

  return (
    <div className="flex flex-col gap-2">
      {files && files.map((file) => <FileItem key={file.id} file={file} />)}
      {files?.length === 0 && (
        <h1 className="text-center">This folder is empty...</h1>
      )}
    </div>
  );
}

export default Folder;
