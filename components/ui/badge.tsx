import * as React from "react";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "neutral" | "success" | "warning";
};

const toneStyles: Record<NonNullable<BadgeProps["tone"]>, string> = {
  neutral: "bg-slate-100 text-slate-600",
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = "", tone = "neutral", ...props }, ref) => (
    <span
      ref={ref}
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${toneStyles[tone]} ${className}`}
      {...props}
    />
  ),
);

Badge.displayName = "Badge";
