import type { StatsCardProps } from "@/types";
import { FolderKanban, ListTodo, PlayCircle, Timer } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";

export const StatsCard = ({ data }: { data: StatsCardProps }) => {
  const items = [
    {
      title: "Total Projects",
      value: data.totalProjects,
      subtitle: `${data.totalProjectInProgress} in progress`,
      icon: FolderKanban,
      tone: "from-transparent to-transparent",
    },
    {
      title: "Total Tasks",
      value: data.totalTasks,
      subtitle: `${data.totalTaskCompleted} completed`,
      icon: ListTodo,
      tone: "from-transparent to-transparent",
    },
    {
      title: "To Do",
      value: data.totalTaskToDo,
      subtitle: "Tasks waiting to be done",
      icon: Timer,
      tone: "from-transparent to-transparent",
    },
    {
      title: "In Progress",
      value: data.totalTaskInProgress,
      subtitle: "Tasks currently in progress",
      icon: PlayCircle,
      tone: "from-transparent to-transparent",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.title} className="overflow-hidden rounded-2xl border border-border/70 bg-card/90 shadow-sm">
            <CardHeader className={`bg-gradient-to-r ${item.tone} pb-3`}>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium tracking-tight text-foreground/90">{item.title}</CardTitle>
                <div className="rounded-md border border-border/60 bg-background/60 p-1.5">
                  <Icon className="size-4 text-foreground/70" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-semibold tracking-tight">{item.value}</div>
              <p className="text-xs text-muted-foreground/90">{item.subtitle}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
