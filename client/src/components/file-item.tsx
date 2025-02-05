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
import { Button } from "./ui/button";
import useDeleteFile from "@/hooks/useDeleteFile";
import { useNavigate } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { useRef, useState } from "react";
import ErrorAlertDialog from "./error-alert-dialog";
import useAuth from "@/hooks/useAuth";

function FileItem({ file }: { file: File }) {
  const [error, setError] = useState<boolean>(false);
  const { isAuthenticated, user } = useAuth();
  const fileLinkRef = useRef<HTMLAnchorElement>(null);
  const deleteFileMutation = useDeleteFile();
  const navigate = useNavigate();

  const handleFileDelete = () => {
    setError(false);
    if (!isAuthenticated || user?.id !== file.userId) {
      setError(true);
      return;
    }

    deleteFileMutation.mutate(file.id);
    navigate("/folders");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="flex items-center p-2 rounded-md hover:bg-gray-100 gap-2 cursor-pointer">
          <FileText size={20} className="flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {file.name}
            </p>
            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
          </div>
          <p className="text-xs text-gray-500">{formatDate(file.createdAt)}</p>
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>File Information</SheetTitle>
          <SheetDescription className="text-nowrap overflow-hidden text-ellipsis">
            Name: {file.originalName}
          </SheetDescription>
        </SheetHeader>
        <SheetDescription>Size: {formatFileSize(file.size)}</SheetDescription>
        <SheetDescription>
          Created At: {formatDate(file.createdAt)}
        </SheetDescription>
        {file.signedUrl && (
          <div className="flex items-center gap-1">
            <span>File URL: </span>
            <a
              href={file.signedUrl}
              target="_blank"
              ref={fileLinkRef}
              className="flex cursor-pointer text-blue-500 underline items-center gap-1"
            >
              {file.originalName} <ExternalLink size={16} />
            </a>
          </div>
        )}
        <SheetFooter>
          {user?.id === file.userId && (
            <Button onClick={handleFileDelete}>Delete</Button>
          )}
          {error && (
            <ErrorAlertDialog>
              You do not have permissions to delete this file.
            </ErrorAlertDialog>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default FileItem;
