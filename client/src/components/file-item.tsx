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
import { useRef, useState } from "react";
import { getBasePath } from "@/lib/utils";
import { useLocation, useParams } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import ErrorAlert from "./error.alert";
import useDeleteFile from "@/hooks/useDeleteFile";

type FileItemProps = {
  file: File;
  children: React.ReactNode;
};

function FileItem({ file, children }: FileItemProps) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { folderId } = useParams();
  const { user } = useAuth();
  const deleteFileMutation = useDeleteFile(file.id, folderId);
  const navigate = useNavigate();

  const fileLinkRef = useRef<HTMLAnchorElement>(null);

  const handleFileDelete = () => {
    deleteFileMutation.mutate();

    if (deleteFileMutation.isSuccess) {
      setOpen(false);
      navigate(`${getBasePath(pathname)}/${folderId || ""}`);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
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
        {deleteFileMutation.isError && (
          <ErrorAlert>{deleteFileMutation.error.message}</ErrorAlert>
        )}
        <SheetFooter>
          {user?.id === file.userId && (
            <Button onClick={handleFileDelete}>Delete</Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default FileItem;
