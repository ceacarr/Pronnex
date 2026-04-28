import { RecentProjects } from "@/components/dashboard/recnt-projects";
import { StatsCard } from "@/components/dashboard/stat-card";
import { StatisticsCharts } from "@/components/dashboard/statistics-charts";
import { Loader } from "@/components/loader";
import { UpcomingTasks } from "@/components/upcoming-tasks";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useGetWorkspaceStatsQuery } from "@/hooks/use-workspace";
import { CalendarDays } from "lucide-react";
import type {
  Project,
  ProjectStatusData,
  StatsCardProps,
  Task,
  TaskPriorityData,
  TaskTrendsData,
  WorkspaceProductivityData,
} from "@/types";
import { useLoaderData, useSearchParams } from "react-router";
import type { Workspace } from "@/types";
import { format } from "date-fns";
import { useMemo, useState } from "react";

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchParams] = useSearchParams();
  const loaderData = useLoaderData() as { workspaces?: Workspace[] } | null;
  const workspaces = loaderData?.workspaces ?? [];
  const workspaceId = searchParams.get("workspaceId") ?? workspaces[0]?._id ?? "";

  const { data, isPending } = useGetWorkspaceStatsQuery(workspaceId) as {
    data: {
      stats: StatsCardProps;
      taskTrendsData: TaskTrendsData[];
      projectStatusData: ProjectStatusData[];
      taskPriorityData: TaskPriorityData[];
      workspaceProductivityData: WorkspaceProductivityData[];
      upcomingTasks: Task[];
      recentProjects: Project[];
    };
    isPending: boolean;
  };

  const calendarInteractionDates = useMemo(() => {
    const interactionRed: Date[] = [];
    const interactionYellow: Date[] = [];
    const interactionGreen: Date[] = [];

    if (!data?.upcomingTasks) {
      return { interactionRed, interactionYellow, interactionGreen };
    }

    data.upcomingTasks.forEach((task) => {
      if (!task.dueDate) return;
      const day = new Date(task.dueDate);
      day.setHours(0, 0, 0, 0);

      if (task.priority === "High") interactionRed.push(day);
      else if (task.priority === "Medium") interactionYellow.push(day);
      else interactionGreen.push(day);
    });

    return { interactionRed, interactionYellow, interactionGreen };
  }, [data?.upcomingTasks]);

  if (!workspaceId) {
    return (
      <div className="space-y-8 2xl:space-y-12">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
        <div className="rounded-lg border bg-muted/40 p-8 text-center">
          <h2 className="text-lg font-semibold">No workspace selected</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Create or select a workspace to view dashboard statistics.
          </p>
        </div>
      </div>
    );
  }

  if (isPending) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-8 2xl:space-y-12">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
        <div className="rounded-lg border bg-muted/40 p-8 text-center">
          <h2 className="text-lg font-semibold">Dashboard data unavailable</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Select a workspace again or refresh the page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 2xl:space-y-12">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground/90">
            Workspace overview and performance metrics
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="h-8 rounded-full border-border/70 bg-background/80 px-3 text-xs font-normal text-muted-foreground"
              >
                <CalendarDays className="mr-1 size-3.5" />
                {format(selectedDate, "MMM d, yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={selectedDate}
                modifiers={{
                  interactionRed: calendarInteractionDates.interactionRed,
                  interactionYellow: calendarInteractionDates.interactionYellow,
                  interactionGreen: calendarInteractionDates.interactionGreen,
                }}
                onSelect={(date) => {
                  if (date) setSelectedDate(date);
                }}
              />
            </PopoverContent>
          </Popover>
          <span className="rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs text-muted-foreground">
            This Week
          </span>
        </div>
      </div>

      <StatsCard data={data.stats} />

      <StatisticsCharts
        stats={data.stats}
        taskTrendsData={data.taskTrendsData}
        projectStatusData={data.projectStatusData}
        taskPriorityData={data.taskPriorityData}
        workspaceProductivityData={data.workspaceProductivityData}
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RecentProjects data={data.recentProjects} />
        </div>
        <div className="xl:col-span-1">
          <UpcomingTasks data={data.upcomingTasks} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
