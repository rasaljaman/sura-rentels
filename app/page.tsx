"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { CarCard } from "@/components/sections/car-card";
import { LinkButton } from "@/components/ui/link-button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { featuredCars, fuelTypes, locations } from "@/lib/data";

export default function Home() {
  const [location, setLocation] = useState("Colombo");
  const [fuelType, setFuelType] = useState("Any");

  const filteredCars = featuredCars.filter((car) =>
    fuelType === "Any" ? true : car.fuelType === fuelType,
  );

  return (
    <div className="bg-slate-50">
      <section className="relative overflow-hidden bg-white">
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Verified peer-to-peer rentals
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">
              Rent trusted cars from locals in minutes.
            </h1>
            <p className="text-base text-slate-600 md:text-lg">
              Sura Rentals brings flexible bookings, verified owners, and smart
              insurance in one seamless marketplace.
            </p>
            <div className="flex flex-wrap gap-3">
              <LinkButton href="/cars">Browse cars</LinkButton>
              <LinkButton href="/dashboard/cars/new" variant="secondary">
                List your car
              </LinkButton>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-slate-500">
              <span>✅ Secure payments</span>
              <span>✅ Insurance included</span>
              <span>✅ 24/7 support</span>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -right-10 top-10 hidden h-40 w-40 rounded-full bg-slate-100 md:block" />
            <Image
              src="/hero-car.svg"
              alt="Car rental illustration"
              width={520}
              height={420}
              className="relative z-10 w-full"
              priority
            />
          </motion.div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-12">
        <Card className="grid gap-6 md:grid-cols-4">
          <div className="md:col-span-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Find a car near you
            </h2>
            <p className="text-sm text-slate-500">
              Search by location and preferred fuel type.
            </p>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-semibold uppercase text-slate-500">
              Pickup location
            </label>
            <Select
              value={location}
              onChange={(event) => setLocation(event.target.value)}
            >
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
            <Select
              value={fuelType}
              onChange={(event) => setFuelType(event.target.value)}
            >
              <option value="Any">Any</option>
              {fuelTypes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-slate-500">
              Dates
            </label>
            <Input type="date" />
          </div>
        </Card>
      </section>

      <section className="mx-auto w-full max-w-6xl space-y-8 px-6 pb-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Latest verified cars in {location}
            </h2>
            <p className="text-sm text-slate-500">
              Fresh listings vetted by our trust & safety team.
            </p>
          </div>
          <Link href="/cars" className="text-sm font-semibold text-slate-900">
            Explore all listings →
          </Link>
        </div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {filteredCars.map((car) => (
            <motion.div
              key={car.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <CarCard
                id={car.id}
                title={car.title}
                location={car.location}
                pricePerDay={car.pricePerDay}
                fuelType={car.fuelType}
                image={car.images[0]}
              />
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
