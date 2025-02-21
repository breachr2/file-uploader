import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { useState } from "react";
import { FilePlus } from "lucide-react";
import FileInputForm from "./file-input-form";

function FileDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full border justify-start">
          <FilePlus />
          New File
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New File</DialogTitle>
          <DialogDescription>Upload a file up to 50MB.</DialogDescription>
        </DialogHeader>
        <div>
          <FileInputForm setOpen={setOpen} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default FileDialog;
