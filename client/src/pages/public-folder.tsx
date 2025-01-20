import AppSidebar from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import AppBreadcrumb from "@/components/app-breadcrumb";
import { Link, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getPublicFolder } from "@/api/public-folder-api";

function PublicFolder() {
  const { folderSlug } = useParams();
  const queryResult = useQuery({
    queryKey: ["public-folder", folderSlug],
    queryFn: () => getPublicFolder(folderSlug),
  });
  const folder = queryResult.data?.find((folder) => folder.slug === folderSlug);

  if (queryResult.isError) {
    return <h1>404 Error{queryResult.error.message}</h1>;
  }

  if (!queryResult.data) {
    return <div>No DATA</div>;
  }

  return (
    <>
      <SidebarProvider>
        <AppSidebar query={queryResult} />

        <main className="flex flex-col w-full bg-secondary p-2 gap-4">
          <div className="flex space-x-2 items-center">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-4" />
            <AppBreadcrumb>
              {folder && <Link to={`/share/${folderSlug}`}>{folder.name}</Link>}
            </AppBreadcrumb>
          </div>
          <Outlet />
        </main>
      </SidebarProvider>
    </>
  );
}

export default PublicFolder;
