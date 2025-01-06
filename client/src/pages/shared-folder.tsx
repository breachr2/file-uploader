import AppSidebar from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import AppBreadcrumb from "@/components/app-breadcrumb";
import { Link, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getPublicFolder } from "@/api/public-folder-api";
import FileItem from "@/components/file-item";

function SharedFolder() {
  const { folderId } = useParams();
  const queryResult = useQuery({
    queryKey: ["public-folder", folderId],
    queryFn: () => getPublicFolder(folderId),
  });
  const folder = queryResult.data?.find(
    (folder) => folder.id === Number(folderId)
  );

  if (queryResult.isError) {
    return <h1>404 Error{queryResult.error.message}</h1>;
  }

  if (!queryResult.data) {
    return <div>No DATA</div>;
  }

  return (
    <SidebarProvider>
      <AppSidebar query={queryResult} />

      <main className="flex flex-col w-full bg-secondary p-2 gap-4">
        <div className="flex space-x-2 items-center">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
          <AppBreadcrumb>
            {folder && <Link to={`/share/${folderId}`}>{folder.name}</Link>}
          </AppBreadcrumb>
        </div>
        <div className="flex flex-col gap-2">
          {queryResult.data[0].files.map((file) => (
            <FileItem key={file.id} file={file} />
          ))}
          {queryResult.data[0].files.length === 0 && (
            <h1 className="text-center">This folder is empty...</h1>
          )}
        </div>
      </main>
    </SidebarProvider>
  );
}

export default SharedFolder;
