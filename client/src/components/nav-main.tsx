import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarGroup,
  SidebarMenuButton,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { Folder } from "@/lib/types";
import { Folder as FolderIcon } from "lucide-react";
import { useLocation } from "react-router-dom";
import { getBasePath } from "@/lib/utils";

function NavMain({ folders }: { folders: Folder[] }) {
  const { pathname } = useLocation();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Folders</SidebarGroupLabel>
      {folders.map((folder) => {
        const isActive = pathname.endsWith(`${folder.id}`);
        const basePath = getBasePath(pathname);
        const newPath = isActive ? pathname : `${basePath}/${folder.id}`;

        return (
          <SidebarMenu key={folder.id}>
            <SidebarMenuItem>
              <Link to={newPath}>
                <SidebarMenuButton
                  className={`hover:bg-hover flex items-center ${
                    isActive && "bg-hover"
                  }
                `}
                >
                  <FolderIcon />
                  <span>{folder.name}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        );
      })}
    </SidebarGroup>
  );
}
export default NavMain;
