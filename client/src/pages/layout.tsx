import { useEffect } from "react";
import AppSidebar from "@/components/app-sidebar";
import AppBreadcrumb from "@/components/app-breadcrumb";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AuthContext } from "@/context/auth-context";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

function Layout() {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }

    navigate("/folders");
  }, [isAuthenticated]);
  return (
    <>
      {/* <header className="bg-foreground text-background p-2 h-10 flex items-center shadow-md">
        <h1 className="text-2xl">File Uploader</h1>
      </header> */}
      <SidebarProvider>
        <AppSidebar />

        <main className="flex flex-col w-full bg-secondary p-2 gap-4">
          <div className="flex space-x-2 items-center">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-4" />
            <AppBreadcrumb />
          </div>
          <Outlet />
        </main>
      </SidebarProvider>
    </>
  );
}

export default Layout;
