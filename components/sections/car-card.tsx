import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";

type CarCardProps = {
  id: string;
  title: string;
  location: string;
  pricePerDay: number;
  fuelType: string;
  image: string;
};

export const CarCard = ({
  id,
  title,
  location,
  pricePerDay,
  fuelType,
  image,
}: CarCardProps) => (
  <Card className="flex h-full flex-col gap-4">
    <div className="relative h-40 w-full overflow-hidden rounded-2xl bg-slate-100">
      <Image
        src={image}
        alt={title}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 320px"
        className="object-cover"
      />
    </div>
    <div className="flex flex-1 flex-col gap-3">
      <div>
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500">{location}</p>
      </div>
      <div className="flex items-center gap-2">
        <Badge>{fuelType}</Badge>
        <Badge tone="success">{formatCurrency(pricePerDay)} / day</Badge>
      </div>
      <Link
        href={`/cars/${id}`}
        className="mt-auto text-sm font-semibold text-slate-900"
      >
        View details →
      </Link>
    </div>
  </Card>
);
