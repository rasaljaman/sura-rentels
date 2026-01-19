import * as React from "react";

export const variantStyles = {
  primary:
    "bg-slate-900 text-white hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900",
  secondary:
    "bg-white text-slate-900 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-300",
  ghost: "text-slate-700 hover:bg-slate-100",
} as const;

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variantStyles;
};

export const buttonBaseStyles =
  "inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", ...props }, ref) => (
    <button
      ref={ref}
      className={`${buttonBaseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    />
  ),
);

Button.displayName = "Button";
