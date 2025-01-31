import { Folder } from "@/lib/types";
import { Button } from "./ui/button";
import useLogout from "@/hooks/useLogout";
import useAuth from "@/hooks/useAuth";
import NavMain from "./nav-main";
import NavActions from "./nav-actions";
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
  isError: boolean;
  isPending: boolean;
  error: Error | null;
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
