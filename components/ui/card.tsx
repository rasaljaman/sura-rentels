import * as React from "react";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", ...props }, ref) => (
    <div
      ref={ref}
      className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}
      {...props}
    />
  ),
);

Card.displayName = "Card";
