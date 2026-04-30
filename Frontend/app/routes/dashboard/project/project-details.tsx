import { BackButton } from "@/components/back-button";
import { Loader } from "@/components/loader";
import { CreateTaskDialog } from "@/components/task/create-task-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UseProjectQuery } from "@/hooks/use-project";
import { getProjectProgress } from "@/lib";
import { cn } from "@/lib/utils";
import type { Project, Task, TaskPriority, TaskStatus } from "@/types";
import { format } from "date-fns";
import { AlertCircle, Calendar, CheckCircle, Clock, Settings } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";

const ProjectDetails = () => {
  const { projectId, workspaceId } = useParams<{
    projectId: string;
    workspaceId: string;
  }>();
  const navigate = useNavigate();

  const [isCreateTask, setIsCreateTask] = useState(false);
  const [taskFilter, setTaskFilter] = useState<TaskStatus | "All">("All");
  const [priorityFilter, setPriorityFilter] = useState<"All" | TaskPriority>("All");
  const [dueFilter, setDueFilter] = useState<"All" | "DueToday" | "DueWeek">("All");

  const { data, isLoading } = UseProjectQuery(projectId!) as {
    data: {
      tasks: Task[];
      project: Project;
    };
    isLoading: boolean;
  };

  if (isLoading)
    return (
      <div>
        <Loader />
      </div>
    );

  if (!data?.project) {
    return <div>Project data not found</div>;
  }

  const { project, tasks } = data;
  const projectProgress = getProjectProgress(tasks);

  const filteredSortedTasks = [...tasks]
    .filter((task) => {
      if (priorityFilter !== "All" && task.priority !== priorityFilter) return false;

      if (dueFilter === "All" || !task.dueDate) return dueFilter === "All";

      const now = new Date();
      const due = new Date(task.dueDate);
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      const endOfWeek = new Date(startOfToday);
      endOfWeek.setDate(startOfToday.getDate() + 7);

      if (dueFilter === "DueToday") return due >= startOfToday && due <= endOfToday;
      if (dueFilter === "DueWeek") return due >= startOfToday && due <= endOfWeek;

      return true;
    });

  const getTasksByStatus = (status: TaskStatus) =>
    filteredSortedTasks.filter((task) => task.status === status);

  const handleTaskClick = (taskId: string) => {
    navigate(
      `/workspace/${workspaceId}/projects/${projectId}/tasks/${taskId}`
    );
  };

  return (
    <div className="space-y-8 ">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <BackButton />
          <div className="flex items-center gap-3 pt-3">
            <h1 className="text-xl md:text-2xl font-bold">{project.title}</h1>
          </div>
          {project.description && (
            <p className="text-sm text-gray-500">{project.description}</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 min-w-36">
            <div className="text-sm text-muted-foreground">Progress:</div>
            <div className="flex-1">
              <Progress value={projectProgress} className="h-2" />
            </div>
            <span className="text-sm text-muted-foreground">
              {projectProgress}%
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                navigate(`/workspace/${workspaceId}/projects/${projectId}/settings`)
              }
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button onClick={() => setIsCreateTask(true)}>Add Task</Button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
            <TabsList>
              <TabsTrigger value="all" onClick={() => setTaskFilter("All")}>
                All Tasks
              </TabsTrigger>
              <TabsTrigger value="todo" onClick={() => setTaskFilter("To Do")}>
                To Do
              </TabsTrigger>
              <TabsTrigger
                value="in-progress"
                onClick={() => setTaskFilter("In Progress")}
              >
                In Progress
              </TabsTrigger>
              <TabsTrigger value="done" onClick={() => setTaskFilter("Done")}>
                Done
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Status:</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-background">
                  {getTasksByStatus("To Do").length} To Do
                </Badge>
                <Badge variant="outline" className="bg-background">
                  {getTasksByStatus("In Progress").length} In Progress
                </Badge>
                <Badge variant="outline" className="bg-background">
                  {getTasksByStatus("Done").length} Done
                </Badge>
              </div>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">Priority:</span>
            {(["All", "High", "Medium", "Low"] as const).map((value) => (
              <Button
                key={value}
                type="button"
                size="sm"
                variant={priorityFilter === value ? "default" : "outline"}
                className="h-7 px-2.5 text-xs"
                onClick={() => setPriorityFilter(value)}
              >
                {value}
              </Button>
            ))}

            <span className="ml-2 text-xs text-muted-foreground">Due:</span>
            {(
              [
                { key: "All", label: "All" },
                { key: "DueToday", label: "Today" },
                { key: "DueWeek", label: "This Week" },
              ] as const
            ).map((item) => (
              <Button
                key={item.key}
                type="button"
                size="sm"
                variant={dueFilter === item.key ? "default" : "outline"}
                className="h-7 px-2.5 text-xs"
                onClick={() => setDueFilter(item.key)}
              >
                {item.label}
              </Button>
            ))}

          </div>

          <TabsContent value="all" className="m-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <TaskColumn
                title="To Do"
                tasks={getTasksByStatus("To Do")}
                onTaskClick={handleTaskClick}
              />

              <TaskColumn
                title="In Progress"
                tasks={getTasksByStatus("In Progress")}
                onTaskClick={handleTaskClick}
              />

              <TaskColumn
                title="Done"
                tasks={getTasksByStatus("Done")}
                onTaskClick={handleTaskClick}
              />
            </div>
          </TabsContent>

          <TabsContent value="todo" className="m-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <TaskColumn
                title="To Do"
                tasks={getTasksByStatus("To Do")}
                onTaskClick={handleTaskClick}
              />
            </div>
          </TabsContent>

          <TabsContent value="in-progress" className="m-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <TaskColumn
                title="In Progress"
                tasks={getTasksByStatus("In Progress")}
                onTaskClick={handleTaskClick}
              />
            </div>
          </TabsContent>

          <TabsContent value="done" className="m-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <TaskColumn
                title="Done"
                tasks={getTasksByStatus("Done")}
                onTaskClick={handleTaskClick}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* create    task dialog */}
      <CreateTaskDialog
        open={isCreateTask}
        onOpenChange={setIsCreateTask}
        projectId={projectId!}
        projectMembers={project.members as any}
      />
    </div>
  );
};

