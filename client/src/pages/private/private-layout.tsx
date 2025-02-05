import AppSidebar from "@/components/app-sidebar";
import AppBreadcrumb from "@/components/app-breadcrumb";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useParams, Navigate } from "react-router-dom";
import useFolders from "@/hooks/useFolders";
import useAuth from "@/hooks/useAuth";

function PrivateLayout() {
  const { isAuthenticated } = useAuth();
  const { data, isPending, isError, error } = useFolders();
  const { folderId } = useParams();
  const folder = data?.find((folder) => Number(folderId) === folder.id);

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }

  if (!data) {
    return <div>Failed to fetch data.</div>;
  }

  return (
    <>
      {/* <header className="bg-foreground text-background p-2 h-10 flex items-center shadow-md">
        <h1 className="text-2xl">File Uploader</h1>
      </header> */}
      <SidebarProvider>
        <AppSidebar
          data={data}
          isPending={isPending}
          isError={isError}
          error={error}
        />
        <main className="flex flex-col w-full bg-secondary bg-gray-100 p-8 gap-4 ">
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

export default PrivateLayout;
