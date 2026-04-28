import type {
  ProjectStatusData,
  StatsCardProps,
  TaskPriorityData,
  TaskTrendsData,
  WorkspaceProductivityData,
} from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ChartBarBig, ChartLine, ChartPie } from "lucide-react";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

interface StatisticsChartsProps {
  stats: StatsCardProps;
  taskTrendsData: TaskTrendsData[];
  projectStatusData: ProjectStatusData[];
  taskPriorityData: TaskPriorityData[];
  workspaceProductivityData: WorkspaceProductivityData[];
}

export const StatisticsCharts = ({
  stats: _stats,
  taskTrendsData,
  projectStatusData,
  taskPriorityData,
  workspaceProductivityData,
}: StatisticsChartsProps) => {
  return (
    <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card className="rounded-2xl border border-border/70 bg-card/90 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-0.5">
              <CardTitle className="text-base font-medium tracking-tight">Task Trends</CardTitle>
              <CardDescription className="text-muted-foreground/90">Daily task status changes</CardDescription>
            </div>
            <ChartLine className="size-5 text-muted-foreground/90" />
          </CardHeader>
          <CardContent className="w-full overflow-x-auto md:overflow-x-hidden">
            <div className="min-w-[280px]">
              <ChartContainer
                className="h-[300px]"
                config={{
                  completed: { color: "#10b981" }, // green
                  inProgress: { color: "#f59e0b" }, // blue
                  todo: { color: "#3b82f6" }, // gray
                }}
              >
                <LineChart data={taskTrendsData}>
                  <XAxis
                    dataKey={"name"}
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />

                  <CartesianGrid strokeDasharray={"3 3"} vertical={false} />
                  <ChartTooltip />

                  <Line
                    type="monotone"
                    dataKey={"completed"}
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="inProgress"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="todo"
                    stroke="#6b7280"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />

                  <ChartLegend content={<ChartLegendContent />} />
                </LineChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border/70 bg-card/90 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-0.5">
              <CardTitle className="text-base font-medium tracking-tight">
                Workspace Productivity
              </CardTitle>
              <CardDescription className="text-muted-foreground/90">Task completion by project</CardDescription>
            </div>
            <ChartBarBig className="h-5 w-5 text-muted-foreground/90" />
          </CardHeader>
          <CardContent className="w-full overflow-x-auto md:overflow-x-hidden">
            <div className="min-w-[280px]">
              <ChartContainer
                className="h-[300px]"
                config={{
                  completed: { color: "#3b82f6" },
                  total: { color: "red" },
                }}
              >
                <BarChart
                  data={workspaceProductivityData}
                  barGap={0}
                  barSize={20}
                >
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="total"
                    fill="#000"
                    radius={[4, 4, 0, 0]}
                    name="Total Tasks"
                  />
                  <Bar
                    dataKey="completed"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    name="Completed Tasks"
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6 lg:col-span-1">
        <Card className="rounded-2xl border border-border/70 bg-card/90 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-0.5">
              <CardTitle className="text-base font-medium tracking-tight">
                Project Status
              </CardTitle>
              <CardDescription className="text-muted-foreground/90">Project status breakdown</CardDescription>
            </div>

            <ChartPie className="size-5 text-muted-foreground/90" />
          </CardHeader>

          <CardContent className="w-full overflow-x-auto md:overflow-x-hidden">
            <div className="flex w-full items-center justify-center">
              <ChartContainer
                className="h-[300px] w-full max-w-[320px] mx-auto [&_.recharts-wrapper]:!mx-auto"
                config={{
                  Completed: { color: "#10b981" },
                  "In Progress": { color: "#3b82f6" },
                  Planning: { color: "#f59e0b" },
                }}
              >
                <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <Pie
                    data={projectStatusData}
                    cx="50%"
                    cy="50%"
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    label={false}
                    labelLine={false}
                  >
                    {projectStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                  <ChartLegend content={<ChartLegendContent />} />
                </PieChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border/70 bg-card/90 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-0.5">
              <CardTitle className="text-base font-medium tracking-tight">
                Task Priority
              </CardTitle>
              <CardDescription className="text-muted-foreground/90">Task priority breakdown</CardDescription>
            </div>
          </CardHeader>

          <CardContent className="w-full overflow-x-auto md:overflow-x-hidden">
            <div className="flex w-full items-center justify-center">
              <ChartContainer
                className="h-[300px] w-full max-w-[320px] mx-auto [&_.recharts-wrapper]:!mx-auto"
                config={{
                  High: { color: "#ef4444" },
                  Medium: { color: "#f59e0b" },
                  Low: { color: "#6b7280" },
                }}
              >
                <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <Pie
                    data={taskPriorityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                    label={false}
                    labelLine={false}
                  >
                    {taskPriorityData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                  <ChartLegend content={<ChartLegendContent />} />
                </PieChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
