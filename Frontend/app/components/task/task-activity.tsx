import { fetchData } from "@/lib/fetch-util";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "../loader";
import type { ActivityLog } from "@/types";
import { getActivityIcon } from "./task-icon";

export const TaskActivity = ({ resourceId }: { resourceId: string }) => {
  const { data, isPending } = useQuery({
    queryKey: ["task-activity", resourceId],
    queryFn: () => fetchData(`/task/${resourceId}/activity`),
  }) as {
    data: ActivityLog[];
    isPending: boolean;
  };

  if (isPending) return <Loader />;

  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Activity
      </h3>

      <div className="space-y-4">
        {data && data.length > 0 ? (
          data.map((activity) => (
            <div key={activity._id} className="flex gap-2 rounded-md border bg-background/60 p-2.5">
              <div className="mt-0.5 size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                {getActivityIcon(activity.action)}
              </div>

              <div className="min-w-0 flex-1">
                <p className="break-words [overflow-wrap:anywhere] text-sm">
                  <span className="font-medium">{activity.user.name}</span>{" "}
                  {activity.details?.description}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No activity yet</p>
        )}
      </div>
    </div>
  );
};
