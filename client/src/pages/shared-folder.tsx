import AppSidebar from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import AppBreadcrumb from "@/components/app-breadcrumb";
import { Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Folder } from "@/lib/types";
import { API_URL } from "@/lib/constants";
import { useParams } from "react-router-dom";

const fetchSharedFolder = async (
  folderId: string | undefined
): Promise<Folder[]> => {
  const response = await fetch(`${API_URL}/folders/public/${folderId}`);

  if (!response.ok) {
    const error = await response.json();
    console.log(error);
    throw new Error(error);
  }

  return response.json();
};

function SharedFolder() {
  const { folderId } = useParams();
  console.log(folderId)
  const queryResult = useQuery({
    queryKey: ["shared-folder", folderId],
    queryFn: () => fetchSharedFolder(folderId),
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
