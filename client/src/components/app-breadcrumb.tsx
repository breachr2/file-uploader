import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import useFolder from "@/hooks/useFolder";
import { useParams } from "react-router-dom";

function AppBreadcrumb({ ...rest }) {
  const { folderId } = useParams();

  return (
    <Breadcrumb {...rest}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/folders">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {folderId && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <FolderBreadCrumbPage folderId={folderId} />
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

const FolderBreadCrumbPage = ({ folderId }: { folderId: string }) => {
  const { data, isPending, isError } = useFolder(folderId);

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
