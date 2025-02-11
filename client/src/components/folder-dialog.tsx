import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import { FolderPlus } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";
import RedAsterisk from "./ui/red-asterisk";
import Submit from "./ui/submit";
import ErrorAlert from "./error.alert";
import useUpdateFolder from "@/hooks/useUpdateFolder";
import useCreateFolder from "@/hooks/useCreateFolder";
import useAuth from "@/hooks/useAuth";

type FolderDialogProps = {
  actionType: "create" | "update";
  folderId: string;
};

function FolderDialog({ actionType, folderId }: FolderDialogProps) {
  const { isAuthenticated } = useAuth();
  const [folderName, setFolderName] = useState("");
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const createFolderMutation = useCreateFolder();
  const updateFolderMutation = useUpdateFolder();

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
    actionType: "create" | "update"
  ) {
    event.preventDefault();
    setErrorMessage(null);
    if (!isAuthenticated) {
      setErrorMessage("You must be logged in to perform this action.");
      return;
    }
    if (actionType === "create") {
      createFolderMutation.mutate(folderName);
    } else {
      updateFolderMutation.mutate({ folderId, folderName });
    }

    if (createFolderMutation.isSuccess) {
      setFolderName("");
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full border justify-start">
          <FolderPlus />
          {actionType === "create" ? "New Folder" : "Update Folder"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {actionType === "create" ? "New Folder" : "Update Folder"}
          </DialogTitle>
          <DialogDescription>
            {actionType === "create"
              ? "Enter a folder name, click submit when you're done."
              : "Choose a new folder name, click submit when you're done."}
          </DialogDescription>
        </DialogHeader>
        <div>
          <form
            onSubmit={(e) => handleSubmit(e, actionType)}
            className="flex flex-col gap-4"
          >
            <div>
              <Label htmlFor="folder">
                Name <RedAsterisk />
              </Label>
              <Input
                type="text"
                name="name"
                id="folder"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                required
              />
            </div>
            {errorMessage && <ErrorAlert>{errorMessage}</ErrorAlert>}
            {createFolderMutation.isError && (
              <ErrorAlert>{createFolderMutation.error.message}</ErrorAlert>
            )}
            {updateFolderMutation.isError && (
              <ErrorAlert>{updateFolderMutation.error.message}</ErrorAlert>
            )}

            <DialogFooter>
              <Submit
                isLoading={
                  updateFolderMutation.isPending ||
                  createFolderMutation.isPending
                }
                type="submit"
              >
                Submit
              </Submit>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default FolderDialog;
