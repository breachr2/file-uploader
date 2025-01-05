import FolderDialog from "./folder-dialog";
import FileDialog from "./file-dialog";
import { useContext } from "react";
import { ChevronDown } from "lucide-react";
import { Folder } from "@/lib/types";
import { Button } from "./ui/button";
import { Link, useParams } from "react-router-dom";
import DeleteFolderDialog from "./delete-folder-dialog";
import { AuthContext } from "@/context/auth-context";
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
import ShareFolderDialog from "./share-folder-dialog";
import { UseQueryResult } from "@tanstack/react-query";

function AppSidebar({ query }: { query: UseQueryResult<Folder[]> }) {
  const { isAuthenticated } = useContext(AuthContext);
  const logOutMutation = useLogout();

  return (
    <Sidebar>
      <SidebarContent className="bg-sidebar-accent">
        <DialogGroup folders={query.data} />
        <SidebarSeparator />
        {query.isPending ? (
          <SidebarSkeleton />
        ) : (
          <SidebarMenu>
            {query.data && <FolderMenuItem folders={query.data} />}
          </SidebarMenu>
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

function DialogGroup({ folders }: { folders: Folder[] | undefined }) {
  const { user } = useContext(AuthContext);
  const { folderId } = useParams();
  const folderData = folders?.find((folder) => folder.id === Number(folderId));

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <FolderDialog
              actionType={folderId ? "update" : "create"}
              folderId={folderId || ""}
            />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <FileDialog />
          </SidebarMenuItem>

          <SidebarMenuItem>
            {folderData && (
              <ShareFolderDialog folderId={folderData?.id.toString()} />
            )}
          </SidebarMenuItem>

          <SidebarMenuItem>
            {folderData && (
              <DeleteFolderDialog folderId={folderData?.id.toString()} />
            )}
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
          <SidebarMenuButton className="hover:bg-hover">
            {folder.name}
            {folder.files.length > 0 && (
              <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
            )}
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub>
            {folder.files?.map((file) => (
              <Link to={`folders/${folder.id}`}>
                <SidebarMenuSubItem key={file.id}>
                  <SidebarMenuButton className="hover:bg-hover overflow-hidden text-ellipsis">
                    {file.originalName}
                  </SidebarMenuButton>
                </SidebarMenuSubItem>
              </Link>
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
