import type { CreateTaskFormData } from "@/components/task/create-task-dialog";
import { deleteData, fetchData, postData, updateData } from "@/lib/fetch-util";
import type { TaskPriority, TaskStatus } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { projectId: string; taskData: CreateTaskFormData }) =>
      postData(`/task/${data.projectId}/create-task`, data.taskData),
    onSuccess: (data: any, variables) => {
      queryClient.setQueryData(["project", variables.projectId], (oldData: any) => {
        if (!oldData?.tasks) return oldData;
        const taskExists = oldData.tasks.some((task: any) => task._id === data._id);

        if (taskExists) return oldData;

        return {
          ...oldData,
          tasks: [data, ...oldData.tasks],
        };
      });

      queryClient.invalidateQueries({ queryKey: ["project", variables.projectId] });
    },
  });
};

export const useTaskByIdQuery = (taskId: string) => {
  return useQuery({
    queryKey: ["task", taskId],
    queryFn: () => fetchData(`/task/${taskId}`),
    enabled: Boolean(taskId),
  });
};

export const useUpdateTaskTitleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { taskId: string; title: string }) =>
      updateData(`/task/${data.taskId}/title`, { title: data.title }),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: ["task", data._id],
      });
      queryClient.invalidateQueries({
        queryKey: ["task-activity", data._id],
      });
    },
  });
};

export const useUpdateTaskStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation ({
    mutationFn: (data: {taskId: string; status: TaskStatus }) =>
      updateData(`/task/${data.taskId}/status`, {status: data.status }),
    onSuccess: (data: any ) => {
      queryClient.invalidateQueries({
        queryKey: ["task", data._id],
      });
      queryClient.invalidateQueries({
        queryKey: ["task-activity", data._id],
      });

      const projectId =
        typeof data.project === "string" ? data.project : data.project?._id;

      if (projectId) {
        queryClient.setQueryData(["project", projectId], (oldData: any) => {
          if (!oldData?.tasks) return oldData;

          return {
            ...oldData,
            tasks: oldData.tasks.map((task: any) =>
              task._id === data._id ? { ...task, status: data.status } : task
            ),
          };
        });
      }
    }
  })
}
export const useUpdateTaskDescriptionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { taskId: string; description: string }) =>
      updateData(`/task/${data.taskId}/description`, {
        description: data.description,
      }),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: ["task", data._id],
      });
      queryClient.invalidateQueries({
        queryKey: ["task-activity", data._id],
      });
    },
  });
};
export const useUpdateTaskAssigneesMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { taskId: string; assignees: string[] }) =>
      updateData(`/task/${data.taskId}/assignees`, {
        assignees: data.assignees,
      }),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: ["task", data._id],
      });
      queryClient.invalidateQueries({
        queryKey: ["task-activity", data._id],
      });
    },
  });
};
export const useUpdateTaskPriorityMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { taskId: string; priority: TaskPriority }) =>
      updateData(`/task/${data.taskId}/priority`, { priority: data.priority }),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: ["task", data._id],
      });
      queryClient.invalidateQueries({
        queryKey: ["task-activity", data._id],
      });

      const projectId =
        typeof data.project === "string" ? data.project : data.project?._id;

      if (projectId) {
        queryClient.setQueryData(["project", projectId], (oldData: any) => {
          if (!oldData?.tasks) return oldData;

          return {
            ...oldData,
            tasks: oldData.tasks.map((task: any) =>
              task._id === data._id
                ? { ...task, priority: data.priority }
                : task
            ),
          };
        });
      }
    },
  });
};
export const useAddSubTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { taskId: string; title: string }) =>
      postData(`/task/${data.taskId}/add-subtask`, { title: data.title }),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: ["task", data._id],
      });
      queryClient.invalidateQueries({
        queryKey: ["task-activity", data._id],
      });
    },
  });
};

export const useUpdateSubTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      taskId: string;
      subTaskId: string;
      completed: boolean;
    }) =>
      updateData(`/task/${data.taskId}/update-subtask/${data.subTaskId}`, {
        completed: data.completed,
      }),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: ["task", data._id],
      });
      queryClient.invalidateQueries({
        queryKey: ["task-activity", data._id],
      });
    },
  });
};
export const useAddCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { taskId: string; text: string }) =>
      postData(`/task/${data.taskId}/add-comment`, { text: data.text }),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", data.task],
      });
      queryClient.invalidateQueries({
        queryKey: ["task-activity", data.task],
      });
    },
  });
};
export const useGetCommentsByTaskIdQuery = (taskId: string) => {
  return useQuery({
    queryKey: ["comments", taskId],
    queryFn: () => fetchData(`/task/${taskId}/comments`),
  });
};

export const useWatchTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { taskId: string }) =>
      postData(`/task/${data.taskId}/watch`, {}),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: ["task", data._id],
      });
      queryClient.invalidateQueries({
        queryKey: ["task-activity", data._id],
      });
    },
  });
};

export const useAchievedTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { taskId: string }) =>
      postData(`/task/${data.taskId}/achieved`, {}),
    onSuccess: (data: any) => {
      const projectId =
        typeof data.project === "string" ? data.project : data.project?._id;

      queryClient.invalidateQueries({
        queryKey: ["task", data._id],
      });
      queryClient.invalidateQueries({
        queryKey: ["task-activity", data._id],
      });
      queryClient.invalidateQueries({ queryKey: ["my-tasks", "user"] });

      if (projectId) {
        queryClient.setQueryData(["project", projectId], (oldData: any) => {
          if (!oldData?.tasks) return oldData;

          const activeTasks = data.isArchived
            ? oldData.tasks.filter((task: any) => task._id !== data._id)
            : oldData.tasks.some((task: any) => task._id === data._id)
              ? oldData.tasks.map((task: any) =>
                  task._id === data._id ? data : task
                )
              : [data, ...oldData.tasks];

          return {
            ...oldData,
            tasks: activeTasks,
          };
        });

        queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      }
    },
  });
};
export const useDeleteTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { taskId: string; projectId?: string }) =>
      deleteData(`/task/${data.taskId}`),
    onSuccess: (_data, variables) => {
      const { taskId, projectId } = variables;

      queryClient.removeQueries({ queryKey: ["task", taskId] });
      queryClient.invalidateQueries({ queryKey: ["my-tasks", "user"] });

      if (projectId) {
        queryClient.setQueryData(["project", projectId], (oldData: any) => {
          if (!oldData?.tasks) return oldData;

          return {
            ...oldData,
            tasks: oldData.tasks.filter((task: any) => task._id !== taskId),
          };
        });

        queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      }
    },
  });
};
export const useGetMyTasksQuery = () => {
  return useQuery({
    queryKey: ["my-tasks", "user"],
    queryFn: () => fetchData("/task/my-tasks"),
  });
};
