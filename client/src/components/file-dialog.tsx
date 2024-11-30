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
import Submit from "./ui/submit";
import RedAsterisk from "./ui/red-asterisk";
import { API_URL } from "@/lib/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";

function FileDialog() {
  const [file, setFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const { folderId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const createFileMutation = useMutation({
    mutationFn: async () => {
      if (!file) {
        throw new Error("Please choose a file");
      }
      const formData = new FormData();
      formData.append("file", file);

      if (folderId) {
        formData.append("folderId", folderId);
      }

      const response = await fetch(`${API_URL}/files`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const res = await response.json();
        throw new Error(res);
      }

      return response.json();
    },
    onSuccess: () => {
      if (folderId) {
        Promise.all([
          queryClient.invalidateQueries({ queryKey: ["folder", folderId] }),
          queryClient.invalidateQueries({ queryKey: ["folders"] }),
        ]);
        navigate(`/folders/${folderId}`);
      } else {
        Promise.all([
          queryClient.invalidateQueries({ queryKey: ["folders"] }),
          queryClient.invalidateQueries({ queryKey: ["public-files"] }),
        ]);
      }

      setOpen(false);
    },
  });

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
          <form
            onSubmit={() => createFileMutation.mutate()}
            className="flex flex-col gap-4"
          >
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
