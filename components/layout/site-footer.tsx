import Link from "next/link";

export const SiteFooter = () => (
  <footer className="border-t border-slate-100 bg-white">
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-base font-semibold text-slate-900">Sura Rentals</p>
        <p className="mt-2 max-w-sm">
          A trusted peer-to-peer car rental marketplace built for Sri Lanka.
        </p>
      </div>
      <div className="flex flex-wrap gap-6">
        <Link href="/cars" className="hover:text-slate-900">
          Explore cars
        </Link>
        <Link href="/dashboard" className="hover:text-slate-900">
          Host a car
        </Link>
        <Link href="/signup" className="hover:text-slate-900">
          Create account
        </Link>
      </div>
    </div>
  </footer>
);
