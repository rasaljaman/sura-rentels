import Link from "next/link";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { dashboardStats, featuredCars } from "@/lib/data";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Welcome back</h1>
        <p className="text-sm text-slate-500">
          Manage your listings, bookings, and verification documents.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {dashboardStats.map((stat) => (
          <Card key={stat.label} className="space-y-2">
            <p className="text-xs font-semibold uppercase text-slate-400">
              {stat.label}
            </p>
            <p className="text-2xl font-semibold text-slate-900">
              {stat.value}
            </p>
            <p className="text-sm text-slate-500">{stat.description}</p>
          </Card>
        ))}
      </div>
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Latest cars</h2>
            <p className="text-sm text-slate-500">
              Quick access to your most recent listings.
            </p>
          </div>
          <Link href="/dashboard/cars" className="text-sm font-semibold">
            View all
          </Link>
        </div>
        <div className="divide-y divide-slate-100">
          {featuredCars.slice(0, 3).map((car) => (
            <div key={car.id} className="flex items-center justify-between py-3">
              <div>
                <p className="font-semibold text-slate-900">{car.title}</p>
                <p className="text-sm text-slate-500">{car.location}</p>
              </div>
              <Badge tone="warning">Pending verification</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
