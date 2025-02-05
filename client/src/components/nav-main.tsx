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

function NavMain({ folders }: { folders: Folder[] }) {
  const { pathname } = useLocation();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Folders</SidebarGroupLabel>
      {folders.map((folder) => (
        <SidebarMenu key={folder.id}>
          <SidebarMenuItem>
            <Link to={`/folders/${folder.id}`}>
              <SidebarMenuButton
                className={`hover:bg-hover flex items-center ${
                  pathname === `/folders/${folder.id}` && "bg-hover"
                }
                `}
              >
                <FolderIcon className="text-blue-500" />
                <span>{folder.name}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      ))}
    </SidebarGroup>
  );
}
export default NavMain;
