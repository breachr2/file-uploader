import AppSidebar from "@/components/app-sidebar";
import AppBreadcrumb from "@/components/app-breadcrumb";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Outlet } from "react-router-dom";
import { Folder } from "@/lib/types";
import { Toaster } from "@/components/ui/toaster";

type LayoutProps = {
  data: Folder[];
  isPending: boolean;
  activeFolder: Folder | undefined;
};

function Layout({ data, isPending, activeFolder }: LayoutProps) {
  return (
    <>
      <SidebarProvider>
        <AppSidebar data={data} isPending={isPending} />
        <main className="flex flex-col w-full bg-gray-100 py-4 px-2 sm:p-8 gap-4 ">
          <div className="flex space-x-2 items-center">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-4" />
            <AppBreadcrumb activeFolder={activeFolder} />
          </div>
          <Outlet />
          <Toaster />
        </main>
      </SidebarProvider>
    </>
  );
}

export default Layout;
