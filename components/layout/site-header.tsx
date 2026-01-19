import Link from "next/link";

const links = [
  { label: "Browse cars", href: "/cars" },
  { label: "List your car", href: "/dashboard/cars/new" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Admin", href: "/admin" },
];

export const SiteHeader = () => (
  <header className="border-b border-slate-100 bg-white">
    <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
      <Link href="/" className="text-lg font-semibold text-slate-900">
        Sura Rentals
      </Link>
      <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="transition hover:text-slate-900"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        <Link href="/login" className="text-sm font-medium text-slate-600">
          Log in
        </Link>
        <Link
          href="/signup"
          className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Get started
        </Link>
      </div>
    </div>
  </header>
);
