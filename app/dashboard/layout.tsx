import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { LogoutButton } from "@/components/auth/logout-button";

import type { ReactNode } from "react";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <DashboardSidebar />
        <div className="space-y-6">
          <div className="flex items-center justify-end">
            <LogoutButton />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