const getStatusIcon = (status: TaskStatus) => {
  switch (status) {
    case "Done":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "In Progress":
      return <Clock className="h-4 w-4 text-blue-500" />;
    default:
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
  }
};

const getPriorityBadgeClass = (priority: TaskPriority) => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-700 border-red-200";
    case "Medium":
      return "bg-amber-100 text-amber-700 border-amber-200";
    default:
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
  }
};

const TaskColumn = ({
  title,
  tasks,
  onTaskClick,
  isFullWidth = false,
}: {
  title: TaskStatus;
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  isFullWidth?: boolean;
}) => {
  return (
    <div className={cn("space-y-2", isFullWidth ? "w-full" : "")}>
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-medium">{title}</h3>
        <Badge
          variant="outline"
          className="rounded-full border-border bg-muted/50 px-2 py-0.5 text-xs text-foreground/80"
        >
          {tasks.length}
        </Badge>
      </div>
      <div className="space-y-2">
        {tasks.length === 0 ? (
          <div className="rounded-lg border border-dashed p-3 text-center">
            <div className="mx-auto mb-2 flex h-7 w-7 items-center justify-center rounded-full bg-muted/70">
              {getStatusIcon(title)}
            </div>
            <p className="text-xs font-medium">No tasks yet</p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Use the top Add Task button to create one.
            </p>
          </div>
        ) : (
          tasks.map((task) => (
            <button
              key={task._id}
              type="button"
              onClick={() => onTaskClick(task._id)}
              className="w-full text-left rounded-lg border p-2.5 transition hover:bg-muted/40"
            >
              <div className="flex items-start justify-between gap-2">
                <Badge
                  variant="outline"
                  className={cn("text-xs", getPriorityBadgeClass(task.priority))}
                >
                  {task.priority}
                </Badge>
                {getStatusIcon(task.status)}
              </div>

              <p className="mt-2 font-medium line-clamp-1">{task.title}</p>
              {task.description && (
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                  {task.description}
                </p>
              )}
              <div className="mt-2 flex items-center justify-end">
                {task.dueDate && (
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(task.dueDate), "dd MMM yyyy")}
                  </span>
                )}
              </div>
              <div className="mt-2 flex -space-x-2">
                {task.assignees?.slice(0, 3).map((assignee) => (
                  <Avatar key={assignee._id} className="h-6 w-6 border">
                    <AvatarImage src={assignee.profilePicture} />
                    <AvatarFallback>{assignee.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
