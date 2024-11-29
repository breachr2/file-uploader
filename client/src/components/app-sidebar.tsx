import FolderDialog from "./folder-dialog";
import FileDialog from "./file-dialog";
import { useEffect, useState, useContext } from "react";
import { API_URL } from "@/lib/constants";
import { ChevronDown } from "lucide-react";
import { Folder } from "@/lib/types";
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
import { Button } from "./ui/button";
import { useNavigate, Link, useParams } from "react-router-dom";
import DeleteFolderDialog from "./delete-folder-dialog";
import { AuthContext } from "@/context/auth-context";
import { useQuery } from "@tanstack/react-query";

function AppSidebar() {
  const { data: folders, isLoading } = useQuery({
    queryKey: ["folders"],
    queryFn: async () => {
      const data = await fetch(`${API_URL}/folders`, {
        credentials: "include",
      });
      return data.json();
    },
  });

  // const [folders, setFolders] = useState<Folder[] | null>(null);
  // const [loading, setLoading] = useState(false);
  const { authStatus } = useContext(AuthContext);
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (!authStatus.isAuthenticated) {
  //     return;
  //   }
  //   const fetchFolders = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await fetch(`${API_URL}/folders`, {
  //         credentials: "include",
  //       });

  //       const data = await response.json();
  //       if (response.ok) {
  //         setFolders(data);
  //       }
  //     } catch (err) {
  //       console.log(err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchFolders();
  // }, [authStatus]);

  async function handleClick() {
    const response = await fetch(`${API_URL}/log-out`, {
      credentials: "include",
    });
    navigate("/auth");
  }

  return (
    <Sidebar>
      <SidebarContent className="bg-sidebar-accent">
        <DialogGroup />
        <SidebarSeparator />
        {isLoading ? (
          <SidebarSkeleton />
        ) : (
          <SidebarMenu>
            {folders && <FolderMenuItem folders={folders} />}
          </SidebarMenu>
        )}
      </SidebarContent>
      {authStatus.isAuthenticated && (
        <SidebarFooter className="border">
          <Button onClick={handleClick}>Sign Out</Button>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}

function DialogGroup() {
  // If there are url params, then a folder is selected
  const { folderId } = useParams();
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <FolderDialog actionType={folderId ? "update" : "create"} />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <FileDialog />
          </SidebarMenuItem>

          <SidebarMenuItem>
            {folderId && <DeleteFolderDialog folderId={Number(folderId)} />}
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
