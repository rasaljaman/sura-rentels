"use client";

import type { FormEvent } from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import {
  createSupabaseBrowserClient,
  hasSupabaseEnv,
} from "@/lib/supabase/client";

export default function VerificationPage() {
  const { notify } = useToast();
  const [license, setLicense] = useState<File | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!hasSupabaseEnv) {
      notify({
        title: "Supabase not configured",
        description: "Add environment variables to enable verification uploads.",
        variant: "error",
      });
      return;
    }

    if (!license && !photo) {
      notify({
        title: "No documents selected",
        description: "Please upload your license or profile photo.",
        variant: "error",
      });
      return;
    }

    setIsLoading(true);
    const supabase = createSupabaseBrowserClient();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      notify({
        title: "Login required",
        description: "Please log in before uploading documents.",
        variant: "error",
      });
      setIsLoading(false);
      return;
    }

    if (license) {
      const licensePath = `verifications/${userData.user.id}/${Date.now()}-${license.name}`;
      const { data } = await supabase.storage
        .from("verification-documents")
        .upload(licensePath, license, { upsert: false });
      if (data) {
        await supabase.from("verifications").insert({
          user_id: userData.user.id,
          type: "driving_license",
          document_url: data.path,
          status: "pending",
        });
      }
    }
    if (photo) {
      const photoPath = `verifications/${userData.user.id}/${Date.now()}-${photo.name}`;
      const { data } = await supabase.storage
        .from("verification-documents")
        .upload(photoPath, photo, { upsert: false });
      if (data) {
        await supabase.from("verifications").insert({
          user_id: userData.user.id,
          type: "profile_photo",
          document_url: data.path,
          status: "pending",
        });
      }
    }

    notify({
      title: "Documents uploaded",
      description: "Your verification status will update once reviewed.",
      variant: "success",
    });
    event.currentTarget.reset();
    setLicense(null);
    setPhoto(null);
    setIsLoading(false);
  };

  return (
    <Card className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          Verification documents
        </h1>
        <p className="text-sm text-slate-500">
          Upload your driving license and a profile photo to unlock rentals.
        </p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase text-slate-500">
            Driving license
          </label>
          <Input
            type="file"
            accept="image/*,application/pdf"
            onChange={(event) => setLicense(event.target.files?.[0] ?? null)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase text-slate-500">
            Profile photo
          </label>
          <Input
            type="file"
            accept="image/*"
            onChange={(event) => setPhoto(event.target.files?.[0] ?? null)}
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Uploading..." : "Submit documents"}
        </Button>
      </form>
    </Card>
  );
}
