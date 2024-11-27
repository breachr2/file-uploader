import { API_URL } from "@/lib/constants";
import { useEffect, useState } from "react";
import { FolderClosed } from "lucide-react";
import { Folder } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Link } from "react-router-dom";

function Home() {
  const [folders, setFolders] = useState<Folder[] | null>(null);
  console.log(folders);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${API_URL}/folders`, {
        credentials: "include",
      });
      const data = await response.json();

      setFolders(data);
    };
    fetchData();
  }, []);

  return (
    <div className=" h-full flex flex-col gap-1">
      <div className="grid grid-cols-4 text-md">
        <p className="col-span-2 hover:bg-gray-300 rounded-sm p-2 cursor-pointer">
          Name
        </p>
        <p className="col-span-1 hover:bg-gray-300 rounded-sm  p-2 cursor-pointer">
          Size
        </p>
        <p className="col-span-1 hover:bg-gray-300 rounded-sm  p-2 cursor-pointer">
          Created
        </p>
      </div>
      {folders &&
        folders.map((folder) => <FolderItem key={folder.id} folder={folder} />)}
    </div>
  );
}

const FolderItem = ({ folder }: { folder: Folder }) => {
  return (
    <Link to={`/folders/${folder.id}`}>
      <div className="grid grid-cols-4 cursor-pointer hover:bg-neutral-500 bg-neutral-700 text-background rounded-sm text-sm">
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
  
};

const FolderFileItem = ({
  name,
  size,
  createdDate,
}: {
  name: string;
  size: number | null;
  createdDate: string;
}) => {
  return (
    <Link to="">
      <div className="grid grid-cols-4 cursor-pointer hover:bg-neutral-500 bg-neutral-700 text-background rounded-sm text-sm">
        <p className="flex items-center gap-2 col-span-2 p-2">
          <FolderClosed size={16} /> {name}
        </p>
        <p className="col-span-1 p-2">{size || "--"}</p>
        <p className="col-span-1 p-2">{formatDate(createdDate)}</p>
      </div>
    </Link>
  );
};

export default Home;
