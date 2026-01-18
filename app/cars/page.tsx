"use client";

import { useEffect, useMemo, useState } from "react";

import { CarCard } from "@/components/sections/car-card";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { featuredCars, fuelTypes, locations } from "@/lib/data";

export default function CarsPage() {
  const [location, setLocation] = useState("All");
  const [fuelType, setFuelType] = useState("All");
  const [maxPrice, setMaxPrice] = useState("Any");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const filteredCars = useMemo(() => {
    const priceLimit = maxPrice === "Any" ? null : Number(maxPrice);
    return featuredCars.filter((car) => {
      const matchesLocation =
        location === "All" ? true : car.location === location;
      const matchesFuel = fuelType === "All" ? true : car.fuelType === fuelType;
      const matchesPrice = priceLimit ? car.pricePerDay <= priceLimit : true;
      return matchesLocation && matchesFuel && matchesPrice;
    });
  }, [fuelType, location, maxPrice]);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-6 py-12">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">
          Browse verified rentals
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Filter by location, price, and fuel type to find your perfect ride.
        </p>
      </div>

      <Card className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase text-slate-500">
            Location
          </label>
          <Select value={location} onChange={(event) => setLocation(event.target.value)}>
            <option value="All">All locations</option>
            {locations.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase text-slate-500">
            Fuel type
          </label>
          <Select value={fuelType} onChange={(event) => setFuelType(event.target.value)}>
            <option value="All">All types</option>
            {fuelTypes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase text-slate-500">
            Max price / day
          </label>
          <Select value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)}>
            <option value="Any">Any</option>
            <option value="50">Up to LKR 50k</option>
            <option value="80">Up to LKR 80k</option>
            <option value="120">Up to LKR 120k</option>
          </Select>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="space-y-4">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-full" />
              </Card>
            ))
          : filteredCars.map((car) => (
              <CarCard
                key={car.id}
                id={car.id}
                title={car.title}
                location={car.location}
                pricePerDay={car.pricePerDay}
                fuelType={car.fuelType}
                image={car.images[0]}
              />
            ))}
        {!isLoading && filteredCars.length === 0 ? (
          <Card className="md:col-span-2 lg:col-span-3">
            <p className="text-sm text-slate-600">
              No cars match your filters. Try adjusting the price or location.
            </p>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
