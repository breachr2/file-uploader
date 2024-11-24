import { Sidebar, SidebarHeader, SidebarMenu } from "@/components/ui/sidebar";
import FolderDialog from "./folder-dialog";

function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <FolderDialog />
        </SidebarMenu>
      </SidebarHeader>
    </Sidebar>
  );
}

export default AppSidebar;
