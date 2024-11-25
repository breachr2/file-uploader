import { Fragment } from "react";
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import FolderDialog from "./folder-dialog";
import FileDialog from "./file-dialog";
import { useEffect, useState } from "react";
import { API_URL } from "@/lib/constants";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { ChevronDown } from "lucide-react";

function AppSidebar() {
  const [folders, setFolders] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFolders = async () => {
      setLoading(true);
      try {
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

  console.log(folders);

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

      <SidebarContent>
        {folders && <FolderGroup folders={folders} />}
      </SidebarContent>
    </Sidebar>
  );
}

function FileGroupContent({ files }) {
  return files.map((file) => {
    return (
      <Fragment key={file.id}>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="overflow-hidden">
              {file.name}
            </SidebarGroupLabel>
          </SidebarGroup>
        </SidebarContent>
      </Fragment>
    );
  });
}

function FolderGroup({ folders }) {
  return folders.map((folder) => (
    <Fragment key={folder.id}>
      <Collapsible>
        <SidebarGroup>
          <SidebarGroupLabel asChild>
            <CollapsibleTrigger>
              {folder.name}
              <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
            </CollapsibleTrigger>
          </SidebarGroupLabel>
          <CollapsibleContent>
            <FileGroupContent files={folder.files} />
          </CollapsibleContent>
        </SidebarGroup>
      </Collapsible>
    </Fragment>
  ));
}

export default AppSidebar;
