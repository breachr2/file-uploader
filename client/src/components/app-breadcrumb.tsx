import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Folder } from "@/lib/types";
import { Link, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";

function AppBreadcrumb({ activeFolder, ...rest }: { activeFolder: Folder | undefined }) {
  const location = useLocation();
  const { folderSlug, folderId } = useParams();
  let baseUrl;

  if (folderSlug) {
    const pathname = location.pathname.split("/");
    baseUrl = `/${pathname[1]}/${pathname[2]}`;
  } else {
    const pathname = location.pathname.split("/");
    baseUrl = `/${pathname[1]}`;
  }
  return (
    <Breadcrumb {...rest}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to={baseUrl}>Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {folderId && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                <Link to={`${location.pathname}`}>{activeFolder?.name}</Link>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default AppBreadcrumb;
