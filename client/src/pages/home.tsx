import { API_URL } from "@/lib/constants";
import { useEffect, useState } from "react";
import { FolderClosed, FileText } from "lucide-react";
import { Folder, File } from "@/lib/types";
import { formatDate, formatFileSize } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";

function Home() {
  const [folders, setFolders] = useState<Folder[] | null>(null);
  const [files, setFiles] = useState<File[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [folderResponse, fileResponse] = await Promise.all([
        fetch(`${API_URL}/folders`, {
          credentials: "include",
        }),
        fetch(`${API_URL}/files`, {
          credentials: "include",
        }),
      ]);

      const folders = await folderResponse.json();
      const files = await fileResponse.json();

      setFolders(folders);
      setFiles(files);
    };
    fetchData();
  }, []);

  return (
    <div className="h-full flex flex-col gap-2">
      <div className="grid grid-cols-4 text-md ">
        <p className="col-span-2 hover:bg-hover rounded-sm px-2 py-1 cursor-pointer">
          Name
        </p>
        <p className="col-span-1 hover:bg-hover  rounded-sm px-2 py-1 cursor-pointer">
          Size
        </p>
        <p className="col-span-1 hover:bg-hover  rounded-sm px-2 py-1 cursor-pointer">
          Created
        </p>
      </div>

      <Separator className="bg-neutral-800" />
      {folders &&
        folders.map((folder) => <FolderItem key={folder.id} folder={folder} />)}
      {files && files.map((file) => <FileItem key={file.id} file={file} />)}
    </div>
  );
}

const FolderItem = ({ folder }: { folder: Folder }) => {
  return (
    <Link to={`/folders/${folder.id}`}>
      <div className="grid grid-cols-4 cursor-pointer hover:bg-hover shadow-md  rounded-sm text-sm border">
        <p className="flex items-center gap-2 col-span-2 p-2">
          <FolderClosed size={16} /> {folder.name}
        </p>
        <p className="col-span-1 p-2">--</p>
        <p className="col-span-1 p-2">{formatDate(folder.createdAt)}</p>
      </div>
    </Link>
  );
};

const FileItem = ({ file }: { file: File }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="grid grid-cols-4 cursor-pointer hover:bg-hover shadow-md  rounded-sm text-sm  border-border border">
          <p className="flex items-center gap-2 col-span-2 p-2">
            <FileText size={16} /> {file.name}
          </p>
          <p className="col-span-1 p-2">{formatFileSize(file.size)}</p>
          <p className="col-span-1 p-2">{formatDate(file.createdAt)}</p>
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>File Information</SheetHeader>
        <SheetDescription>Name: {file.name}</SheetDescription>
        <SheetDescription>Size: {formatFileSize(file.size)}</SheetDescription>
        <SheetDescription>
          Created At: {formatDate(file.createdAt)}
        </SheetDescription>
        <SheetFooter>This is sheet footer</SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default Home;
