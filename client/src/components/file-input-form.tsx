import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CloudUpload, Paperclip } from "lucide-react";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";
import RedAsterisk from "./ui/red-asterisk";
import Submit from "./ui/submit";
import { DialogFooter } from "./ui/dialog";
import useCreateFile from "@/hooks/useCreateFile";
import { getBasePath } from "@/lib/utils";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import ErrorAlert from "./error.alert";

const formSchema = z.object({
  uploadedFile: z.string().optional(),
});

export default function FileInputForm({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const createFileMutation = useCreateFile();

  const { pathname } = useLocation();
  const { folderId } = useParams();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const dropZoneConfig = {
    maxFiles: 1,
    maxSize: 1024 * 1024 * 50,
    multiple: false,
  };

  function handleFileChange(newFiles: File[] | null) {
    if (newFiles) {
      setFiles(newFiles);
      form.setValue("uploadedFile", newFiles[0]?.name || "");
      form.trigger("uploadedFile");
    }
  }

  function onSubmit(_values: z.infer<typeof formSchema>) {
    if (files.length === 0) {
      toast.error("Please select a file before submitting.");
      return;
    }

    const file = files[0];

    createFileMutation.mutate(
      { file, folderId },
      {
        onSuccess: () => {
          setOpen(false);
          if (folderId) {
            navigate(`${getBasePath(pathname)}/${folderId}`);
          }
        },
      }
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-2 max-w-3xl mx-auto"
      >
        <FormField
          control={form.control}
          name="uploadedFile"
          render={() => (
            <FormItem>
              <FormLabel>
                Select File <RedAsterisk />
              </FormLabel>
              <FormControl>
                <FileUploader
                  value={files}
                  onValueChange={handleFileChange}
                  dropzoneOptions={dropZoneConfig}
                  className="relative bg-background rounded-lg p-1"
                >
                  <FileInput
                    id="fileInput"
                    className="outline-dashed outline-1 outline-slate-500"
                  >
                    <div className="flex items-center justify-center flex-col p-8 w-full">
                      <CloudUpload className="text-gray-500 w-10 h-10" />
                      <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Supports all file types allowed by S3
                      </p>
                    </div>
                  </FileInput>
                  <FileUploaderContent>
                    {files?.map((file, i) => (
                      <FileUploaderItem key={i} index={i}>
                        <Paperclip className="h-4 w-4 stroke-current" />
                        <div className="truncate max-w-[350px] text-base">
                          {file.name}
                        </div>
                      </FileUploaderItem>
                    ))}
                  </FileUploaderContent>
                </FileUploader>
              </FormControl>
              <FormDescription>Select a file to upload.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {createFileMutation.isError && (
          <ErrorAlert
            title="Error"
            description={createFileMutation.error.message}
          />
        )}
        <DialogFooter>
          <Submit type="submit" isLoading={createFileMutation.isPending}>
            Submit
          </Submit>
        </DialogFooter>
      </form>
    </Form>
  );
}
