import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/loader";
import { useGetMyTasksQuery } from "@/hooks/use-task";
import type { Task } from "@/types";
import {
  Archive,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Search,
} from "lucide-react";
import { format } from "date-fns/format";
import { useMemo, useState } from "react";
import { Link } from "react-router";

const getEntityId = (entity: unknown) => {
  if (typeof entity === "string") return entity;

  if (entity && typeof entity === "object") {
    const value = entity as {
      _id?: unknown;
      id?: unknown;
      toString?: () => string;
    };
    const id = value._id || value.id;

    if (typeof id === "string") return id;
    if (id && typeof id === "object" && "toString" in id) return String(id);
    if (value.toString && value.toString !== Object.prototype.toString) {
      return value.toString();
    }
  }

  return "";
};

const getTaskHref = (task: Task) => {
  const workspaceId = getEntityId(task.project?.workspace);
  const projectId = getEntityId(task.project);
  const taskId = getEntityId(task);

  return `/workspace/${workspaceId}/projects/${projectId}/tasks/${taskId}`;
};

const Achieved = () => {
  const [search, setSearch] = useState("");
  const { data: tasks = [], isLoading } = useGetMyTasksQuery() as {
    data?: Task[];
    isLoading: boolean;
  };

  const achievedTasks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tasks
      .filter((task) => task.isArchived)
      .filter((task) => {
        if (!query) return true;

        return (
          task.title.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query) ||
          task.project?.title?.toLowerCase().includes(query)
        );
      })
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
  }, [tasks, search]);

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Achieved</h1>
          <p className="text-sm text-muted-foreground">
            Review tasks that were moved out of active work.
          </p>
        </div>

        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search achieved tasks..."
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Achieved</CardDescription>
            <CardTitle className="text-3xl">{achievedTasks.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Done Tasks</CardDescription>
            <CardTitle className="text-3xl">
              {achievedTasks.filter((task) => task.status === "Done").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>High Priority</CardDescription>
            <CardTitle className="text-3xl">
              {achievedTasks.filter((task) => task.priority === "High").length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center gap-2">
            <Archive className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Achieved Tasks</CardTitle>
          </div>
          <CardDescription>
            Archived tasks remain available for reference.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {achievedTasks.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-3 px-6 text-center">
              <CheckCircle2 className="h-10 w-10 text-muted-foreground" />
              <div>
                <p className="font-medium">No achieved tasks found</p>
                <p className="text-sm text-muted-foreground">
                  Archived tasks will appear here.
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y">
              {achievedTasks.map((task) => (
                <Link
                  key={task._id}
                  to={getTaskHref(task)}
                  className="grid gap-4 p-5 transition-colors hover:bg-muted/40 lg:grid-cols-[1fr_280px]"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate font-medium">{task.title}</h3>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                    {task.description && (
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {task.description}
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge variant="outline">{task.status}</Badge>
                      <Badge variant="secondary">{task.priority}</Badge>
                      <Badge variant="outline">{task.project?.title}</Badge>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center gap-2 text-sm text-muted-foreground lg:text-right">
                    <div className="flex items-center gap-2 lg:justify-end">
                      <CalendarDays className="h-4 w-4" />
                      <span>
                        Due:{" "}
                        {task.dueDate
                          ? format(new Date(task.dueDate), "MMM d, yyyy")
                          : "No due date"}
                      </span>
                    </div>
                    <span>
                      Archived: {format(new Date(task.updatedAt), "MMM d, yyyy")}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Achieved;
