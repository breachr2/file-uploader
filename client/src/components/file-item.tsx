import { File } from "@/lib/types";
import { FileText } from "lucide-react";
import { formatDate, formatFileSize } from "@/lib/utils";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetDescription,
  SheetFooter,
  SheetTitle,
} from "./ui/sheet";

function FileItem({ file }: { file: File }) {
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
}

export default FileItem;
