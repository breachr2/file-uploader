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

function DeleteFolderDialog({ folderId }: { folderId: number }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log(error);

  async function handleSubmit() {
    console.log(`Deleting folder ${folderId}`);
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await fetch(`${API_URL}/folders/${folderId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        setError(error);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }
  return (
    <Dialog>
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
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary" className="border hover:bg-hover w-20">
              Cancel
            </Button>
          </DialogClose>
          <Submit
            isLoading={loading}
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
