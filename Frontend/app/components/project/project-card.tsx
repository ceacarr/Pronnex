import type { Project } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Link } from "react-router";
import { cn } from "@/lib/utils";
import { getTaskStatusColor } from "@/lib";
import { Progress } from "../ui/progress";
import { format } from "date-fns/format";
import { CalendarDays } from "lucide-react";


interface ProjectCardProps {
    project: Project;
    progress : number;
    workspaceId: string;
}
export const ProjectCard = ({ project, progress, workspaceId }: ProjectCardProps) => {
    return (    
    <Link to={`/workspace/${workspaceId}/projects/${project._id}`} className="block h-full">
    <Card className="h-full transition-all duration-500 hover:shadow-md hover:translate-y-1">
        <CardHeader className="space-y-2 pb-3">
               <div className="flex items-start justify-between gap-2">
                <CardTitle className="min-w-0 flex-1 line-clamp-1">
                    {project.title}
                </CardTitle>
                <span className={cn("shrink-0 text-xs rounded-full px-2 py-1 ",
                    getTaskStatusColor(project.status)
                )}>
                    {project.status}
                </span>
               </div>
               <CardDescription
                className="min-h-12 max-h-12 overflow-hidden break-words leading-6"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
               >
                {project.description || "No Description"}
               </CardDescription>
        </CardHeader>
        <CardContent className="flex h-full flex-col">
            <div className="flex h-full flex-col space-y-4">
            <div className="space-y-1">
                <div className="flex justify-between text-xs">
                    <span className=""> Progress</span>
                    <span> {progress}% </span>
                </div>
            <Progress
            value= {progress}
            className="h-2"
            />
            </div>
            <div className="mt-auto flex items-center justify-between">
                <div className="flex items-center text-sm gap-2 text-muted-foreground">
                    <span>
                        {project.tasks.length}
                    </span>
                    <span>Tasks</span>
                </div>
                {project.dueDate && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CalendarDays className="w-4 h-4"/>
                             <span>{format(project.dueDate, "MMM d, yyyy")}</span>
                        
                    </div>
                )}
            </div>
            </div>
        </CardContent>
    </Card>
    </Link>
    );
}
