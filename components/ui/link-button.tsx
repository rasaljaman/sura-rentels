import type { ReactNode } from "react";
import Link from "next/link";

import { buttonBaseStyles, variantStyles } from "@/components/ui/button";

type LinkButtonProps = {
  href: string;
  children: ReactNode;
  variant?: keyof typeof variantStyles;
  className?: string;
};

export const LinkButton = ({
  href,
  children,
  variant = "primary",
  className = "",
}: LinkButtonProps) => (
  <Link
    href={href}
    className={`${buttonBaseStyles} ${variantStyles[variant]} ${className}`}
  >
    {children}
  </Link>
);
