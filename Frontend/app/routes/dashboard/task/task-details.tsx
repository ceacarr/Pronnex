import { useNavigate, useParams } from "react-router";
import { useDeleteTaskMutation, useTaskByIdQuery } from "@/hooks/use-task";
import type { Project, Task } from "@/types";
import { Loader } from "@/components/loader";
import { useAuth } from "@/provider/auth-context";
import { BackButton } from "@/components/back-button";
import { CalendarClock, Eye, EyeOff, Flag, Orbit, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TaskTitle } from "@/components/task/task-title";
import { formatDistanceToNow } from "date-fns";
import { TaskStatusSelector } from "@/components/task/task-status-selector";
import { TaskDescription } from "@/components/task/task-description";
import { TaskAssigneesSelector } from "@/components/task/task-assignees-selector";
import { TaskPrioritySelector } from "@/components/task/task-priority-selector";
import { SubTasksDetails } from "@/components/task/sub-tasks";
import { Watchers } from "@/components/task/watchers";
import { TaskActivity } from "@/components/task/task-activity";
import { CommentSection } from "@/components/task/comment-section";
import { toast } from "sonner";
import { useAchievedTaskMutation, useWatchTaskMutation } from "@/hooks/use-task";
import { useState } from "react";


const TaskDetails = () => {
    const {user} = useAuth();
    const navigate = useNavigate();
    const { workspaceId, projectId, taskId } = useParams<{
        workspaceId: string;
        projectId: string;
        taskId: string;
    } > ();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const { data, isLoading } = useTaskByIdQuery(taskId ?? "") as {
        data: {
            task: Task;
            project:Project;
        }
        isLoading:boolean;
    }
    const { mutate: watchTask } = useWatchTaskMutation();
    const { mutate: achievedTask } = useAchievedTaskMutation();
    const { mutate: deleteTask, isPending: isDeletingTask } =
      useDeleteTaskMutation();

    if (isLoading){
        return (
        <div className="h-full">
          <Loader/>
        </div>
    )
    }
    if(!data) {
        return <div className="container mx-auto p-0 py-4 md:px-4">
            <div className="mb-1">
              <BackButton />
            </div>
            <div className="text-xl font-bold">Task not found</div>
        </div>
    }
    const { task, project } = data;
    const isUserWatching = task?.watchers?.some(
      (watcher: any) => String(watcher?._id) === String(user?._id)
    );

const handleWatchTask = () => {
  watchTask(
    { taskId : task._id},
    {
      onSuccess: () => {
      toast.success("Task Watched");
    },
    onError: () => {
      toast.error("Failed to watch task");
    }
    }
  );
}
const handleAchievedTask = () => {
  achievedTask({ taskId: task._id }, {
    onSuccess: () => {
      toast.success("Task achieved")
    },
    onError: () => {
      toast.error("Task Failed")
    }
  })
}
const handleDeleteTask = () => {
  deleteTask({ taskId: task._id, projectId }, {
    onSuccess: () => {
      toast.success("Task deleted successfully");
      setIsDeleteDialogOpen(false);
      navigate(`/workspace/${workspaceId}/projects/${projectId}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete task");
    },
  });
}

  return <>
  <div className="container mx-auto max-w-7xl space-y-5 p-0 py-4 md:px-4">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <BackButton />
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{task.title}</h1>
              {task.isArchived && (
                <Badge variant="outline">Archived</Badge>
              )}
            </div>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarClock className="size-4" />
              Created {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleWatchTask}
              className="w-fit"
            >
              {isUserWatching ? (
                <>
                  <EyeOff className="mr-2 size-4" />
                  Unwatch
                </>
              ) : (
                <>
                  <Eye className="mr-2 size-4" />
                  Watch
                </>
              )}
            </Button>
            <Button size="sm" onClick={handleAchievedTask} className="w-fit">
              {task.isArchived ? "Unarchive" : "Archive"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(320px,1fr)]">
          <div className="space-y-4">
            <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
              <div className="border-b bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-5 py-4 md:px-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant={
                      task.priority === "High"
                        ? "destructive"
                        : task.priority === "Medium"
                          ? "default"
                          : "outline"
                    }
                    className="capitalize"
                  >
                    {task.priority} Priority
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {task.status}
                  </Badge>
                  <Badge variant="secondary" className="capitalize">
                    <Orbit className="mr-1 size-3" />
                    {task.subtasks?.length || 0} Subtasks
                  </Badge>
                </div>
              </div>

              <div className="space-y-4 p-5 md:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <TaskTitle title={task.title} taskId={task._id} />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="w-fit bg-red-100 text-red-600 hover:bg-red-100 hover:text-red-700"
                  >
                    Delete Task
                  </Button>
                </div>

                <div className="rounded-xl border bg-background/60 p-4">
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                    Description
                  </h3>
                  <TaskDescription description={task.description || ""} taskId={task._id} />
                </div>
              </div>
            </section>

            <section className="rounded-2xl border bg-card p-5 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                <Users className="size-4" />
                Team
              </h3>
              <TaskAssigneesSelector
                task={task}
                assignees={task.assignees}
                projectMembers={project.members}
              />
              <SubTasksDetails subTasks={task.subtasks || []} taskId={task._id}/>
            </section>

            <CommentSection
              taskId={task._id}
              members={project.members as any}
            />
          </div>
          <div className="space-y-4">
            <section className="rounded-2xl border bg-card p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Workflow
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Status</p>
                  <TaskStatusSelector status={task.status} taskId={task._id} />
                </div>
                <div className="space-y-2">
                  <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <Flag className="size-3.5" />
                    Priority
                  </p>
                  <TaskPrioritySelector priority={task.priority} taskId={task._id} />
                </div>
              </div>
            </section>

            <Watchers watchers={task.watchers || [] }/>
            <TaskActivity resourceId={task._id}/>
          </div>
        </div>
  </div>
  <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete task</DialogTitle>
        <DialogDescription>
          This will permanently delete "{task.title}" and its comments and
          activity history. This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button
          variant="outline"
          onClick={() => setIsDeleteDialogOpen(false)}
          disabled={isDeletingTask}
        >
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={handleDeleteTask}
          disabled={isDeletingTask}
        >
          {isDeletingTask ? "Deleting..." : "Delete Task"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  </>
}
export default TaskDetails;
