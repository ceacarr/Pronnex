import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MyTasksCalendarView,
  MyTasksTimelineView,
} from "@/components/my-tasks/task-visualizations";
import { useGetMyTasksQuery } from "@/hooks/use-task";
import type { Task } from "@/types";
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle,
  Clock,
  Clock3,
  FilterIcon,
} from "lucide-react";
import { format } from "date-fns/format";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";

const boardColumns: Array<{
  title: Task["status"];
  description: string;
}> = [
  { title: "To Do", description: "Tasks waiting to be started" },
  { title: "In Progress", description: "Tasks currently being worked on" },
  { title: "Done", description: "Completed tasks" },
];

const getEntityId = (entity: unknown) => {
  if (typeof entity === "string") return entity;
  if (entity && typeof entity === "object") {
    const value = entity as { _id?: unknown; id?: unknown; toString?: () => string };
    const id = value._id || value.id;

    if (typeof id === "string") return id;
    if (id && typeof id === "object" && "toString" in id) return String(id);
    if (value.toString && value.toString !== Object.prototype.toString) {
      return value.toString();
    }
  }

  return "";
};

const MyTasks = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialFilter = searchParams.get("filter") || "all";
  const initialSort = searchParams.get("sort") || "desc";
  const initialSearch = searchParams.get("search") || "";

  const [filter, setFilter] = useState<string>(initialFilter);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(
    initialSort === "asc" ? "asc" : "desc"
  );
  const [search, setSearch] = useState<string>(initialSearch);

  useEffect(() => {
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    params.filter = filter;
    params.sort = sortDirection;
    params.search = search;

    setSearchParams(params, { replace: true });
  }, [filter, sortDirection, search]);

  useEffect(() => {
    const urlFilter = searchParams.get("filter") || "all";
    const urlSort = searchParams.get("sort") || "desc";
    const urlSearch = searchParams.get("search") || "";

    if (urlFilter !== filter) setFilter(urlFilter);
    if (urlSort !== sortDirection) {
      setSortDirection(urlSort === "asc" ? "asc" : "desc");
    }
    if (urlSearch !== search) setSearch(urlSearch);
  }, [searchParams]);

  const { data: tasks = [], isLoading } = useGetMyTasksQuery() as {
    data?: Task[];
    isLoading: boolean;
  };

  const filteredTasks = tasks
    .filter((task) => {
      if (filter === "all") return true;
      if (filter === "todo") return task.status === "To Do";
      if (filter === "inprogress") return task.status === "In Progress";
      if (filter === "done") return task.status === "Done";
      if (filter === "achieved") return task.isArchived === true;
      if (filter === "high") return task.priority === "High";

      return true;
    })
    .filter(
      (task) =>
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description?.toLowerCase().includes(search.toLowerCase())
    );

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.dueDate && b.dueDate) {
      return sortDirection === "asc"
        ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        : new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
    }

    return 0;
  });

  const getTaskHref = (task: Task) => {
    const workspaceId = getEntityId(task.project?.workspace);
    const projectId = getEntityId(task.project);
    const taskId = getEntityId(task);

    return `/workspace/${workspaceId}/projects/${projectId}/tasks/${taskId}`;
  };

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-bold text-2xl">My Task</h1>
          <p className="text-sm text-muted-foreground">
            Track your assigned work across list, calendar, and timeline views.
          </p>
        </div>

        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
          <Button
            variant="outline"
            onClick={() =>
              setSortDirection(sortDirection === "asc" ? "desc" : "asc")
            }
          >
            {sortDirection === "asc" ? "Due Oldest" : "Due Newest"}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <FilterIcon className="h-4 w-4" /> Filter
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuLabel>Filter Tasks</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilter("all")}>
                All Tasks
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("todo")}>
                To Do
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("inprogress")}>
                In Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("done")}>
                Done
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("achieved")}>
                Achieved
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("high")}>
                High
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Tabs defaultValue="list" className="space-y-4">
        <div className="flex flex-col gap-3 rounded-lg border bg-background p-3 md:flex-row md:items-center md:justify-between">
          <Input
            placeholder="Search tasks ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:max-w-md"
          />
          <TabsList className="shrink-0">
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="board">Board</TabsTrigger>
            <TabsTrigger value="calender">
              <CalendarDays className="h-4 w-4" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="timeline">
              <Clock3 className="h-4 w-4" />
              Timeline
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="list" className="mt-0">
          <Card>
            <CardHeader className="border-b">
              <CardTitle>My Tasks</CardTitle>
            </CardHeader>

            <CardContent className="p-0">
              {sortedTasks.length === 0 ? (
                <div className="p-6 text-sm text-muted-foreground">
                  No tasks found
                </div>
              ) : (
                <div className="divide-y">
                  {sortedTasks.map((task) => (
                    <div
                      key={task._id}
                      className="px-5 py-5 transition-colors hover:bg-muted/50"
                    >
                      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_340px] md:items-center">
                        <div className="flex min-w-0 items-start gap-3">
                          <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center">
                            {task.status === "Done" ? (
                              <CheckCircle className="size-4 text-green-500" />
                            ) : (
                              <Clock className="size-4 text-yellow-500" />
                            )}
                          </div>

                          <div className="min-w-0 space-y-2">
                            <Link
                              to={getTaskHref(task)}
                              className="flex w-fit max-w-full items-center font-medium transition-colors hover:text-primary"
                            >
                              <span className="truncate">{task.title}</span>
                              <ArrowUpRight className="ml-1 size-4 shrink-0" />
                            </Link>

                            <div className="flex flex-wrap items-center gap-2">
                              <Badge
                                variant={
                                  task.status === "Done" ? "default" : "outline"
                                }
                              >
                                {task.status}
                              </Badge>
                              {task.priority && (
                                <Badge
                                  variant={
                                    task.priority === "High"
                                      ? "destructive"
                                      : "secondary"
                                  }
                                >
                                  {task.priority}
                                </Badge>
                              )}
                              {task.isArchived && (
                                <Badge variant="outline">Archived</Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="grid gap-1 text-sm text-muted-foreground md:justify-self-end md:text-right">
                          {task.dueDate && (
                            <div>Due: {format(new Date(task.dueDate), "PPPP")}</div>
                          )}
                          <div>
                            Project:{" "}
                            <span className="font-medium">
                              {task.project.title}
                            </span>
                          </div>
                          <div>
                            Modified on:{" "}
                            {format(new Date(task.updatedAt), "PPPP")}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="board" className="mt-0">
          <div className="grid gap-4 lg:grid-cols-3">
            {boardColumns.map((column) => {
              const columnTasks = sortedTasks.filter(
                (task) => task.status === column.title
              );

              return (
                <Card key={column.title} className="min-h-[420px]">
                  <CardHeader className="border-b">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <CardTitle className="text-base">
                          {column.title}
                        </CardTitle>
                        <CardDescription>{column.description}</CardDescription>
                      </div>
                      <Badge variant="outline">{columnTasks.length}</Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3 p-3">
                    {columnTasks.length === 0 ? (
                      <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                        No tasks
                      </div>
                    ) : (
                      columnTasks.map((task) => (
                        <Link
                          key={task._id}
                          to={getTaskHref(task)}
                          className="block rounded-md border bg-background p-3 transition-colors hover:bg-muted/50"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 space-y-2">
                              <div className="flex items-center gap-1 font-medium">
                                <span className="truncate">{task.title}</span>
                                <ArrowUpRight className="size-4 shrink-0" />
                              </div>
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge
                                  variant={
                                    task.priority === "High"
                                      ? "destructive"
                                      : "secondary"
                                  }
                                >
                                  {task.priority}
                                </Badge>
                                {task.isArchived && (
                                  <Badge variant="outline">Archived</Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                            <div className="truncate">
                              Project: {task.project.title}
                            </div>
                            {task.dueDate && (
                              <div>
                                Due: {format(new Date(task.dueDate), "PP")}
                              </div>
                            )}
                          </div>
                        </Link>
                      ))
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
        <TabsContent value="calender" className="mt-0">
          <MyTasksCalendarView />
        </TabsContent>
        <TabsContent value="timeline" className="mt-0">
          <MyTasksTimelineView />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyTasks;
