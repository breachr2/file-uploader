import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Button } from "./ui/button";
import { Share2, Copy } from "lucide-react";
import { Input } from "./ui/input";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "./ui/tooltip";
import useFolder from "@/hooks/useFolder";
import useUpdateFolder from "@/hooks/useUpdateFolder";

function ShareFolderDialog({ folderId }: { folderId: string }) {
  const { data } = useFolder(folderId);
  const updateFolderMutation = useUpdateFolder();

  function handleSubmit() {
    updateFolderMutation.mutate({ folderId, folderName: data?.name });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full justify-start">
          <Share2 />
          Share Folder
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Folder</DialogTitle>
          <DialogDescription>
            Generate a shareable link to share the current folder and all of its
            content.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <div>
            <h1>Select Duration</h1>
            <ToggleGroup type="single" className="justify-start gap-0">
              <ToggleGroupItem value="3600">1 hour</ToggleGroupItem>
              <ToggleGroupItem value="14400">4 hours</ToggleGroupItem>
              <ToggleGroupItem value="86400">1 day</ToggleGroupItem>
              <ToggleGroupItem value="259200">3 days</ToggleGroupItem>
              <ToggleGroupItem value="604800">1 week</ToggleGroupItem>
            </ToggleGroup>
            <p className="text-muted-foreground text-sm">
              Links will expire after the specified duration.
            </p>
          </div>

          {data?.folderUrl && (
            <div className="flex gap-2 items-center">
              <Input type="text" readOnly value={data.folderUrl} />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button>
                      <Copy />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy link</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>

          <Button onClick={handleSubmit}>Generate Link</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ShareFolderDialog;
