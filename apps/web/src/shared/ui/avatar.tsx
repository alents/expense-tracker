import * as React from "react";
import { cn } from "@/shared/lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string | null;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(({ name, className, ...props }, ref) => {
  const initial = name?.trim()?.[0]?.toUpperCase() ?? "?";
  return (
    <div
      ref={ref}
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground",
        className,
      )}
      {...props}
    >
      {initial}
    </div>
  );
});
Avatar.displayName = "Avatar";

export { Avatar };
