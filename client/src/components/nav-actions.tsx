import FolderDialog from "./folder-dialog";
import FileDialog from "./create-file-dialog";
import { Folder } from "@/lib/types";
import { useParams } from "react-router-dom";
import DeleteFolderDialog from "./delete-folder-dialog";
import ShareFolderDialog from "./share-folder-dialog";
import useAuth from "@/hooks/useAuth";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";

function NavActions({ folders }: { folders: Folder[] }) {
  const { isAuthenticated, user } = useAuth();
  const { folderId, folderSlug } = useParams();
  const currentFolder = folders?.find(
    (folder) => folder.id === Number(folderId)
  );
  const isOwner = isAuthenticated && user?.id === folders?.[0]?.userId;

  if (!isOwner && folderSlug) {
    return null;
  }

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
            {currentFolder && (
              <ShareFolderDialog folderId={currentFolder.id.toString()} />
            )}
          </SidebarMenuItem>

          <SidebarMenuItem>
            {currentFolder && (
              <DeleteFolderDialog folderId={currentFolder.id.toString()} />
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
export default NavActions;
