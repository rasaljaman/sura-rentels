import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { featuredCars } from "@/lib/data";

export default function BookingsPage() {
  return (
    <Card className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">My bookings</h1>
        <p className="text-sm text-slate-500">
          Track booking requests and manage upcoming trips.
        </p>
      </div>
      <div className="divide-y divide-slate-100">
        {featuredCars.slice(0, 2).map((car) => (
          <div key={car.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
            <div>
              <p className="font-semibold text-slate-900">{car.title}</p>
              <p className="text-sm text-slate-500">Feb 12 → Feb 14</p>
            </div>
            <Badge tone="success">Approved</Badge>
          </div>
        ))}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4">
          <div>
            <p className="font-semibold text-slate-900">Nissan X-Trail Premium</p>
            <p className="text-sm text-slate-500">Mar 02 → Mar 05</p>
          </div>
          <Badge tone="warning">Pending</Badge>
        </div>
      </div>
    </Card>
  );
}
