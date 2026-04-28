import { Loader } from "@/components/loader";
import { Calendar } from "@/components/ui/calendar";
import { useGetMyTasksQuery } from "@/hooks/use-task";
import type { Task } from "@/types";
import { addDays, differenceInCalendarDays, format } from "date-fns";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";

const DAY_WIDTH = 48;
const MIN_TIMELINE_DAYS = 30;

const startOfLocalDay = (date: Date) => {
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);

  return day;
};

const getPriorityDotClass = (priority: Task["priority"]) => {
  if (priority === "High") return "bg-red-500";
  if (priority === "Medium") return "bg-yellow-500";

  return "bg-emerald-500";
};

const getPriorityBarClass = (priority: Task["priority"]) => {
  if (priority === "High") return "bg-rose-500";
  if (priority === "Medium") return "bg-violet-500";

  return "bg-green-500";
};

const getAssigneeInitial = (task: Task) => {
  const assignee = task.assignees?.[0];

  if (assignee) {
    return (assignee.name || assignee.email || "?").charAt(0).toUpperCase();
  }

  if (typeof task.assignee === "string") {
    return task.assignee.charAt(0).toUpperCase();
  }

  return (task.assignee?.name || task.assignee?.email || "?")
    .charAt(0)
    .toUpperCase();
};

const useFilteredMyTasks = () => {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter") || "all";
  const search = searchParams.get("search") || "";
  const { data: myTasks = [], isLoading } = useGetMyTasksQuery() as {
    data?: Task[];
    isLoading: boolean;
  };

  const filteredTasks =
    myTasks.length > 0
      ? myTasks
          .filter((task) => {
            if (filter === "all") return true;
            if (filter === "todo") return task.status === "To Do";
            if (filter === "inprogress") return task.status === "In Progress";
            if (filter === "done") return task.status === "Done";
            if (filter === "achieved") return task.isArchived === true;
            if (filter === "high") return task.priority === "High";

            return true;
          })
          .filter(
            (task) =>
              task.title.toLowerCase().includes(search.toLowerCase()) ||
              task.description?.toLowerCase().includes(search.toLowerCase())
          )
      : [];

  return { filteredTasks, isLoading };
};

