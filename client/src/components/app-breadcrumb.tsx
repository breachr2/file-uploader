import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link, useLocation } from "react-router-dom";

function AppBreadcrumb({ ...rest }) {
  const location = useLocation();
  const pathname = location.pathname.split("/");
  console.log(pathname);

  return (
    <Breadcrumb {...rest}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/folders">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {pathname.length === 3 && (
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={`/folders/${pathname[2]}`}>Folder {pathname[2]}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default AppBreadcrumb;
