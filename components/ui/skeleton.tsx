import * as React from "react";

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className = "", ...props }, ref) => (
    <div
      ref={ref}
      className={`animate-pulse rounded-2xl bg-slate-200/70 ${className}`}
      {...props}
    />
  ),
);

Skeleton.displayName = "Skeleton";
