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
import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import Submit from "./ui/submit";
import ErrorAlert from "./error.alert";
import useFolder from "@/hooks/useFolder";
import useDeleteFolder from "@/hooks/useDeleteFolder";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

function DeleteFolderDialog({ folderId }: { folderId: string }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const { data } = useFolder(folderId);
  const deleteFolderMutation = useDeleteFolder();
  const navigate = useNavigate();

  const handleSubmit = () => {
    deleteFolderMutation.mutate(folderId, {
      onSuccess: () => {
        setOpen(false);
        navigate("/folders");
        toast({
          title: "Folder Deleted ☑️",
          description: `You have successfully deleted the folder "${data?.name}". All contents have been removed.`,
        });
      },
    });
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
            <ErrorAlert
              title="Error Deleting Folder"
              description={deleteFolderMutation.error.message}
            />
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
