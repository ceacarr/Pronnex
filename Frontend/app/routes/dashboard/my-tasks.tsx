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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  MyTasksCalendarView,
  MyTasksTimelineView,
} from "@/components/my-tasks/task-visualizations";
import { useGetMyTasksQuery } from "@/hooks/use-task";
import { ArrowUpRight, CalendarDays, CheckCircle, Clock, Clock3, FilterIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    if (urlSort !== sortDirection)
      setSortDirection(urlSort === "asc" ? "asc" : "desc");
    if (urlSearch !== search) setSearch(urlSearch);
  }, [searchParams]);

  const { data: tasks, isLoading } = useGetMyTasksQuery() as {
    data?: any[];
    isLoading: boolean;
  };

  const sortedTasks = tasks ?? [];

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between md:items-center">
        <h1 className="font-bold text-2xl"> My Task</h1>
        <div className="flex flex-col items-start gap-2 md:flex-row">
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

      <Input
        placeholder="Search tasks ..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />

      <Tabs defaultValue="list">
        <TabsList>
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

        <TabsContent value="list">
          <Card>
            <CardHeader>
             <CardTitle> My Tasks</CardTitle>
             <CardDescription>
             {sortedTasks?.length} tasks assigned to you 
             </CardDescription>
           </CardHeader>
           <CardContent>
               <div className="divide-y">
               {sortedTasks?.map((task) => (
         <div key={task._id} className="p-4 hover:bg-muted/50" >
             <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-3">
               <div className="flex">
                 <div className="flex items-center gap-2 mr-2">
                    {task.status ===  "Done" ? (
                   <CheckCircle className="size-4 text-green-500"/> 
                 ): (
                <Clock  className="size-4  text-yellow-500" /> 
                   )}
              </div>
          <div className="">
                    <Link
                     to={`/workspaces/${task.project.workspace}/projects/${task.project._id}/tasks/${task._id}`}
                      className="font-medium hover:text-primary transition-colors flex items-center"
                         >
                     {task.title}
                      <ArrowUpRight className="size-4 ml-1" />
                         </Link>
                         <div className="flex items-center space-x-2 mt-1">
                        <Badge variant={task.status === "Done" ? "default" : "outline"}>
                                   {task.status}
                           </Badge>
                      {task.priority && (
                            <Badge
                              variant={task.priority === "High" ? "destructive": "secondary"}>
                               {task.priority} 
                            </Badge>
                        )}
                        {task.isArchived && (
                            <Badge variant={"outline"}>
                                Archived
                            </Badge>
                        )}
                </div>
            </div>               
        </div>
    </div>
</div>
                     ))}
               </div>
           </CardContent>
         </Card>
       </TabsContent>

      <TabsContent value="board">
    <Card>
    
    </Card>
      </TabsContent>

        <TabsContent value="calender" className="mt-4">
          <MyTasksCalendarView />
        </TabsContent>
        <TabsContent value="timeline" className="mt-4">
          <MyTasksTimelineView />
        </TabsContent>
      </Tabs>
    </div>
  );
};  

export default MyTasks;
