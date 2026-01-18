"use client";

import type { FormEvent } from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { locations } from "@/lib/data";

export default function ProfilePage() {
  const { notify } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      notify({
        title: "Profile saved",
        description: "Your profile details have been updated.",
        variant: "success",
      });
    }, 600);
  };

  return (
    <Card className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">My profile</h1>
        <p className="text-sm text-slate-500">
          Keep your contact details updated for smoother bookings.
        </p>
      </div>
      <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSave}>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase text-slate-500">
            Full name
          </label>
          <Input defaultValue="Ayesha Perera" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase text-slate-500">
            Location
          </label>
          <Select defaultValue="Colombo">
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase text-slate-500">
            Email
          </label>
          <Input type="email" defaultValue="ayesha@example.com" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase text-slate-500">
            Phone
          </label>
          <Input type="tel" defaultValue="+94 77 123 4567" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-semibold uppercase text-slate-500">
            About you
          </label>
          <Textarea
            rows={3}
            defaultValue="Local host with three years of experience renting cars across Sri Lanka."
          />
        </div>
        <div>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
