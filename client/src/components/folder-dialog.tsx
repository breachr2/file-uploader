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

function FolderDialog() {
  const [folderName, setFolderName] = useState("");

  function handleSubmit(e: any) {
    e.preventDefault();
    console.log(folderName);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">New Folder</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Folder</DialogTitle>
          <DialogDescription>
            Enter a folder name, click Submit when you're done.
          </DialogDescription>
        </DialogHeader>
        <div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="folder">Name</Label>
              <Input
                type="text"
                name="name"
                id="folder"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
              />
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
