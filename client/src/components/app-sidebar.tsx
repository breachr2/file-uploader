import { Sidebar, SidebarHeader, SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import FolderDialog from "./folder-dialog";
import FileDialog from "./file-dialog";

function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <FolderDialog />
          </SidebarMenuItem>

          <SidebarMenuItem>
            <FileDialog />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
    </Sidebar>
  );
}

export default AppSidebar;
