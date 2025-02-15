import { Folder } from "@/lib/types";
import FileList from "@/components/file-list";

type SubFolderProps = {
  folder: Folder;
};

function SubFolder({ folder }: SubFolderProps) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{folder.name}</h1>
      <FileList files={folder.files} />
      {folder.files.length === 0 && (
        <p className="text-center mt-2 text-xl">This folder is empty.</p>
      )}
    </div>
  );
}

export default SubFolder;
