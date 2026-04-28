import { useState } from "react";
import { Button } from "../ui/button";
import { Edit } from "lucide-react";
import { useUpdateTaskDescriptionMutation } from "@/hooks/use-task";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";

export const TaskDescription = ({
  description,
  taskId,
}: {
  description: string;
  taskId: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newDescription, setNewDescription] = useState(description);
  const { mutate, isPending } = useUpdateTaskDescriptionMutation();
  const updateDescription = () => {
    mutate(
      { taskId, description: newDescription },
      {
        onSuccess: () => {
          setIsEditing(false);
          toast.success("Description updated successfully");
        },
        onError: (error: any) => {
          const errorMessage = error.response.data.message;
          toast.error(errorMessage);
          console.log(error);
        },
      }
    );
  };

  return (
    <div className="flex items-start gap-2">
      {isEditing ? (
        <Textarea
          className="w-full min-w-0"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          disabled={isPending}
        />
      ) : (
        <div className="min-w-0 flex-1 break-words [overflow-wrap:anywhere] text-sm text-muted-foreground md:text-base">
          {description}
        </div>
      )}
      {isEditing ? (
        <Button
          className="py-0"
          size="sm"
          onClick={updateDescription}
          disabled={isPending}
        >
          Save
        </Button>
      ) : (
        <Edit
          className="size-3 cursor-pointer"
          onClick={() => setIsEditing(true)}
        />
      )}
    </div>
  );
};
