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

type ActionType = "create" | "update";

function FolderDialog({ actionType }: { actionType: ActionType }) {
  const [folderName, setFolderName] = useState("");
  const [error, setError] = useState<{ message: string } | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);
  const { folderId } = useParams();

  async function handleCreateFolder(e: any) {
    e.preventDefault();
    if (!isAuthenticated) {
      setError({ message: "You must be logged in to create a folder." });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/folders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ folderName }),
      });
      const res = await response.json();
      console.log(res);
    } catch (err) {
      console.log(err);
    } finally {
      setOpen(false);
      setLoading(false);
    }
  }

  async function handleUpdateFolder(e: any) {
    if (!isAuthenticated) {
      setError({ message: "You must be logged in to create a folder." });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/folders/${folderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ folderName }),
      });
      const res = await response.json();
      console.log(res);
    } catch (err) {
      console.log(err);
    } finally {
      setOpen(false);
      setLoading(false);
    }
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
            onSubmit={
              actionType === "create" ? handleCreateFolder : handleUpdateFolder
            }
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
            {error && <p className="text-red-600">{error.message}</p>}
            <DialogFooter>
              <Submit isLoading={loading} type="submit">
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
