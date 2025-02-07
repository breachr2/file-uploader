import AppSidebar from "@/components/app-sidebar";
import AppBreadcrumb from "@/components/app-breadcrumb";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Outlet } from "react-router-dom";
import { Folder } from "@/lib/types";

type LayoutProps = {
  data: Folder[];
  isPending: boolean;
  activeFolder: Folder | undefined;
};

function Layout({ data, isPending, activeFolder }: LayoutProps) {
  return (
    <>
      {/* <header className="  p-2 h-10 flex items-center shadow-md">
        <h1 className="text-2xl">File Uploader</h1>
      </header> */}
      <SidebarProvider>
        <AppSidebar data={data} isPending={isPending} />
        <main className="flex flex-col w-full bg-gray-100 p-2 sm:p-6 gap-4 ">
          <div className="flex space-x-2 items-center">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-4" />
            <AppBreadcrumb activeFolder={activeFolder} />
          </div>
          <Outlet />
        </main>
      </SidebarProvider>
    </>
  );
}

export default Layout;
