import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Folder } from "@/lib/types";
import { getBasePath } from "@/lib/utils";
import { Link, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";

function AppBreadcrumb({
  activeFolder,
  ...rest
}: {
  activeFolder: Folder | undefined;
}) {
  const { pathname } = useLocation();
  const { folderId } = useParams();
  const basePath = getBasePath(pathname);
  const currentPath = activeFolder
    ? `${basePath}/${activeFolder.id}`
    : `${basePath}`;

  return (
    <Breadcrumb {...rest}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to={basePath}>Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {folderId && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                <Link to={currentPath}>{activeFolder?.name}</Link>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default AppBreadcrumb;
