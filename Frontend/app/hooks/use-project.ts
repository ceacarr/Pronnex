import type { CreateProjectFormData } from "@/components/project/create-project";
import { deleteData, fetchData, postData, updateData } from "@/lib/fetch-util";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const UseCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      projectData: CreateProjectFormData;
      workspaceId: string;
    }) =>
      postData(
        `/projects/${data.workspaceId}/create-project`,
        data.projectData
      ),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: ["workspace", data.workspace],
      });
    },
  });
};

export const UseProjectQuery = (projectId: string) => {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: () => fetchData(`/projects/${projectId}/tasks`),
    enabled: Boolean(projectId),
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      projectId: string;
      projectData: CreateProjectFormData;
    }) => updateData(`/projects/${data.projectId}`, data.projectData),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["project", variables.projectId],
      });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { projectId: string; workspaceId?: string }) =>
      deleteData(`/projects/${data.projectId}`),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.removeQueries({ queryKey: ["project", variables.projectId] });
      if (variables.workspaceId) {
        queryClient.invalidateQueries({
          queryKey: ["workspace", variables.workspaceId],
        });
        queryClient.invalidateQueries({
          queryKey: ["workspace", variables.workspaceId, "details"],
        });
      }
    },
  });
};
