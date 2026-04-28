import type { WorkspaceForm } from "@/components/workspace/create-workspace";
import { fetchData, postData } from "@/lib/fetch-util";
import { projectSchema } from "@/lib/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { z } from "zod";

type CreateProjectFormData = z.infer<typeof projectSchema>;

export const useCreateWorkspace = () => {
  return useMutation({
    mutationFn: async (data: WorkspaceForm) => postData("/workspaces", data),
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      workspaceId: string;
      projectData: CreateProjectFormData;
    }) => postData(`/workspaces/${data.workspaceId}/projects`, data.projectData),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["workspace", variables.workspaceId],
      });
      queryClient.invalidateQueries({
        queryKey: ["workspace", variables.workspaceId, "details"],
      });
    },
  });
};

export const useGetWorkspacesQuery = () => {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => fetchData("/workspaces"),
  });
};

export const useGetWorkspaceQuery = (workspaceId: string) => {
  return useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: async () => fetchData(`/workspaces/${workspaceId}/projects`),
    enabled: Boolean(workspaceId),
  });
};

export const useGetWorkspaceStatsQuery = (workspaceId: string) => {
  return useQuery({
    queryKey: ["workspace", workspaceId, "stats"],
    queryFn: async () => fetchData(`/workspaces/${workspaceId}/stats`),
    enabled: Boolean(workspaceId),
  });
};

export const useGetWorkspaceDetailsQuery = (workspaceId: string) => {
  return useQuery({
    queryKey: ["workspace", workspaceId, "details"],
    queryFn: async () => fetchData(`/workspaces/${workspaceId}`),
    enabled: Boolean(workspaceId),
  });
};

export const useInviteMemberMutation = () => {
  return useMutation({
    mutationFn: (data: { email: string; role: string; workspaceId: string }) =>
      postData(`/workspaces/${data.workspaceId}/invite-member`, data),
  });
};

export const useAcceptInviteByTokenMutation = () => {
  return useMutation({
    mutationFn: (token: string) =>
      postData(`/workspaces/accept-invite-token`, {
        token,
      }),
  });
};

export const useAcceptGenerateInviteMutation = () => {
  return useMutation({
    mutationFn: (workspaceId: string) =>
      postData(`/workspaces/${workspaceId}/accept-generate-invite`, {}),
  });
};

