import { Link } from "react-router-dom";
import { Folder } from "@/lib/types";
import { FolderClosed } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useLocation } from "react-router-dom";

function FolderItem({ folder }: { folder: Folder }) {
  const location = useLocation();
  
  return (
    <Link to={`${location.pathname}/${folder.id}`}>
      <div className="grid grid-cols-4 cursor-pointer hover:bg-hover shadow-sm rounded-sm text-sm border">
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
