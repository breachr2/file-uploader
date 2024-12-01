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
import { AuthContext } from "@/context/auth-context";
import { useParams } from "react-router-dom";
import { useState, useContext } from "react";
import RedAsterisk from "./ui/red-asterisk";
import Submit from "./ui/submit";
import ErrorAlert from "./error.alert";
import useUpdateFolder from "@/hooks/useUpdateFolder";
import useCreateFolder from "@/hooks/useCreateFolder";

type ActionType = "create" | "update";

function FolderDialog({ actionType }: { actionType: ActionType }) {
  const [folderName, setFolderName] = useState("");
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);
  const { folderId } = useParams();

  const createFolderMutation = useCreateFolder();
  const updateFolderMutation = useUpdateFolder();

  function handleSubmit(actionType: ActionType) {
    if (!isAuthenticated) {
      return;
    }
    if (actionType === "create") {
      createFolderMutation.mutate(folderName);
      return;
    }
    updateFolderMutation.mutate({ folderId, folderName });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full border">
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
            onSubmit={() => handleSubmit(actionType)}
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
