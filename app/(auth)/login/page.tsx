"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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

export default function LoginPage() {
  const router = useRouter();
  const { notify } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!hasSupabaseEnv) {
      notify({
        title: "Supabase not configured",
        description: "Add environment variables before logging in.",
        variant: "error",
      });
      return;
    }
    setIsLoading(true);

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      notify({
        title: "Login failed",
        description: error.message,
        variant: "error",
      });
    } else {
      notify({
        title: "Welcome back",
        description: "Redirecting you to your dashboard.",
        variant: "success",
      });
      router.push("/dashboard");
    }

    setIsLoading(false);
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-16">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">
          Log in to Sura Rentals
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Access your bookings, listings, and verification updates.
        </p>
      </div>
      <Card className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
        <form className="space-y-4" onSubmit={handleSubmit}>
          {!hasSupabaseEnv ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Supabase environment variables are missing. Add
              NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to
              enable authentication.
            </div>
          ) : null}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-slate-500">
              Email address
            </label>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-slate-500">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Log in"}
          </Button>
        </form>
        <div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-600">
          <h2 className="text-base font-semibold text-slate-900">
            New to Sura Rentals?
          </h2>
          <p className="mt-2">
            Create an account to list your car, upload verification documents,
            and start accepting bookings.
          </p>
          <Link
            href="/signup"
            className="mt-4 inline-flex font-semibold text-slate-900"
          >
            Create an account →
          </Link>
        </div>
      </Card>
    </div>
  );
}
