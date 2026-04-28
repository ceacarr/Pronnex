import type { Task } from "@/types";
import { Link, useSearchParams } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { cn } from "@/lib/utils";
import { CalendarClock, CheckCircle2, Circle } from "lucide-react";
import { format } from "date-fns";

export const UpcomingTasks = ({ data }: { data: Task[] }) => {
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");

  return (
    <Card className="rounded-2xl border border-border/70 bg-card/90 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base tracking-tight">
          <CalendarClock className="size-5 text-primary/90" />
          Upcoming Tasks
        </CardTitle>
        <CardDescription className="text-muted-foreground/90">
          Here are the tasks that are due soon
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {data.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No upcoming tasks yet
          </p>
        ) : (
          data.map((task) => (
            <Link
              to={`/workspace/${workspaceId}/projects/${
                typeof task.project === "string" ? task.project : task.project._id
              }/tasks/${task._id}`}
              key={task._id}
              className="flex items-start space-x-3 rounded-lg border border-border/70 bg-background/60 p-3 transition hover:bg-muted/30"
            >
              <div
                className={cn(
                  "mt-0.5 rounded-full p-1",
                  task.priority === "High" && "bg-red-100/80 text-red-700",
                  task.priority === "Medium" && "bg-amber-100/80 text-amber-700",
                  task.priority === "Low" && "bg-slate-100/90 text-slate-700"
                )}
              >
                {task.status === "Done" ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Circle className="w-4 h-4" />
                )}
              </div>

              <div className="space-y-1">
                <p className="font-medium text-sm md:text-base">{task.title}</p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <span>{task.status}</span>
                  {task.dueDate && (
                    <>
                      <span className="mx-1"> - </span>
                      <span>
                        {format(new Date(task.dueDate), "MMM d, yyyy")}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
};
