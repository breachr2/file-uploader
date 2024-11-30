import { Link } from "react-router-dom";
import { Folder } from "@/lib/types";
import { FolderClosed } from "lucide-react";
import { formatDate } from "@/lib/utils";

function FolderItem({ folder }: { folder: Folder }) {
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
}

export default FolderItem;
