import { BackButton } from "@/components/back-button";
import { Loader } from "@/components/loader";
import { CreateTaskDialog } from "@/components/task/create-task-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UseProjectQuery } from "@/hooks/use-project";
import { useUpdateTaskStatusMutation } from "@/hooks/use-task";
import { getProjectProgress } from "@/lib";
import { cn } from "@/lib/utils";
import type { Project, Task, TaskPriority, TaskStatus } from "@/types";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { format } from "date-fns";
import { AlertCircle, Calendar, CheckCircle, Clock, Settings } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

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
  const [boardTasks, setBoardTasks] = useState<Task[]>([]);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const { mutate: updateTaskStatus } = useUpdateTaskStatusMutation();

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

  useEffect(() => {
    setBoardTasks(tasks);
  }, [tasks]);

  const projectProgress = getProjectProgress(tasks);

  const filteredSortedTasks = [...boardTasks]
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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const activeTask = useMemo(
    () => boardTasks.find((task) => task._id === activeTaskId),
    [activeTaskId, boardTasks]
  );

  const statusColumns: TaskStatus[] = ["To Do", "In Progress", "Done"];

  const getColumnItems = (status: TaskStatus) =>
    getTasksByStatus(status).map((task) => task._id);

  const getStatusByContainerId = (containerId?: string | null): TaskStatus | null => {
    if (!containerId) return null;
    if (statusColumns.includes(containerId as TaskStatus)) return containerId as TaskStatus;

    const foundTask = boardTasks.find((task) => task._id === containerId);
    return foundTask?.status ?? null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTaskId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTaskId(null);

    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const fromStatus = getStatusByContainerId(activeId);
    const toStatus = getStatusByContainerId(overId);

    if (!fromStatus || !toStatus) return;

    setBoardTasks((prevTasks) => {
      const current = [...prevTasks];
      const activeIndex = current.findIndex((task) => task._id === activeId);
      if (activeIndex === -1) return prevTasks;

      const activeTaskItem = current[activeIndex];

      if (fromStatus === toStatus) {
        const sortedIds = current
          .filter((task) => task.status === fromStatus)
          .map((task) => task._id);

        const oldPos = sortedIds.indexOf(activeId);
        const newPos = statusColumns.includes(overId as TaskStatus)
          ? sortedIds.length - 1
          : sortedIds.indexOf(overId);

        if (oldPos === -1 || newPos === -1 || oldPos === newPos) return prevTasks;

        const movedInColumn = arrayMove(
          current.filter((task) => task.status === fromStatus),
          oldPos,
          newPos
        );

        const notInColumn = current.filter((task) => task.status !== fromStatus);
        return [...notInColumn, ...movedInColumn];
      }

      const updatedTask = { ...activeTaskItem, status: toStatus };
      const withoutActive = current.filter((task) => task._id !== activeId);
      const toColumnTasks = withoutActive.filter((task) => task.status === toStatus);
      const nonToColumnTasks = withoutActive.filter((task) => task.status !== toStatus);

      const insertIndex = statusColumns.includes(overId as TaskStatus)
        ? toColumnTasks.length
        : toColumnTasks.findIndex((task) => task._id === overId);

      if (insertIndex === -1) {
        toColumnTasks.push(updatedTask);
      } else {
        toColumnTasks.splice(insertIndex, 0, updatedTask);
      }

      updateTaskStatus(
        { taskId: activeId, status: toStatus },
        {
          onError: () => {
            toast.error("Task status could not be updated");
            setBoardTasks(prevTasks);
          },
        }
      );

      return [...nonToColumnTasks, ...toColumnTasks];
    });
  };

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
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <TaskColumn
                  title="To Do"
                  tasks={getTasksByStatus("To Do")}
                  onTaskClick={handleTaskClick}
                  sortableIds={getColumnItems("To Do")}
                />

                <TaskColumn
                  title="In Progress"
                  tasks={getTasksByStatus("In Progress")}
                  onTaskClick={handleTaskClick}
                  sortableIds={getColumnItems("In Progress")}
                />

                <TaskColumn
                  title="Done"
                  tasks={getTasksByStatus("Done")}
                  onTaskClick={handleTaskClick}
                  sortableIds={getColumnItems("Done")}
                />
              </div>

              <DragOverlay>
                {activeTask ? (
                  <div className="w-full max-w-md rounded-lg border bg-background p-2.5 shadow-md">
                    <p className="font-medium line-clamp-1">{activeTask.title}</p>
                    {activeTask.description && (
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                        {activeTask.description}
                      </p>
                    )}
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          </TabsContent>

          <TabsContent value="todo" className="m-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <TaskColumn
                title="To Do"
                tasks={getTasksByStatus("To Do")}
                onTaskClick={handleTaskClick}
                sortableIds={getColumnItems("To Do")}
              />
            </div>
          </TabsContent>

          <TabsContent value="in-progress" className="m-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <TaskColumn
                title="In Progress"
                tasks={getTasksByStatus("In Progress")}
                onTaskClick={handleTaskClick}
                sortableIds={getColumnItems("In Progress")}
              />
            </div>
          </TabsContent>

          <TabsContent value="done" className="m-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <TaskColumn
                title="Done"
                tasks={getTasksByStatus("Done")}
                onTaskClick={handleTaskClick}
                sortableIds={getColumnItems("Done")}
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
  sortableIds,
  onTaskClick,
  isFullWidth = false,
}: {
  title: TaskStatus;
  tasks: Task[];
  sortableIds: string[];
  onTaskClick: (taskId: string) => void;
  isFullWidth?: boolean;
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: title,
  });

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
      <SortableContext items={sortableIds} strategy={rectSortingStrategy}>
        <div
          ref={setNodeRef}
          className={cn(
            "space-y-2 min-h-24 rounded-md transition-colors",
            isOver ? "bg-muted/40" : ""
          )}
        >
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
            <SortableTaskCard key={task._id} task={task} onTaskClick={onTaskClick} />
          ))
        )}
        </div>
      </SortableContext>
    </div>
  );
};

const SortableTaskCard = ({
  task,
  onTaskClick,
}: {
  task: Task;
  onTaskClick: (taskId: string) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: task._id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <button
      ref={setNodeRef}
      style={style}
      type="button"
      onClick={() => onTaskClick(task._id)}
      className={cn(
        "w-full text-left rounded-lg border p-2.5 transition hover:bg-muted/40",
        isDragging ? "opacity-70" : ""
      )}
      {...attributes}
      {...listeners}
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
  );
};

export default ProjectDetails;
