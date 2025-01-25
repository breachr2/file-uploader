import AppSidebar from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import AppBreadcrumb from "@/components/app-breadcrumb";
import { Outlet } from "react-router-dom";
import { useParams } from "react-router-dom";
import usePublicFolder from "@/hooks/usePublicFolder";

function PublicLayout() {
  const { folderSlug, folderId } = useParams();
  const { data, isError, isPending, error } = usePublicFolder(folderSlug);
  const folder = data?.find((folder) => folder.id === Number(folderId));

  if (isError) {
    return <h1>{error.message}</h1>;
  }

  if (!data) {
    return <div>Failed to fetch data.</div>;
  }

  return (
    <>
      <SidebarProvider>
        <AppSidebar
          data={data}
          isError={isError}
          isPending={isPending}
          error={error}
        />

        <main className="flex flex-col w-full bg-secondary p-2 gap-4">
          <div className="flex space-x-2 items-center">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-4" />
            <AppBreadcrumb activeFolder={folder} />
          </div>
          <Outlet />
        </main>
      </SidebarProvider>
    </>
  );
}

export default PublicLayout;