export const MyTasksCalendarView = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { filteredTasks, isLoading } = useFilteredMyTasks();

  const calendarInteractionDates = useMemo(() => {
    const interactionRed: Date[] = [];
    const interactionYellow: Date[] = [];
    const interactionGreen: Date[] = [];

    filteredTasks.forEach((task) => {
      if (!task.updatedAt) return;

      const day = startOfLocalDay(new Date(task.updatedAt));

      if (task.priority === "High") interactionRed.push(day);
      else if (task.priority === "Medium") interactionYellow.push(day);
      else interactionGreen.push(day);
    });

    return { interactionRed, interactionYellow, interactionGreen };
  }, [filteredTasks]);

  const selectedDateTasks = useMemo(() => {
    const selectedDay = startOfLocalDay(selectedDate).getTime();

    return filteredTasks.filter((task) => {
      if (!task.updatedAt) return false;

      return startOfLocalDay(new Date(task.updatedAt)).getTime() === selectedDay;
    });
  }, [filteredTasks, selectedDate]);

  if (isLoading) return <Loader />;

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
      <div className="overflow-hidden rounded-lg border bg-background p-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          numberOfMonths={3}
          showOutsideDays={false}
          modifiers={{
            interactionRed: calendarInteractionDates.interactionRed,
            interactionYellow: calendarInteractionDates.interactionYellow,
            interactionGreen: calendarInteractionDates.interactionGreen,
          }}
          onSelect={(date) => {
            if (date) setSelectedDate(date);
          }}
          className="w-full p-0 [--cell-size:--spacing(10)]"
          classNames={{
            root: "w-full",
            months: "grid w-full grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3",
            month: "w-full",
            table: "w-full border-collapse",
            month_caption:
              "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
          }}
        />
      </div>

      <div className="rounded-lg border bg-background p-4">
        <div className="mb-4">
          <p className="text-sm font-medium">
            {format(selectedDate, "dd MMM yyyy")}
          </p>
          <p className="text-xs text-muted-foreground">
            {selectedDateTasks.length} activity
          </p>
        </div>

        {selectedDateTasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No activity for this day
          </p>
        ) : (
          <div className="space-y-3">
            {selectedDateTasks.map((task) => (
              <div key={task._id} className="rounded-md border p-3">
                <div className="flex items-start gap-2">
                  <span
                    className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${getPriorityDotClass(
                      task.priority
                    )}`}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{task.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {task.status} / {task.priority}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const MyTasksTimelineView = () => {
  const { filteredTasks, isLoading } = useFilteredMyTasks();
  const timelineTasks = [...filteredTasks].sort((a, b) => {
    const dateA = new Date(a.updatedAt || a.createdAt).getTime();
    const dateB = new Date(b.updatedAt || b.createdAt).getTime();

    return dateB - dateA;
  });

  const timelineItems = useMemo(
    () =>
      timelineTasks.map((task) => {
        const fallbackStart = task.updatedAt || task.createdAt || new Date();
        const startDate = startOfLocalDay(new Date(fallbackStart));
        const dueDate = task.dueDate
          ? startOfLocalDay(new Date(task.dueDate))
          : null;
        const endDate =
          dueDate && dueDate >= startDate ? dueDate : addDays(startDate, 1);

        return {
          task,
          startDate,
          endDate,
        };
      }),
    [timelineTasks]
  );

  const timelineStart = useMemo(() => {
    if (timelineItems.length === 0) return startOfLocalDay(new Date());

    const firstDate = timelineItems.reduce(
      (earliest, item) =>
        item.startDate < earliest ? item.startDate : earliest,
      timelineItems[0].startDate
    );

    return addDays(firstDate, -1);
  }, [timelineItems]);

  const timelineEnd = useMemo(() => {
    if (timelineItems.length === 0) return addDays(timelineStart, 7);

    const lastDate = timelineItems.reduce(
      (latest, item) => (item.endDate > latest ? item.endDate : latest),
      timelineItems[0].endDate
    );

    return addDays(lastDate, 2);
  }, [timelineItems, timelineStart]);

  const timelineDays = useMemo(() => {
    const totalDays = Math.max(
      differenceInCalendarDays(timelineEnd, timelineStart) + 1,
      MIN_TIMELINE_DAYS
    );

    return Array.from({ length: totalDays }, (_, index) =>
      addDays(timelineStart, index)
    );
  }, [timelineEnd, timelineStart]);

  if (isLoading) return <Loader />;

  return (
    <div className="w-full overflow-hidden rounded-lg border bg-background">
      {timelineItems.length === 0 ? (
        <p className="p-4 text-sm text-muted-foreground">
          No timeline activity
        </p>
      ) : (
        <div className="overflow-x-auto">
          <div
            className="min-w-max"
            style={{ width: timelineDays.length * DAY_WIDTH + 224 }}
          >
            <div className="flex border-b bg-background">
              <div className="sticky left-0 z-20 w-56 shrink-0 border-r bg-background px-4 py-3 text-sm font-medium">
                Tasks
              </div>
              <div
                className="grid shrink-0"
                style={{
                  gridTemplateColumns: `repeat(${timelineDays.length}, ${DAY_WIDTH}px)`,
                }}
              >
                {timelineDays.map((day) => (
                  <div
                    key={day.toISOString()}
                    className="border-r px-1 py-2 text-center text-xs text-muted-foreground"
                  >
                    <div>{format(day, "d")}</div>
                    <div>{format(day, "EEE")}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute bottom-0 left-56 top-0 flex">
                {timelineDays.map((day) => (
                  <div
                    key={day.toISOString()}
                    className="h-full border-r"
                    style={{ width: DAY_WIDTH }}
                  />
                ))}
              </div>

              {timelineItems.map((item) => {
                const offset =
                  differenceInCalendarDays(item.startDate, timelineStart) *
                  DAY_WIDTH;
                const duration =
                  differenceInCalendarDays(item.endDate, item.startDate) + 1;
                const width = Math.max(duration * DAY_WIDTH - 8, 36);

                return (
                  <div
                    key={item.task._id}
                    className="relative flex min-h-14 border-b last:border-b-0"
                  >
                    <div className="sticky left-0 z-10 flex w-56 shrink-0 items-center gap-3 border-r bg-background px-4">
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${getPriorityDotClass(
                          item.task.priority
                        )}`}
                      >
                        {getAssigneeInitial(item.task)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {item.task.title}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {item.task.status}
                        </p>
                      </div>
                    </div>

                    <div
                      className="relative h-14 shrink-0"
                      style={{ width: timelineDays.length * DAY_WIDTH }}
                    >
                      <div
                        className={`absolute top-3 flex h-8 items-center rounded-md px-3 text-xs font-medium text-white shadow-sm ${getPriorityBarClass(
                          item.task.priority
                        )}`}
                        style={{ left: offset + 4, width }}
                        title={`${item.task.title} - ${format(
                          item.startDate,
                          "dd MMM yyyy"
                        )} / ${format(item.endDate, "dd MMM yyyy")}`}
                      >
                        <span className="truncate">{item.task.title}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
