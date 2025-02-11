import { useState } from "react";
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
import { Share2, Copy, Check } from "lucide-react";
import { Input } from "./ui/input";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "./ui/tooltip";
import useFolder from "@/hooks/useFolder";
import Submit from "./ui/submit";
import { makeFolderPublic } from "@/api/folder-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

function ShareFolderDialog({ folderId }: { folderId: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [expiresValue, setExpiresValue] = useState<string | undefined>();
  const { data, isLoading } = useFolder(folderId);
  const [isCopied, setIsCopied] = useState(false);

  const mutation = useMutation({
    mutationFn: makeFolderPublic,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folder", folderId] });
    },
  });

  async function copyToClipboard(folderUrl: string) {
    try {
      await navigator.clipboard.writeText(folderUrl);
      setIsCopied(true);
      toast({
        title: "Copied to Clipboard ✔️",
      });
      setTimeout(() => setIsCopied(false), 4000);
    } catch (err) {
      console.error(err);
    }
  }

  function handleSubmit() {
    mutation.mutate({ folderId, expiresValue: expiresValue });
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
            content. Links will expire after the specified duration.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <div>
            <h1>Select Duration</h1>
            <ToggleGroup
              type="single"
              className="justify-start gap-0"
              onValueChange={(value) => {
                if (value) setExpiresValue(value);
              }}
            >
              <ToggleGroupItem value="3600">1 hour</ToggleGroupItem>
              <ToggleGroupItem value="14400">4 hours</ToggleGroupItem>
              <ToggleGroupItem value="86400">1 day</ToggleGroupItem>
              <ToggleGroupItem value="259200">3 days</ToggleGroupItem>
              <ToggleGroupItem value="604800">1 week</ToggleGroupItem>
            </ToggleGroup>
          </div>

          {data?.folderUrl && (
            <div className="flex gap-2 items-center">
              <Input type="text" readOnly value={data.folderUrl} />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => copyToClipboard(data.folderUrl || "")}
                    >
                      {isCopied ? <Check /> : <Copy />}
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

          <Submit
            onClick={handleSubmit}
            isLoading={isLoading}
            className="w-30"
            disabled={data?.folderUrl ? true : false}
          >
            Generate Link
          </Submit>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ShareFolderDialog;
