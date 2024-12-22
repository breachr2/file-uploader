import FolderDialog from "./folder-dialog";
import FileDialog from "./file-dialog";
import { useContext } from "react";
import { ChevronDown } from "lucide-react";
import { Folder } from "@/lib/types";
import { Button } from "./ui/button";
import { Link, useParams } from "react-router-dom";
import DeleteFolderDialog from "./delete-folder-dialog";
import { AuthContext } from "@/context/auth-context";
import useFolders from "@/hooks/useFolders";
import useLogout from "@/hooks/useLogout";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import {
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSkeleton,
  SidebarSeparator,
  SidebarFooter,
} from "@/components/ui/sidebar";

function AppSidebar() {
  const { isAuthenticated } = useContext(AuthContext);
  const { data, isPending } = useFolders(isAuthenticated);
  const logOutMutation = useLogout();

  return (
    <Sidebar>
      <SidebarContent className="bg-sidebar-accent">
        <DialogGroup />
        <SidebarSeparator />
        {isPending ? (
          <SidebarSkeleton />
        ) : (
          <SidebarMenu>{data && <FolderMenuItem folders={data} />}</SidebarMenu>
        )}
      </SidebarContent>
      {isAuthenticated && (
        <SidebarFooter className="border">
          <Button
            onClick={() => logOutMutation.mutate()}
            disabled={logOutMutation.isPending}
          >
            {logOutMutation.isPending ? "Logging out..." : "Log Out"}
          </Button>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}

function DialogGroup() {
  const { folderId } = useParams();
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <FolderDialog actionType={folderId ? "update" : "create"} folderId={folderId || ""}/>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <FileDialog />
          </SidebarMenuItem>

          <SidebarMenuItem>
            {folderId && <DeleteFolderDialog folderId={folderId} />}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function FolderMenuItem({ folders }: { folders: Folder[] }) {
  return folders.map((folder) => (
    <Collapsible key={folder.id} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <Link to={`folders/${folder.id}`}>
            <SidebarMenuButton className="hover:bg-hover">
              {folder.name}
              {folder.files.length > 0 && (
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              )}
            </SidebarMenuButton>
          </Link>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub>
            {folder.files?.map((file) => (
              <SidebarMenuSubItem key={file.id}>
                <SidebarMenuButton className="hover:bg-hover overflow-hidden text-ellipsis">
                  {file.name}
                </SidebarMenuButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  ));
}

function SidebarSkeleton() {
  return (
    <SidebarMenu>
      {Array.from({ length: 8 }).map((_, index) => (
        <SidebarMenuItem key={index}>
          <SidebarMenuSkeleton />
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

export default AppSidebar;
