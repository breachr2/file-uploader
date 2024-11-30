import { API_URL } from "@/lib/constants";
import { useEffect, useState, useContext } from "react";
import { FolderClosed, FileText } from "lucide-react";
import { Folder, File } from "@/lib/types";
import { formatDate, formatFileSize } from "@/lib/utils";
import { Link } from "react-router-dom";
import { AuthContext } from "@/context/auth-context";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useQuery } from "@tanstack/react-query";
import useFiles from "@/hooks/useFiles";
import useFolders from "@/hooks/useFolders";

function PublicFolder() {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <div></div>;
  }

  const foldersResult = useFolders();
  const filesResult = useFiles();

  if (foldersResult.isError) {
    return <div className="text-center">{foldersResult.error.message}</div>;
  }

  if (filesResult.isError) {
    return <div className="text-center">{filesResult.error.message}</div>;
  }

  if (foldersResult.isLoading || filesResult.isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {foldersResult.data &&
        foldersResult.data.map((folder) => (
          <FolderItem key={folder.id} folder={folder} />
        ))}
      {filesResult.data &&
        filesResult.data.map((file) => <FileItem key={file.id} file={file} />)}
    </div>
  );
}

const FolderItem = ({ folder }: { folder: Folder }) => {
  return (
    <Link to={`/folders/${folder.id}`}>
      <div className="grid grid-cols-4 cursor-pointer hover:bg-hover shadow-md rounded-sm text-sm border">
        <p className="flex items-center gap-2 col-span-2 p-2">
          <FolderClosed size={16} /> {folder.name}
        </p>
        <p className="col-span-1 p-2">--</p>
        <p className="col-span-1 p-2">{formatDate(folder.createdAt)}</p>
      </div>
    </Link>
  );
};

export const FileItem = ({ file }: { file: File }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="grid grid-cols-4 cursor-pointer hover:bg-hover shadow-md rounded-sm text-sm border">
          <p className="flex items-center gap-2 col-span-2 p-2">
            <FileText size={16} /> {file.originalName}
          </p>
          <p className="col-span-1 p-2">{formatFileSize(file.size)}</p>
          <p className="col-span-1 p-2">{formatDate(file.createdAt)}</p>
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>File Information</SheetHeader>
        <SheetDescription className="text-nowrap overflow-hidden text-ellipsis">
          Name: {file.originalName}
        </SheetDescription>
        <SheetDescription>Size: {formatFileSize(file.size)}</SheetDescription>
        <SheetDescription>
          Created At: {formatDate(file.createdAt)}
        </SheetDescription>
        <SheetFooter>This is sheet footer</SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default PublicFolder;
