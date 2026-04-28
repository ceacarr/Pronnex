import { cn } from "@/lib/utils";
import { useAuth } from "@/provider/auth-context";
import type { Workspace } from "@/types";
import {
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  LayoutDashboard,
  ListCheck,
  LogOut,
  Settings,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { SidebarNav } from "./sidebar-nav";

export const SidebarComponent = ({
  currentWorkspace,
}: {
  currentWorkspace: Workspace | null;
}) => {
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const dashboardHref = currentWorkspace?._id
    ? `/dashboard?workspaceId=${currentWorkspace._id}`
    : "/dashboard";

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Workspaces",
      href: "/workspaces",
      icon: Users,
    },
    {
      title: "My Tasks",
      href: "/my-tasks",
      icon: ListCheck,
    },
    {
      title: "Members",
      href: `/members`,
      icon: Users,
    },
    {
      title: "Achieved",
      href: `/achieved`,
      icon: CheckCircle2,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col border-r bg-sidebar transition-all duration-300",
        isCollapsed ? "w-16 md:w[80px]" : "w-16 md:w-[240px]"
      )}
    >
     <div className="flex h-14 items-center border-b px-2 mb-4 w-full relative">
  <Link to={dashboardHref} className={`flex items-center gap-2 ${isCollapsed ? 'mx-auto' : 'ml-2'}`}>
    <img 
      src="/abstract-shape.png" 
      alt="Logo" 
      className="h-8 w-8 object-contain shrink-0" 
    />
    
    {!isCollapsed && (
      <span className="font-semibold text-lg whitespace-nowrap">
        Pronnex
      </span>
    )}
  </Link>
  <Button
    variant="ghost"
    size="icon"
    className={`shrink-0 ${isCollapsed ? ' -right-2 bg-background border shadow-sm scale-75' : 'ml-auto hidden md:block'}`}
    onClick={() => setIsCollapsed(!isCollapsed)}
  >
    {isCollapsed ? (
      <ArrowRight className="size-4" />
    ) : (
      <ArrowLeft className="size-4" />
    )}
  </Button>

</div>
     <ScrollArea className="flex-1 px-3 py-2">
        <SidebarNav
          items={navItems}
          isCollapsed={isCollapsed}
          className={cn(isCollapsed && "items-center space-y-2")}
          currentWorkspace={currentWorkspace}
        />
      </ScrollArea>
      <div>
        <Button
          variant={"ghost"}
          size={isCollapsed ? "icon" : "default"}
          onClick={logout}
        >
          <LogOut className={cn("size-4", isCollapsed && "mr-2")} />
          <span className="hidden md:block">Logout</span>
        </Button>
      </div>
    </div>
  );
};
