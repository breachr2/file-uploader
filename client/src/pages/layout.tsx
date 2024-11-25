import AppSidebar from "@/components/app-sidebar";
import { Outlet } from "react-router-dom";
import { SidebarTrigger, SidebarProvider } from "@/components/ui/sidebar";

function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger />
      <main>
        <Outlet />
      </main>
    </SidebarProvider>
  );
}

export default Layout;
