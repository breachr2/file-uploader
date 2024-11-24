import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import { useActionState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

async function createFolder(previousState, formData) {}

function FolderDialog() {
  const [state, actionFunction, isPending] = useActionState(createFolder, {});

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>New Folder</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Folder</DialogTitle>
          <DialogDescription>
            Enter a folder name, click Submit when you're done.
          </DialogDescription>
        </DialogHeader>

        <div>
          <form action="" className="flex flex-col gap-4">
            <div>
              <Label htmlFor="folder-name">Name</Label>
              <Input type="text" name="name" id="folder-name" />
            </div>
            <DialogFooter>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default FolderDialog;
