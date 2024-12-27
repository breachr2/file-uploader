import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
  DialogClose,
} from "./ui/dialog";
import { useState } from "react";
import { Button } from "./ui/button";
import Submit from "./ui/submit";
import useDeleteFolder from "@/hooks/useDeleteFolder";
import ErrorAlert from "./error.alert";
import { Trash2 } from "lucide-react";
import { AuthContext } from "@/context/auth-context";
import { useContext } from "react";
import useFolder from "@/hooks/useFolder";

function DeleteFolderDialog({ folderId }: { folderId: string }) {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);
  const { data } = useFolder(folderId);
  const deleteFolderMutation = useDeleteFolder(Number(folderId));

  const handleSubmit = () => {
    if (!isAuthenticated) {
      return;
    }
    deleteFolderMutation.mutate();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full justify-start" variant="destructive">
          <Trash2 /> Delete Folder
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-6">
        <DialogHeader>
          <DialogTitle>Delete Folder "{data?.name}"</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the current folder and all of its
            contents?
          </DialogDescription>
          {deleteFolderMutation.isError && (
            <ErrorAlert>{deleteFolderMutation.error.message}</ErrorAlert>
          )}
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary" className="border hover:bg-hover w-20">
              Cancel
            </Button>
          </DialogClose>
          <Submit
            isLoading={deleteFolderMutation.isPending}
            variant="destructive"
            className="border w-20"
            onClick={handleSubmit}
          >
            Delete
          </Submit>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteFolderDialog;
