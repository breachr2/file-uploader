import AppSidebar from "@/components/app-sidebar";
import { Outlet } from "react-router-dom";
import { SidebarTrigger, SidebarProvider } from "@/components/ui/sidebar";
import AppBreadcrumb from "@/components/app-breadcrumb";

function Layout() {
  return (
    <>
      {/* <header className="bg-foreground text-background p-2 h-10 flex items-center shadow-md">
        <h1 className="text-2xl">File Uploader</h1>
      </header> */}
      <SidebarProvider>
        <AppSidebar />

        <main className="flex flex-col w-full bg-secondary border-2 border-red-300 p-2 gap-4">
          {/* <SidebarTrigger /> */}
          <AppBreadcrumb />
          <Outlet />
        </main>
      </SidebarProvider>
    </>
  );
}

export default Layout;
