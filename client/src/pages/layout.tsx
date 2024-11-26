import AppSidebar from "@/components/app-sidebar";
import { Outlet } from "react-router-dom";
import { SidebarTrigger, SidebarProvider } from "@/components/ui/sidebar";

function Layout() {
  return (
    <>
      {/* <header className="bg-foreground text-background p-2 h-10 flex items-center shadow-md">
        <h1 className="text-2xl">File Uploader</h1>
      </header> */}
      <SidebarProvider>
        <AppSidebar />

        <main className="w-full bg-secondary ">
          <SidebarTrigger />
          <Outlet />
        </main>
      </SidebarProvider>
    </>
  );
}

export default Layout;
