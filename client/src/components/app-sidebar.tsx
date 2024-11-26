import FolderDialog from "./folder-dialog";
import FileDialog from "./file-dialog";
import { useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "@/context/auth-context";

function AppSidebar() {
  const [folders, setFolders] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { authStatus } = useContext(AuthContext);

  console.log(authStatus);

  useEffect(() => {
    const fetchFolders = async () => {
      setLoading(true);
      try {
        // await new Promise((resolve) => {
        //   // setTimeout(resolve, 2000);
        // });
        const response = await fetch(`${API_URL}/folders`);
        const data = await response.json();
        setFolders(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFolders();
  }, []);

  async function handleClick() {
    const response = await fetch(`${API_URL}/log-out`, {
      credentials: "include",
    });
    const res = await response.json();
    navigate("/auth");
  }

  return (
    <Sidebar>
      <SidebarContent className="bg-sidebar-accent">
        <DialogGroup />
        <SidebarSeparator />
        {loading ? (
          <SidebarSkeleton />
        ) : (
          <SidebarMenu>
            {folders && <FolderMenuItem folders={folders} />}
          </SidebarMenu>
        )}
      </SidebarContent>
      <SidebarFooter>
        <Button onClick={handleClick}>Sign Out</Button>
      </SidebarFooter>
    </Sidebar>
  );
}

function DialogGroup() {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <FolderDialog />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <FileDialog />
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
          <SidebarMenuButton>
            {folder.name}
            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub>
            {folder.files?.map((file) => (
              <SidebarMenuSubItem
                key={file.id}
                className="overflow-hidden text-ellipsis"
              >
                <SidebarMenuButton>{file.name}</SidebarMenuButton>
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
