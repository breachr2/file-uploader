import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { FilePlus } from "lucide-react";
import { getBasePath } from "@/lib/utils";
import Submit from "./ui/submit";
import ErrorAlert from "./error.alert";
import RedAsterisk from "./ui/red-asterisk";
import useCreateFile from "@/hooks/useCreateFile";

function FileDialog() {
  const { pathname } = useLocation();
  const { folderId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [file, setFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);

  const createFileMutation = useCreateFile();

  const handleFileUpload = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!file) {
      return;
    }

    createFileMutation.mutate(
      { file, folderId },
      {
        onSuccess: () => {
          setOpen(false);
          queryClient.invalidateQueries({ queryKey: ["folders"] });
          if (folderId) {
            queryClient.invalidateQueries({ queryKey: ["folder", folderId] });
            navigate(`${getBasePath(pathname)}/${folderId}`);
          } else {
            queryClient.invalidateQueries({ queryKey: ["public-files"] });
          }
        },
      }
    );
  };

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full border justify-start">
          <FilePlus />
          New File
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New File</DialogTitle>
          <DialogDescription>Upload a file up to 50MB.</DialogDescription>
        </DialogHeader>
        <div>
          <form onSubmit={handleFileUpload} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="file">
                File <RedAsterisk />
              </Label>
              <Input
                type="file"
                name="name"
                id="file"
                onChange={(e) => handleFileChange(e)}
                required
              />
            </div>
            {createFileMutation.isError && (
              <ErrorAlert>{createFileMutation.error.message}</ErrorAlert>
            )}
            <DialogFooter>
              <Submit isLoading={createFileMutation.isPending}>Submit</Submit>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default FileDialog;
