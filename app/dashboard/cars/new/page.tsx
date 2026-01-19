"use client";

import type { FormEvent } from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { fuelTypes, locations } from "@/lib/data";
import {
  createSupabaseBrowserClient,
  hasSupabaseEnv,
} from "@/lib/supabase/client";

export default function NewCarPage() {
  const { notify } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<FileList | null>(null);
  const [rcDocument, setRcDocument] = useState<File | null>(null);
  const maxFileSize = 5 * 1024 * 1024;

  const sanitizeFileName = (name: string) =>
    name.replace(/[^a-zA-Z0-9_-]/g, "_");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!hasSupabaseEnv) {
      notify({
        title: "Missing Supabase config",
        description: "Add Supabase environment variables to enable uploads.",
        variant: "error",
      });
      return;
    }

    const imageFiles = images ? Array.from(images) : [];
    if (
      imageFiles.some(
        (file) => !file.type.startsWith("image/") || file.size > maxFileSize,
      )
    ) {
      notify({
        title: "Invalid image files",
        description: "Images must be under 5MB and in a supported format.",
        variant: "error",
      });
      return;
    }

    if (
      rcDocument &&
      (!["application/pdf", "image/jpeg", "image/png"].includes(rcDocument.type) ||
        rcDocument.size > maxFileSize)
    ) {
      notify({
        title: "Invalid RC document",
        description: "Upload a PDF or image under 5MB.",
        variant: "error",
      });
      return;
    }

    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const supabase = createSupabaseBrowserClient();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      notify({
        title: "Login required",
        description: "Please log in before listing a car.",
        variant: "error",
      });
      setIsLoading(false);
      return;
    }

    const { data: car, error: carError } = await supabase
      .from("cars")
      .insert({
        owner_id: userData.user.id,
        title: String(formData.get("title") ?? ""),
        brand: String(formData.get("brand") ?? ""),
        model: String(formData.get("model") ?? ""),
        year: Number(formData.get("year") ?? 0),
        fuel_type: String(formData.get("fuel_type") ?? ""),
        price_per_day: Number(formData.get("price_per_day") ?? 0),
        location: String(formData.get("location") ?? ""),
        description: String(formData.get("description") ?? ""),
        status: "pending",
      })
      .select()
      .single();

    if (carError || !car) {
      notify({
        title: "Unable to save listing",
        description: carError?.message ?? "Please try again.",
        variant: "error",
      });
      setIsLoading(false);
      return;
    }

    if (imageFiles.length) {
      const uploads = imageFiles.map(async (file, index) => {
        const safeName = sanitizeFileName(file.name);
        const path = `cars/${userData.user?.id}/${Date.now()}-${safeName}`;
        const { data, error } = await supabase.storage
          .from("car-images")
          .upload(path, file, { upsert: false });
        if (error || !data) return null;
        const { error: insertError } = await supabase.from("car_images").insert({
          car_id: car.id,
          image_url: data.path,
          is_primary: index === 0,
        });
        return insertError;
      });
      const results = await Promise.all(uploads);
      if (results.some((item) => item)) {
        notify({
          title: "Image upload issue",
          description: "Some images failed to attach to your listing.",
          variant: "error",
        });
      }
    }

    if (rcDocument) {
      const safeName = sanitizeFileName(rcDocument.name);
      const path = `car-documents/${userData.user.id}/${Date.now()}-${safeName}`;
      const { data } = await supabase.storage
        .from("car-documents")
        .upload(path, rcDocument, { upsert: false });
      if (data) {
        await supabase.from("verifications").insert({
          user_id: userData.user.id,
          car_id: car.id,
          type: "rc_document",
          document_url: data.path,
          status: "pending",
        });
      }
    }

    notify({
      title: "Listing submitted",
      description: "Your car is pending verification.",
      variant: "success",
    });
    event.currentTarget.reset();
    setImages(null);
    setRcDocument(null);
    setIsLoading(false);
  };

  return (
    <Card className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Add a car</h1>
        <p className="text-sm text-slate-500">
          Upload images and RC document for verification.
        </p>
      </div>
      <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <Input name="title" placeholder="Listing title" required />
        <Input name="brand" placeholder="Brand" required />
        <Input name="model" placeholder="Model" required />
        <Input name="year" placeholder="Year" type="number" required />
        <Select name="fuel_type" defaultValue={fuelTypes[0]}>
          {fuelTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </Select>
        <Input
          name="price_per_day"
          placeholder="Price per day (LKR '000s)"
          type="number"
          required
        />
        <Select name="location" defaultValue={locations[0]}>
          {locations.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-semibold uppercase text-slate-500">
            Description
          </label>
          <Textarea name="description" rows={4} required />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-semibold uppercase text-slate-500">
            Car images (multiple)
          </label>
          <Input
            type="file"
            multiple
            accept="image/*"
            onChange={(event) => setImages(event.target.files)}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-semibold uppercase text-slate-500">
            RC document
          </label>
          <Input
            type="file"
            accept="application/pdf,image/*"
            onChange={(event) => setRcDocument(event.target.files?.[0] ?? null)}
          />
        </div>
        <div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit listing"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
