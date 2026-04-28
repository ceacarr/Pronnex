import { useAuth } from "@/provider/auth-context";
import { Header } from "@/components/layout/header";
import {
  Outlet,
  Navigate,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "react-router";
import type { Workspace } from "@/types";
import { Loader } from "@/components/loader";
import { useEffect, useState } from "react";
import { SidebarComponent } from "@/components/layout/sidebar-component";
import { CreateWorkspace } from "@/components/workspace/create-workspace";
import { fetchData } from "@/lib/fetch-util";

export const clientLoader = async () => {
  try {
    const [ workspaces ] = await Promise.all([
      fetchData("/workspaces")]);
      return { workspaces };
    } catch (error) {
    console.error(error);
    return { workspaces: [] };
  }
};

const DashboardLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const loaderData = useLoaderData() as { workspaces?: Workspace[] } | null;
  const workspaces = loaderData?.workspaces ?? [];
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");
  const selectedWorkspace =
    workspaces.find((workspace) => workspace._id === workspaceId) ??
    workspaces[0] ??
    null;
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(
    selectedWorkspace
  );

  useEffect(() => {
    setCurrentWorkspace(selectedWorkspace);
  }, [selectedWorkspace]);

  if (isLoading) {
    return <Loader />;
  }
  if (!isAuthenticated) {
    return <Navigate to="/sign-in" />;
  }

  const handleWorkspaceSelected = (workspace: Workspace) => {
    setCurrentWorkspace(workspace);
    navigate(`/dashboard?workspaceId=${workspace._id}`);
  };

  return (
    <div data-dashboard-layout className="flex h-screen w-full overflow-hidden">
      <SidebarComponent currentWorkspace={currentWorkspace} />
      <div className="flex min-h-0 flex-1 flex-col">
        <Header
          onWorkspaceSelected={handleWorkspaceSelected}
          selectedWorkspace={currentWorkspace}
          onCreatedWorkspace={() => setIsCreatingWorkspace(true)}
        />
        <main className="min-h-0 flex-1 overflow-y-auto w-full">
          <div className="mx-auto container px-2 sm:px-6 lg:px-8 py-0 md:py-8 w-full">
            <Outlet />
          </div>
        </main>
      </div>
      <CreateWorkspace
        isCreatingWorkspace={isCreatingWorkspace}
        setIsCreatingWorkspace={setIsCreatingWorkspace}
      />
    </div>
  );
};

export default DashboardLayout;
