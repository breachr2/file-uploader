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
import Submit from "./ui/submit";

function FileDialog() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_BASE_URL;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // const result = await fetch(`${apiUrl}/files/upload-file`, {
      //   method: "POST",
      //   body: formData,
      // });
      // const data = await result.json();
      // console.log(data);
      await new Promise((resolve) => setTimeout(resolve, 2500));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">New File</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New File</DialogTitle>
          <DialogDescription>
            Upload a file, click Submit when you're done.
          </DialogDescription>
        </DialogHeader>
        <div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="file">File</Label>
              <Input
                type="file"
                name="name"
                id="file"
                onChange={(e) => handleFileChange(e)}
                required
              />
            </div>
            <DialogFooter>
              <Submit isLoading={loading}>Submit</Submit>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default FileDialog;
