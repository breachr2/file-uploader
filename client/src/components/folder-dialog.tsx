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
import { useState, useContext } from "react";
import { API_URL } from "@/lib/constants";
import RedAsterisk from "./ui/red-asterisk";
import { AuthContext } from "@/context/auth-context";
import { useParams } from "react-router-dom";
import Submit from "./ui/submit";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ErrorAlertDialog from "./error-alert-dialog";
import ErrorAlert from "./error.alert";

type ActionType = "create" | "update";

function FolderDialog({ actionType }: { actionType: ActionType }) {
  const [folderName, setFolderName] = useState("");
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);
  const { folderId } = useParams();

  if (!isAuthenticated) {
    return (
      <ErrorAlertDialog>
        You must be logged in to access this resource.
      </ErrorAlertDialog>
    );
  }

  const queryClient = useQueryClient();
  const createFolderMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${API_URL}/folders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ folderName }),
      });

      if (!response.ok) {
        const res = await response.json();
        throw new Error(res || "An error has occured creating a folder");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });

  const updateFolderMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${API_URL}/folders/${folderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ folderName }),
      });

      if (!response.ok) {
        const res = await response.json();
        throw new Error(res || "An error has occured creating a folder");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });

  function handleSubmit(actionType: ActionType) {
    if (actionType === "create") {
      createFolderMutation.mutate();
      return;
    }
    updateFolderMutation.mutate();
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
