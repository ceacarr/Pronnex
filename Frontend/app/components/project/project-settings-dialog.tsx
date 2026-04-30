import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useDeleteProject, useUpdateProject } from "@/hooks/use-project";
import { projectSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { ProjectStatus, type Project } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import type { z } from "zod";

type ProjectSettingsFormData = z.infer<typeof projectSchema>;

interface ProjectSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project & { tags?: string[] };
  workspaceId?: string;
}

const toDateValue = (date?: Date | string) =>
  date ? new Date(date).toISOString() : "";

export const ProjectSettingsDialog = ({
  open,
  onOpenChange,
  project,
  workspaceId,
}: ProjectSettingsDialogProps) => {
  const navigate = useNavigate();
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const { mutate: updateProject, isPending: isUpdating } = useUpdateProject();
  const { mutate: deleteProject, isPending: isDeleting } = useDeleteProject();

  const form = useForm<ProjectSettingsFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project.title,
      description: project.description || "",
      status: project.status,
      startDate: toDateValue(project.startDate),
      dueDate: toDateValue(project.dueDate),
      tags: project.tags?.join(", ") || "",
      members: project.members?.map((member) => ({
        user:
          typeof member.user === "string"
            ? member.user
            : member.user?._id || "",
        role:
          member.role === "manager" ||
          member.role === "contributor" ||
          member.role === "viewer"
            ? member.role
            : "contributor",
      })),
    },
  });

  useEffect(() => {
    if (!open) return;

    form.reset({
      title: project.title,
      description: project.description || "",
      status: project.status,
      startDate: toDateValue(project.startDate),
      dueDate: toDateValue(project.dueDate),
      tags: project.tags?.join(", ") || "",
      members: project.members?.map((member) => ({
        user:
          typeof member.user === "string"
            ? member.user
            : member.user?._id || "",
        role:
          member.role === "manager" ||
          member.role === "contributor" ||
          member.role === "viewer"
            ? member.role
            : "contributor",
      })),
    });
    setIsConfirmingDelete(false);
  }, [form, open, project]);

  const handleSubmit = (values: ProjectSettingsFormData) => {
    updateProject(
      {
        projectId: project._id,
        projectData: values,
      },
      {
        onSuccess: () => {
          toast.success("Project settings updated");
          onOpenChange(false);
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Failed to update project");
        },
      }
    );
  };

  const handleDeleteProject = () => {
    deleteProject({ projectId: project._id, workspaceId }, {
      onSuccess: () => {
        toast.success("Project deleted successfully");
        onOpenChange(false);
        navigate(workspaceId ? `/workspace/${workspaceId}` : "/workspaces");
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Failed to delete project");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-full max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Project Settings</DialogTitle>
          <DialogDescription>
            Update project details, review members, and manage irreversible actions.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="rounded-lg border p-4">
              <div className="grid gap-4">
                <FormField
                  name="title"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Project title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="description"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Project description" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="status"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(ProjectStatus).map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <ProjectDateField
                    control={form.control}
                    name="startDate"
                    label="Start Date"
                  />
                  <ProjectDateField
                    control={form.control}
                    name="dueDate"
                    label="Due Date"
                  />
                </div>

                <FormField
                  name="tags"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="coding, web dev, backend"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-fit" disabled={isUpdating}>
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="font-semibold">Project Members</h3>
              <p className="text-sm text-muted-foreground">
                List of all members in this project.
              </p>
              <div className="mt-4 space-y-3">
                {project.members?.map((member) => {
                  const user =
                    typeof member.user === "string" ? undefined : member.user;

                  return (
                    <div
                      key={user?._id || String(member.user)}
                      className="flex items-center justify-between gap-3 rounded-md border p-3"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={user?.profilePicture} />
                          <AvatarFallback>
                            {user?.name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="truncate font-medium">
                          {user?.name || "Unknown member"}
                        </span>
                      </div>
                      <Badge
                        className={cn(
                          "capitalize",
                          member.role === "manager" &&
                            "bg-red-600 hover:bg-red-600"
                        )}
                        variant={member.role === "manager" ? "default" : "outline"}
                      >
                        {member.role}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-lg border border-red-200 p-4">
              <h3 className="font-semibold text-red-600">Danger Zone</h3>
              <p className="text-sm text-muted-foreground">
                Irreversible actions for your project.
              </p>
              <div className="mt-4">
                {isConfirmingDelete ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleDeleteProject}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4" />
                      {isDeleting ? "Deleting..." : "Confirm Delete"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsConfirmingDelete(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setIsConfirmingDelete(true)}
                  >
                    Delete Project
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const ProjectDateField = ({
  control,
  name,
  label,
}: {
  control: any;
  name: "startDate" | "dueDate";
  label: string;
}) => (
  <FormField
    name={name}
    control={control}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <Popover modal={true}>
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !field.value && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {field.value ? format(new Date(field.value), "PPP") : "Pick a date"}
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={field.value ? new Date(field.value) : undefined}
              onSelect={(date) => field.onChange(date?.toISOString() || "")}
            />
          </PopoverContent>
        </Popover>
        <FormMessage />
      </FormItem>
    )}
  />
);
