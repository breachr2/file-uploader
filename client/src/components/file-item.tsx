import { File } from "@/lib/types";
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

function FileItem({
  file,
  children,
}: {
  file: File;
  children: React.ReactNode;
}) {
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
      <SheetTrigger asChild>{children}</SheetTrigger>
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
