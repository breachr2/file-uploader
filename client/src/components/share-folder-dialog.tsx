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

function ShareFolderDialog({ folderId }: { folderId: string }) {
  const {data} = useFolder(folderId)

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
              <ToggleGroupItem value="1 hour">1 hour</ToggleGroupItem>
              <ToggleGroupItem value="4 hours">4 hours</ToggleGroupItem>
              <ToggleGroupItem value="1 day">1 day</ToggleGroupItem>
              <ToggleGroupItem value="3 days">3 days</ToggleGroupItem>
              <ToggleGroupItem value="7 days">1 week</ToggleGroupItem>
            </ToggleGroup>
            <p className="text-muted-foreground text-sm">
              Links will expire after the specified duration.
            </p>
          </div>

          <div className="flex gap-2 items-center">
            <Input type="text" readOnly value="hello" />
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

        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>

          <Button>Generate Link</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ShareFolderDialog;
