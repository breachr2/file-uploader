import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link, useLocation } from "react-router-dom";
import useFolder from "@/hooks/useFolder";
import { useContext } from "react";
import { AuthContext } from "@/context/auth-context";

function AppBreadcrumb({ ...rest }) {
  const location = useLocation();
  const pathname = location.pathname.split("/");

  return (
    <Breadcrumb {...rest}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/folders">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {pathname.length >= 3 && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <FolderBreadCrumbPage folderId={pathname[2]} />
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

const FolderBreadCrumbPage = ({ folderId }: { folderId: string }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const { data, isPending, isError } = useFolder(folderId, isAuthenticated);

  if (isError) {
    return <div>Cannot find folder</div>;
  }

  if (isPending) {
    return <div>loading...</div>;
  }

  return (
    <BreadcrumbPage>
      <Link to={`/folders/${data.name}`}>Folder {data.name}</Link>
    </BreadcrumbPage>
  );
};

export default AppBreadcrumb;
