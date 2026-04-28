import type { TaskPriority } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useUpdateTaskPriorityMutation } from "@/hooks/use-task";
import { toast } from "sonner";


export const TaskPrioritySelector = ({
 priority,
 taskId,
}: {
    priority: TaskPriority;
    taskId: string;
}) => {
    const {mutate, isPending} = useUpdateTaskPriorityMutation();
    const handleStatusChange = (value: string) => {
        mutate ({ taskId, priority : value as TaskPriority}, 
            {
            onSuccess:() => {
                toast.success("Status updated successfully");
            },
            onError: (error: any) => {
                const errorMessage = error.response.data.message;
                toast.error(errorMessage);
              
            },
        });
    };
    return <Select value={priority || "Low"} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-[180px]" disabled={isPending}>
            <SelectValue placeholder="Status"/>
        </SelectTrigger>
        <SelectContent>
            <SelectItem value = "Low">Low</SelectItem>
               <SelectItem value = "Medium">Medium</SelectItem>
                  <SelectItem value = "High">High</SelectItem>
        </SelectContent>
    </Select>
};
