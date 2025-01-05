import useFiles from "@/hooks/useFiles";
import useFolders from "@/hooks/useFolders";
import FolderItem from "@/components/folder-item";
import FileItem from "@/components/file-item";

function PublicFolder() {
  const folders = useFolders();
  const files = useFiles();

  if (folders.isError) {
    return <div className="text-center">{folders.error.message}</div>;
  }

  if (files.isError) {
    return <div className="text-center">{files.error.message}</div>;
  }

  if (folders.isLoading || files.isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {folders.data &&
        folders.data.map((folder) => (
          <FolderItem key={folder.id} folder={folder} />
        ))}
      {files.data &&
        files.data.map((file) => <FileItem key={file.id} file={file} />)}
    </div>
  );
}

export default PublicFolder;
