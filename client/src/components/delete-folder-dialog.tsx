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
import { Button } from "./ui/button";
import Submit from "./ui/submit";
import { useState } from "react";
import { API_URL } from "@/lib/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

function DeleteFolderDialog({ folderId }: { folderId: number }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const deleteFolderMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${API_URL}/folders/${folderId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const res = await response.json();
        throw new Error(res || "Error occured deleting folder");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      setOpen(false);
      navigate("/folders");
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Delete Folder</Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-6">
        <DialogHeader>
          <DialogTitle>Delete Folder</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the current folder and all of its
            contents?
          </DialogDescription>
          {deleteFolderMutation.isError && (
            <div>{deleteFolderMutation.error.message}</div>
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
            onClick={() => deleteFolderMutation.mutate()}
          >
            Delete
          </Submit>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteFolderDialog;
