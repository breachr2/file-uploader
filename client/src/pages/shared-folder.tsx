import AppSidebar from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import AppBreadcrumb from "@/components/app-breadcrumb";
import { Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getPublicFolder } from "@/api/public-folder-api";

function SharedFolder() {
  const { folderId } = useParams();
  const queryResult = useQuery({
    queryKey: ["public-folder", folderId],
    queryFn: () => getPublicFolder(folderId),
  });

  return (
    <SidebarProvider>
      <AppSidebar query={queryResult} />

      <main className="flex flex-col w-full bg-secondary p-2 gap-4">
        <div className="flex space-x-2 items-center">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
          <AppBreadcrumb />
        </div>
        <Outlet />
      </main>
    </SidebarProvider>
  );
}

export default SharedFolder;
