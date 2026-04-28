import type { Workspace } from "@/types";
import { useAuth } from "@/provider/auth-context";
import { Button } from "@/components/ui/button";
import { Bell, User, PlusCircle, Sun, Moon, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WorkspaceAvatar } from "../workspace/workspace-avatar";
import { Link, useLoaderData } from "react-router";
import { useState, useEffect } from "react";

interface HeaderProps {
  onWorkspaceSelected: (workspace: Workspace) => void;
  selectedWorkspace: Workspace | null;
  onCreatedWorkspace: () => void;
}

export const Header = ({
  onWorkspaceSelected,
  selectedWorkspace,
  onCreatedWorkspace,
}: HeaderProps) => {
  const { user, logout } = useAuth();
  const loaderData = useLoaderData() as { workspaces?: Workspace[] } | null;
  const workspaces = loaderData?.workspaces ?? [];
  const dashboardHref = selectedWorkspace?._id
    ? `/dashboard?workspaceId=${selectedWorkspace._id}`
    : "/dashboard";

  const [darkMode, setDarkMode] = useState(() => {
    return document.documentElement.classList.contains("dark");
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className="bg-background sticky top-0 z-40 border-b">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {selectedWorkspace ? (
                <>
                  {selectedWorkspace.color && (
                    <WorkspaceAvatar
                      color={selectedWorkspace.color}
                      name={selectedWorkspace.name}
                    />
                  )}
                  <span className="font-medium ml-2">
                    {selectedWorkspace.name}
                  </span>
                </>
              ) : (
                <span className="font-medium">Select Workspace</span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {workspaces.length > 0 ? (
                workspaces.map((ws) => (
                  <DropdownMenuItem
                    key={ws._id}
                    onClick={() => onWorkspaceSelected(ws)}
                    className="cursor-pointer"
                  >
                    {ws.color && (
                      <WorkspaceAvatar color={ws.color} name={ws.name} />
                    )}
                    <span className="ml-2">{ws.name}</span>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="px-3 py-3 text-center text-sm text-muted-foreground">
                  No workspaces yet
                </div>
              )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={onCreatedWorkspace}
                className="cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                Create Workspace
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary">
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={user?.profilePicture}
                    alt={user?.name || user?.email}
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                    {user?.name?.charAt(0).toUpperCase() ||
                      user?.email?.charAt(0).toUpperCase() ||
                      "U"}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link
                  to={dashboardHref}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Dark Mode Toggle */}
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                onClick={() => setDarkMode((prev) => !prev)}
                className="cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    {darkMode ? (
                      <Moon className="h-4 w-4" />
                    ) : (
                      <Sun className="h-4 w-4" />
                    )}
                    <span>{darkMode ? "Dark mode" : "Light mode"}</span>
                  </div>
                  {/* Switch */}
                  <div
      style={{
        position: "relative",
        width: "36px",
        height: "20px",
        borderRadius: "999px",
        backgroundColor: darkMode ? "#3b82f6" : "#d1d5db",
        transition: "background-color 0.2s",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: "2px",
          left: darkMode ? "18px" : "2px",
          width: "16px",
          height: "16px",
          borderRadius: "50%",
          backgroundColor: "#ffffff",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          transition: "left 0.2s",
        }}
      />
    </div>
  </div>
</DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={logout}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
