"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { featuredCars } from "@/lib/data";
import { formatCurrency } from "@/lib/format";
import {
  createSupabaseBrowserClient,
  hasSupabaseEnv,
} from "@/lib/supabase/client";

type VerificationStatus = "verified" | "pending" | "unverified";

export default function CarDetailsPage() {
  const params = useParams<{ id: string }>();
  const { notify } = useToast();
  const car = useMemo(
    () => featuredCars.find((item) => item.id === params.id),
    [params.id],
  );
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatus>("unverified");
  const [bookingStatus, setBookingStatus] = useState("pending");

  useEffect(() => {
    const loadProfile = async () => {
      if (!hasSupabaseEnv) return;
      const supabase = createSupabaseBrowserClient();
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("verification_status")
        .eq("id", data.user.id)
        .single();

      if (profile?.verification_status === "verified") {
        setVerificationStatus("verified");
      } else if (profile?.verification_status === "pending") {
        setVerificationStatus("pending");
      }
    };

    loadProfile();
  }, []);

  if (!car) {
    return (
      <div className="mx-auto w-full max-w-4xl px-6 py-16">
        <h1 className="text-2xl font-semibold text-slate-900">
          Listing not found
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          This car is no longer available. Try browsing other listings.
        </p>
      </div>
    );
  }

  const handleBooking = () => {
    if (verificationStatus !== "verified") {
      notify({
        title: "Verification required",
        description:
          "Upload your driving license to send booking requests.",
        variant: "error",
      });
      return;
    }
    notify({
      title: "Booking request sent",
      description: "The host will respond within 24 hours.",
      variant: "success",
    });
    setBookingStatus("pending");
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-6 py-12">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="relative h-72 w-full overflow-hidden rounded-3xl bg-slate-100">
            <Image
              src={car.images[0]}
              alt={car.title}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {car.images.slice(1).map((image, index) => (
              <div
                key={`${image}-${index}`}
                className="relative h-40 overflow-hidden rounded-2xl bg-slate-100"
              >
                <Image
                  src={image}
                  alt={car.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 300px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-semibold text-slate-900">
                {car.title}
              </h1>
              <Badge tone="success">{car.availability}</Badge>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              {car.location} • {car.year} • {car.fuelType}
            </p>
            <p className="mt-4 text-base text-slate-600">{car.description}</p>
          </div>
          <Card className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Owner</h2>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
              <span className="font-semibold text-slate-900">{car.owner.name}</span>
              <span>⭐ {car.owner.rating} rating</span>
              <span>{car.owner.trips} completed trips</span>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Price per day</p>
              <p className="text-xl font-semibold text-slate-900">
                {formatCurrency(car.pricePerDay)}
              </p>
            </div>
            <div className="grid gap-3">
              <Input type="date" />
              <Input type="date" />
              <Select defaultValue="pickup">
                <option value="pickup">Pickup</option>
                <option value="delivery">Doorstep delivery</option>
              </Select>
            </div>
            <Button onClick={handleBooking}>Request booking</Button>
            {verificationStatus !== "verified" ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Verification status: {verificationStatus}. Upload your license in
                the dashboard to book.
              </div>
            ) : null}
            <div className="text-xs text-slate-500">
              Booking status: {bookingStatus}
            </div>
          </Card>
          <Card className="space-y-3">
            <h3 className="text-base font-semibold text-slate-900">
              Listing specs
            </h3>
            <div className="text-sm text-slate-600">
              <p>Brand: {car.brand}</p>
              <p>Model: {car.model}</p>
              <p>Fuel: {car.fuelType}</p>
              <p>Year: {car.year}</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
