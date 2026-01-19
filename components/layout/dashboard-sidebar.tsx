import Link from "next/link";

const navItems = [
  { label: "Overview", href: "/dashboard" },
  { label: "My Profile", href: "/dashboard/profile" },
  { label: "My Cars", href: "/dashboard/cars" },
  { label: "My Bookings", href: "/dashboard/bookings" },
  { label: "Verification", href: "/dashboard/verification" },
];

export const DashboardSidebar = () => (
  <aside className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-6">
    <div>
      <p className="text-xs font-semibold uppercase text-slate-500">
        Sura Rentals
      </p>
      <p className="text-lg font-semibold text-slate-900">Dashboard</p>
    </div>
    <nav className="flex flex-col gap-3 text-sm font-medium text-slate-600">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="rounded-xl px-3 py-2 transition hover:bg-slate-50 hover:text-slate-900"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  </aside>
);
