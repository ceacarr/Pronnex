import { ProjectStatus, type MembersProps } from "@/types";
import { projectSchema } from "@/lib/schema";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCreateProject } from "@/hooks/use-workspace";
import { Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Form,
     FormControl,
      FormItem,
      FormField,
      FormMessage,
      FormLabel } from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns/format";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { Checkbox } from "../ui/checkbox";
import { toast } from "sonner";

interface CreateProjectDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
  workspaceMembers: MembersProps[];
}

export type CreateProjectFormData = z.infer<typeof projectSchema>;

export const CreateProjectDialog = ({
  isOpen,
  onOpenChange,
  workspaceId,
  workspaceMembers,
}: CreateProjectDialogProps) => {
 
  const form = useForm<CreateProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      status: ProjectStatus.Planned,
      startDate: "",
      dueDate: "",
      members: [],
      tags: "",
    },
  }); 
  const { mutate, isPending } = useCreateProject();
  const onSubmit = (values: CreateProjectFormData) => {
    if (!workspaceId) return;

    mutate(
      {
        projectData: values,
        workspaceId,
      },
      {
        onSuccess: () => {
          toast.success("Project created successfully");
          form.reset();
          onOpenChange(false);
        },
        onError: (error: any) => {
          const errorMessage = error.response.data.message;
          toast.error(errorMessage);
          console.log(error);
        },
      }
    );
  };

  return <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[calc(100vw-2rem)] overflow-x-hidden sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new project.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid w-full min-w-0 gap-4 overflow-x-hidden">
           <FormField
            name="title"
             control={form.control}
              render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel>Project Title</FormLabel>
                <FormControl className="min-w-0">
                    <Input {...field} placeholder="Project Title" className="w-full min-w-0"/>
                </FormControl>
                <FormMessage />
              </FormItem>
              
            )} />
            <FormField
            name="description"
             control={form.control}
              render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel>Project Description</FormLabel>
                <FormControl className="min-w-0">
                    <Textarea
                      {...field}
                      placeholder="Project Description"
                      className="w-full min-w-0 break-all"
                    />
                </FormControl>
                <FormMessage />
              </FormItem>
              
            )} />
            <div className="grid w-full min-w-0 gap-4">
    
              <FormField
                name="startDate"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="min-w-0">
                    <FormLabel>Start Date</FormLabel>
                 <FormControl className="min-w-0">
                      <Popover modal={true}>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant={"outline"}
                            className={
                              "w-full min-w-0 justify-start overflow-hidden text-left font-normal " +
                              (!field.value ? "text-muted-foreground" : "")
                            }
                          >
                            <CalendarIcon className="size-4 mr-2" />
                            {field.value ? (
                              <span className="truncate">{format(new Date(field.value), "PPPP")}</span>
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] max-w-[90vw] p-0">
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={(date: any) => {
                              field.onChange(date?.toISOString() || undefined);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="dueDate"
                control={form.control}
                render={({ field }) => (    
                  <FormItem className="min-w-0">
                    <FormLabel>Due Date</FormLabel>
                 <FormControl className="min-w-0">
                      <Popover modal={true}>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant={"outline"}
                            className={
                              "w-full min-w-0 justify-start overflow-hidden text-left font-normal " +
                              (!field.value ? "text-muted-foreground" : "")
                            }
                          >
                            <CalendarIcon className="size-4 mr-2" />
                            {field.value ? (
                              <span className="truncate">{format(new Date(field.value), "PPPP")}</span>
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] max-w-[90vw] p-0">
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={(date: Date | undefined) => {
                              field.onChange(date?.toISOString() || undefined);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
           <FormField
            name="tags"
             control={form.control}
              render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel>Tags</FormLabel>
                <FormControl className="min-w-0">
                    <Input {...field} 
                    placeholder="Enter tags separated by commas"
                    className="w-full min-w-0"
                    />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} 
            />
             <FormField
              name="members"
              control={form.control}
              render={({ field }) => {
                  const selectedMembers = field.value || []; 
                  return (
              <FormItem className="min-w-0">
                <FormLabel>Members</FormLabel>
                <FormControl className="min-w-0">
                    <Popover>
                        <PopoverTrigger asChild>
                     <Button
                       type="button"
                       variant={"outline"}
                       className="w-full min-w-0 justify-start overflow-hidden text-left font-normal min-h-11"
                           >
                       <span className="truncate">
                       {selectedMembers.length === 0 ? (
                       <span className="text-muted-foreground">
                        Select Members
                       </span>
                     ) : selectedMembers.length <= 2 ? (
                        selectedMembers.map((m) => {
                         const member = workspaceMembers.find(
                        (wm) => wm.user._id === m.user
                          );

                     return `${member?.user.name} (${member?.role})`;
                     }).join(", ")
                     ) : (
                    `${selectedMembers.length} members selected`
                        )}
                        </span>
                      </Button>
                 </PopoverTrigger>
                        <PopoverContent
                          className="w-[var(--radix-popover-trigger-width)] max-w-[90vw] max-h-60 overflow-y-auto"
                          align="start"
                          sideOffset={4}
                        >
                          <div className="flex flex-col gap-2">
                            {workspaceMembers.map((member) => {
                              const selectedMember = selectedMembers.find(
                      (m) => m.user === member.user._id
                    );  
                 return (
                      <div
                        key={member._id}
                        className="flex items-center gap-2 "
                      >
                        <Checkbox
                          checked={!!selectedMember}
                          onCheckedChange={(checked: any) => {
                            if (checked) {
                              field.onChange([
                                ...selectedMembers,
                                {
                                  user: member.user._id,
                                  role: "contributor",
                                },
                              ]);
                            } else {
                              field.onChange(
                                selectedMembers.filter(
                                  (m) => m.user !== member.user._id
                                )
                              );
                            }
                          }}
                          id={`member-${member.user._id}`}
                        />
                        <span className="truncate flex-1">
                          {member.user.name}
                        </span>  
                     {selectedMember && (
                          <Select
                            value={selectedMember.role}
                            onValueChange={(role) => {
                              field.onChange(
                                selectedMembers.map((m) =>
                                  m.user === member.user._id
                                    ? {    ...m, role: role as | "contributor" | "manager"| "viewer", }
                                    : m
                                )
                              );
                            }}
                          >
                            <SelectTrigger className="w-full min-w-0">
                              <SelectValue placeholder="Select Role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="manager">
                                Manager
                              </SelectItem>
                              <SelectItem value="contributor">
                                Contributor
                              </SelectItem>
                              <SelectItem value="viewer">
                                Viewer
                              </SelectItem>
                            </SelectContent>
                          </Select>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <div className="grid w-full min-w-0 gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
              <FormField
                name="status"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="min-w-0">
                    <FormLabel>Project Status</FormLabel>
                    <FormControl className="min-w-0">
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full min-w-0">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(ProjectStatus).map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPending} className="sm:min-w-40">
                {isPending ? "Creating..." : "Create Project"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>

};

