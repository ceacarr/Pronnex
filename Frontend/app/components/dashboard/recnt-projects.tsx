import type { Project } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { getProjectProgress, getTaskStatusColor } from "@/lib";
import { Link, useSearchParams } from "react-router";
import { cn } from "@/lib/utils";
import { Progress } from "../ui/progress";
import { ArrowUpRight, FolderOpen } from "lucide-react";

export const RecentProjects = ({ data }: { data: Project[] }) => {
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");

  return (
    <Card className="rounded-2xl border border-border/70 bg-card/90 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base tracking-tight">
          <FolderOpen className="size-5 text-primary/90" />
          Recent Projects
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {data.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No Recent project yet
          </p>
        ) : (
          data.map((project) => {
            const projectProgress = getProjectProgress(project.tasks);

            return (
              <div key={project._id} className="rounded-xl border border-border/70 bg-background/60 p-4 transition hover:bg-muted/30">
                <div className="flex items-center justify-between mb-2">
                  <Link
                    to={`/workspace/${workspaceId}/projects/${project._id}`}
                    className="group"
                  >
                    <h3 className="flex items-center gap-1.5 font-medium transition-colors group-hover:text-primary">
                      {project.title}
                      <ArrowUpRight className="size-3.5 opacity-0 transition group-hover:opacity-100" />
                    </h3>
                  </Link>

                  <span
                    className={cn(
                      "rounded-full px-2 py-1 text-xs font-medium",
                      getTaskStatusColor(project.status)
                    )}
                  >
                    {project.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                  {project.description}
                </p>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span>Progress</span>
                    <span>{projectProgress}%</span>
                  </div>

                  <Progress value={projectProgress} className="h-2" />
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};
