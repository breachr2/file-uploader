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
import { useContext, useState } from "react";
import Submit from "./ui/submit";
import RedAsterisk from "./ui/red-asterisk";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/auth-context";
import ErrorAlert from "./error.alert";
import useCreateFile from "@/hooks/useCreateFile";
import { useQueryClient } from "@tanstack/react-query";

function FileDialog() {
  const { isAuthenticated } = useContext(AuthContext);
  const [file, setFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const { folderId } = useParams();
  const navigate = useNavigate();
  const createFileMutation = useCreateFile();
  const queryClient = useQueryClient();

  const handleFileUpload = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file || !isAuthenticated) {
      return;
    }
    createFileMutation.mutate(
      { file, folderId },
      {
        onSuccess: () => {
          setOpen(false);
          if (folderId) {
            queryClient.invalidateQueries({ queryKey: ["folder", folderId] });
            queryClient.invalidateQueries({ queryKey: ["folders"] });
            navigate(`/folders/${folderId}`);
          } else {
            queryClient.invalidateQueries({ queryKey: ["folders"] });
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
        <Button className="w-full border ">New File</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New File</DialogTitle>
          <DialogDescription>
            Upload a file, click Submit when you're done.
          </DialogDescription>
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
