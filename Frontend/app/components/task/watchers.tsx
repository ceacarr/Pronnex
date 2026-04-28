import type { User } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const Watchers = ({ watchers }: { watchers: User[] }) => {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Watchers
      </h3>

      <div className="space-y-2">
        {watchers && watchers.length > 0 ? (
          watchers.map((watcher) => (
            <div
              key={watcher._id}
              className="flex items-center gap-2 rounded-md border bg-background/60 px-2.5 py-2"
            >
              <Avatar className="size-6">
                <AvatarImage src={watcher.profilePicture} />
                <AvatarFallback>{watcher.name.charAt(0)}</AvatarFallback>
              </Avatar>

              <p className="text-sm text-foreground/90">{watcher.name}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No watchers</p>
        )}
      </div>
    </div>
  );
};
