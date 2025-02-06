import { Link } from "react-router-dom";
import { Folder } from "@/lib/types";
import { Folder as FolderIcon } from "lucide-react";
import { useLocation } from "react-router-dom";

function FolderItem({ folder }: { folder: Folder }) {
  const location = useLocation();

  return (
    <Link
      key={folder.id}
      to={`${location.pathname}/${folder.id}`}
      className="block p-4 rounded-lg shadow-md bg-white hover:shadow-lg transition-all duration-200 ease-in-out transform hover:scale-[1.02]"
    >
      <div className="flex items-center mb-2 gap-2 ">
        <FolderIcon className="text-red-500" size={24} />
        <h2>{folder.name}</h2>
      </div>
      <div className="flex items-center text-sm text-gray-500 gap-1">
        <FolderIcon size={16} />
        <span>{folder.files.length} items </span>
      </div>
    </Link>
  );
}

export default FolderItem;
