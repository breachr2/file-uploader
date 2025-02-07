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
import { useNavigate } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { useRef } from "react";
import { getBasePath } from "@/lib/utils";
import { useLocation, useParams } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import ErrorAlertDialog from "./error-alert-dialog";
import useDeleteFile from "@/hooks/useDeleteFile";

type FileItemProps = {
  file: File;
  children: React.ReactNode;
};

function FileItem({ file, children }: FileItemProps) {
  const { pathname } = useLocation();
  const { folderId } = useParams();
  const { user } = useAuth();
  const deleteFileMutation = useDeleteFile();
  const navigate = useNavigate();

  const fileLinkRef = useRef<HTMLAnchorElement>(null);

  const handleFileDelete = () => {
    deleteFileMutation.mutate(file.id);
    navigate(`${getBasePath(pathname)}/${folderId || ""}`);
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
          {deleteFileMutation.isError && (
            <ErrorAlertDialog>
              {deleteFileMutation.error.message}
            </ErrorAlertDialog>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default FileItem;
