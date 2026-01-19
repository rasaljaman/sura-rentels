import * as React from "react";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className = "", ...props }, ref) => (
  <select
    ref={ref}
    className={`w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 ${className}`}
    {...props}
  />
));

Select.displayName = "Select";
