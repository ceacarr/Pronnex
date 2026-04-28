import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateTask } from "@/hooks/use-task";
import type { MembersProps, TaskPriority, TaskStatus } from "@/types";
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
import { toast } from "sonner";

const taskStatusOptions: TaskStatus[] = ["To Do", "In Progress", "Done"];
const taskPriorityOptions: TaskPriority[] = ["Low", "Medium", "High"];

const createTaskSchema = z.object({
  title: z.string().min(3, "Task title is required"),
  description: z.string().optional(),
  status: z.enum(["To Do", "In Progress", "Done"]),
  priority: z.enum(["Low", "Medium", "High"]),
  dueDate: z.string().optional(),
  assignees: z.array(z.string()).optional(),
});

export type CreateTaskFormData = z.infer<typeof createTaskSchema>;

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectMembers: MembersProps[];
}

export const CreateTaskDialog = ({
  open,
  onOpenChange,
  projectId,
  projectMembers,
}: CreateTaskDialogProps) => {
  const form = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "To Do",
      priority: "Medium",
      dueDate: "",
      assignees: [],
    },
  });

  const { mutate, isPending } = useCreateTask();

  const onSubmit = (values: CreateTaskFormData) => {
    mutate(
      {
        projectId,
        taskData: values,
      },
      {
        onSuccess: () => {
          toast.success("Task created successfully");
          form.reset();
          onOpenChange(false);
        },
        onError: (error: any) => {
          const message =
            error?.response?.data?.message || error?.message || "Task create failed";
          toast.error(message);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[calc(100vw-2rem)] overflow-x-hidden sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
          <DialogDescription>Add a new task to this project.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="min-w-0 space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="min-w-0">
                  <FormLabel>Title</FormLabel>
                  <FormControl className="min-w-0">
                    <Input {...field} placeholder="Task title" className="w-full min-w-0" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="min-w-0">
                  <FormLabel>Description</FormLabel>
                  <FormControl className="min-w-0">
                    <Textarea
                      {...field}
                      placeholder="Task description"
                      className="w-full min-w-0 break-all"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid min-w-0 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="min-w-0">
                    <FormLabel>Status</FormLabel>
                    <FormControl className="min-w-0">
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full min-w-0">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {taskStatusOptions.map((status) => (
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

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem className="min-w-0">
                    <FormLabel>Priority</FormLabel>
                    <FormControl className="min-w-0">
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full min-w-0">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          {taskPriorityOptions.map((priority) => (
                            <SelectItem key={priority} value={priority}>
                              {priority}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="min-w-0">
                  <FormLabel>Due Date</FormLabel>
                  <FormControl className="min-w-0">
                    <Popover modal>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={
                            "w-full min-w-0 justify-start overflow-hidden text-left font-normal " +
                            (!field.value ? "text-muted-foreground" : "")
                          }
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          <span className="truncate">
                            {field.value ? format(new Date(field.value), "PPPP") : "Pick a date"}
                          </span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-[var(--radix-popover-trigger-width)] max-w-[90vw] p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => field.onChange(date ? date.toISOString() : "")}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="assignees"
              render={({ field }) => (
                <FormItem className="min-w-0">
                  <FormLabel>Assignees</FormLabel>
                  <FormControl className="min-w-0">
                    <Select
                      value={field.value?.[0] || ""}
                      onValueChange={(value) => field.onChange(value ? [value] : [])}
                    >
                      <SelectTrigger className="w-full min-w-0">
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                      <SelectContent>
                        {projectMembers.map((member) => (
                          <SelectItem key={member._id} value={member.user._id}>
                            {member.user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Create Task"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
