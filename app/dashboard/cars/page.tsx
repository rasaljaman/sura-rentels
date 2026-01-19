import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/link-button";
import { Card } from "@/components/ui/card";
import { featuredCars } from "@/lib/data";

export default function MyCarsPage() {
  return (
    <Card className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">My cars</h1>
          <p className="text-sm text-slate-500">
            Manage your listings and update availability.
          </p>
        </div>
        <LinkButton href="/dashboard/cars/new">Add new listing</LinkButton>
      </div>
      <div className="divide-y divide-slate-100">
        {featuredCars.slice(0, 3).map((car) => (
          <div
            key={car.id}
            className="flex flex-wrap items-center justify-between gap-4 py-4"
          >
            <div>
              <p className="font-semibold text-slate-900">{car.title}</p>
              <p className="text-sm text-slate-500">{car.location}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge tone="warning">Pending verification</Badge>
              <Link href="/dashboard/cars/new" className="text-sm font-semibold">
                Edit
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
