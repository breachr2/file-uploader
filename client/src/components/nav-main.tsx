import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarGroup,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { Folder } from "@/lib/types";

function NavMain({ folders }: { folders: Folder[] }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Folders</SidebarGroupLabel>
      {folders.map((folder) => (
        <SidebarMenu>
          <Collapsible className="group/collapsible">
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
                    <SidebarMenuSubItem>
                      <Link to={`folders/${folder.id}`} key={file.id}>
                        <SidebarMenuButton className="hover:bg-hover overflow-hidden text-ellipsis">
                          {file.originalName}
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarMenu>
      ))}
    </SidebarGroup>
  );
}
export default NavMain;
