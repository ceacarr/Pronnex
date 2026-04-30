import { Loader } from "@/components/loader";
import { CreateProjectDialog } from "@/components/project/create-project";
import { InviteMemberDialog } from "@/components/workspace/invite-member";
import { ProjectList } from "@/components/workspace/project-list";
import { WorkspaceHeader } from "@/components/workspace/workspace-header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteWorkspaceMutation, useGetWorkspaceQuery } from "@/hooks/use-workspace";
import { useAuth } from "@/provider/auth-context";
import type { Project, Workspace } from "@/types";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

const WorkspaceDetails = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [isCreateProject, setIsCreateProject] = useState(false);
  const [isInviteMember, setIsInviteMember] = useState(false);
  const [isDeleteWorkspace, setIsDeleteWorkspace] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } =
    useDeleteWorkspaceMutation();

  if (!workspaceId) {
    return <div>No workspace found</div>;
  }

  const { data, isLoading } = useGetWorkspaceQuery(workspaceId) as {
    data: {
      workspace: Workspace;
      projects: Project[];
    };
    isLoading: boolean;
  };

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (!data?.workspace) {
    return <div>Workspace data not found</div>;
  }

  const ownerId =
    typeof data.workspace.owner === "string"
      ? data.workspace.owner
      : data.workspace.owner?._id;
  const canDeleteWorkspace = ownerId === user?._id;

  const handleDeleteWorkspace = () => {
    deleteWorkspace(workspaceId, {
      onSuccess: () => {
        toast.success("Workspace deleted successfully");
        setIsDeleteWorkspace(false);
        navigate("/workspaces");
      },
      onError: (error: any) => {
        toast.error(
          error.response?.data?.message || "Failed to delete workspace"
        );
      },
    });
  };

  return (
    <div className="space-y-8">
      <WorkspaceHeader
        workspace={data.workspace}
        members={data?.workspace?.members as any}
        onCreateProject={() => setIsCreateProject(true)}
        onInviteMember={() => setIsInviteMember(true)}
        onDeleteWorkspace={() => setIsDeleteWorkspace(true)}
        canDeleteWorkspace={canDeleteWorkspace}
      />

      <ProjectList
        workspaceId={workspaceId}
        projects={data.projects}
        onCreateProject={() => setIsCreateProject(true)}
      />

      <CreateProjectDialog
        isOpen={isCreateProject}
        onOpenChange={setIsCreateProject}
        workspaceId={workspaceId}
        workspaceMembers={data.workspace.members as any}
      />
 
      <InviteMemberDialog
        isOpen={isInviteMember}
        onOpenChange={setIsInviteMember}
        workspaceId={workspaceId}
        />

      <Dialog open={isDeleteWorkspace} onOpenChange={setIsDeleteWorkspace}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete workspace</DialogTitle>
            <DialogDescription>
              This will permanently delete "{data.workspace.name}" and all
              related projects, tasks, comments, activity logs, and pending
              invites. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteWorkspace(false)}
              disabled={isDeletingWorkspace}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteWorkspace}
              disabled={isDeletingWorkspace}
            >
              {isDeletingWorkspace ? "Deleting..." : "Delete Workspace"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
   
    </div>
  );
};

export default WorkspaceDetails;
