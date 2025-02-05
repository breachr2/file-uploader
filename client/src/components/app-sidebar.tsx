import { Folder } from "@/lib/types";
import { Button } from "./ui/button";
import useLogout from "@/hooks/useLogout";
import useAuth from "@/hooks/useAuth";
import NavMain from "./nav-main";
import NavActions from "./nav-actions";
import { LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarContent,
  SidebarMenuSkeleton,
  SidebarSeparator,
  SidebarFooter,
} from "@/components/ui/sidebar";

type AppSidebarProps = {
  data: Folder[];
  isPending: boolean;
};

function AppSidebar({ data, isPending }: AppSidebarProps) {
  const { isAuthenticated } = useAuth();
  const logOutMutation = useLogout();

  return (
    <Sidebar>
      <SidebarContent className="bg-sidebar-accent">
        <NavActions folders={data} />
        <SidebarSeparator />
        {isPending ? <SidebarSkeleton /> : <NavMain folders={data} />}
      </SidebarContent>
      {isAuthenticated && (
        <SidebarFooter className="border">
          <Button
            variant="ghost"
            className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => logOutMutation.mutate()}
            disabled={logOutMutation.isPending}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {logOutMutation.isPending ? "Logging out..." : "Log Out"}
          </Button>
        </SidebarFooter>
      )}
    </Sidebar>
  );
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
