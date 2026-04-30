import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useUserProfileQuery } from "@/hooks/use-user";
import { useAuth } from "@/provider/auth-context";
import type { User } from "@/types";
import {
  Bell,
  CheckCircle2,
  ChevronRight,
  LockKeyhole,
  Moon,
  Settings as SettingsIcon,
  ShieldCheck,
  Sun,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";

const Settings = () => {
  const { logout } = useAuth();
  const { data: user } = useUserProfileQuery() as { data?: User };
  const [darkMode, setDarkMode] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

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
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage account preferences and workspace experience.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center gap-2">
                <UserRound className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Account</CardTitle>
              </div>
              <CardDescription>
                Your personal profile and sign-in details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 pt-5">
              <div className="flex flex-col gap-4 rounded-lg border bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar className="h-12 w-12 border">
                    <AvatarImage src={user?.profilePicture} alt={user?.name} />
                    <AvatarFallback>
                      {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {user?.name || "User"}
                    </p>
                    <p className="truncate text-sm text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <Button variant="outline" asChild>
                  <Link to="/user/profile">
                    Edit Profile
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                    Email status
                  </div>
                  <div className="mt-3 space-y-2">
                    <Badge className="bg-emerald-600 hover:bg-emerald-600">
                      Verified
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      Checked during sign in.
                    </p>
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <LockKeyhole className="h-4 w-4 text-muted-foreground" />
                    Password
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Update it from your profile security section.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Preferences</CardTitle>
              </div>
              <CardDescription>
                Local preferences for this browser.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 pt-5">
              <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-md bg-muted p-2">
                    {darkMode ? (
                      <Moon className="h-4 w-4" />
                    ) : (
                      <Sun className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <Label>Appearance</Label>
                    <p className="text-sm text-muted-foreground">
                      Switch between light and dark mode.
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setDarkMode((value) => !value)}
                >
                  {darkMode ? "Dark" : "Light"}
                </Button>
              </div>

              <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-md bg-muted p-2">
                    <Bell className="h-4 w-4" />
                  </div>
                  <div>
                    <Label>Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Email notifications are handled by workspace activity.
                    </p>
                  </div>
                </div>
                <Badge variant="outline">Default</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Session</CardTitle>
            <CardDescription>
              Control the active session on this device.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 rounded-lg border bg-muted/20 p-4">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-500" />
              <div>
                <p className="font-medium">Signed in</p>
                <p className="text-sm text-muted-foreground">
                  You are currently authenticated in this browser.
                </p>
              </div>
            </div>
            <Separator />
            <Button variant="destructive" className="w-full" onClick={logout}>
              Log Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
