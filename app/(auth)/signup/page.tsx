"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ChangeEvent } from "react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { locations } from "@/lib/data";
import {
  createSupabaseBrowserClient,
  hasSupabaseEnv,
} from "@/lib/supabase/client";

type SignupState = {
  fullName: string;
  location: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  humanAnswer: string;
};

export default function SignupPage() {
  const router = useRouter();
  const supabase = useMemo(() => {
    if (!hasSupabaseEnv || typeof window === "undefined") {
      return null;
    }
    return createSupabaseBrowserClient();
  }, []);
  const { notify } = useToast();
  const [step, setStep] = useState(1);
  const [state, setState] = useState<SignupState>({
    fullName: "",
    location: "Colombo",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    humanAnswer: "",
  });
  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const updateField = (field: keyof SignupState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setState((prev) => ({ ...prev, [field]: event.target.value }));

  const handleNext = async () => {
    if (step === 1) {
      if (state.password !== state.confirmPassword) {
        notify({
          title: "Passwords do not match",
          description: "Please confirm your password before continuing.",
          variant: "error",
        });
        return;
      }
      setStep(2);
      return;
    }

    if (state.humanAnswer.trim() !== "9") {
      notify({
        title: "Human check failed",
        description: "Please answer the verification question correctly.",
        variant: "error",
      });
      return;
    }

    if (!hasSupabaseEnv) {
      notify({
        title: "Supabase not configured",
        description: "Add environment variables before signing up.",
        variant: "error",
      });
      return;
    }

    setIsLoading(true);
    if (!supabase) {
      notify({
        title: "Supabase not configured",
        description: "Add environment variables before signing up.",
        variant: "error",
      });
      setIsLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: state.email,
      password: state.password,
      options: {
        data: {
          full_name: state.fullName,
          location: state.location,
          phone: state.phone,
        },
      },
    });

    if (error) {
      notify({
        title: "Signup failed",
        description: error.message,
        variant: "error",
      });
      setIsLoading(false);
      return;
    }

    notify({
      title: "Account created",
      description: "We sent OTP codes to your email and phone.",
      variant: "success",
    });
    setStep(3);
    setIsLoading(false);
  };

  const handleSendOtp = async () => {
    if (!hasSupabaseEnv) {
      notify({
        title: "Supabase not configured",
        description: "Add environment variables to send OTP codes.",
        variant: "error",
      });
      return;
    }
    setIsLoading(true);
    if (!supabase) {
      notify({
        title: "Supabase not configured",
        description: "Add environment variables to send OTP codes.",
        variant: "error",
      });
      return;
    }

    const emailResult = await supabase.auth.signInWithOtp({
      email: state.email,
    });
    const phoneResult = await supabase.auth.signInWithOtp({
      phone: state.phone,
    });

    if (emailResult.error || phoneResult.error) {
      notify({
        title: "Unable to send OTP",
        description:
          emailResult.error?.message || phoneResult.error?.message ||
          "Please check your contact details.",
        variant: "error",
      });
    } else {
      notify({
        title: "OTP sent",
        description: "Check your email and SMS inbox.",
        variant: "success",
      });
    }

    setIsLoading(false);
  };

  const handleVerify = async () => {
    if (!hasSupabaseEnv) {
      notify({
        title: "Supabase not configured",
        description: "Add environment variables to verify OTP codes.",
        variant: "error",
      });
      return;
    }
    setIsLoading(true);
    if (!supabase) {
      notify({
        title: "Supabase not configured",
        description: "Add environment variables to verify OTP codes.",
        variant: "error",
      });
      return;
    }

    const emailVerification = await supabase.auth.verifyOtp({
      email: state.email,
      token: emailOtp,
      type: "email",
    });
    const phoneVerification = await supabase.auth.verifyOtp({
      phone: state.phone,
      token: phoneOtp,
      type: "sms",
    });

    if (emailVerification.error || phoneVerification.error) {
      notify({
        title: "Verification failed",
        description:
          emailVerification.error?.message ||
          phoneVerification.error?.message ||
          "Please re-check the OTP codes.",
        variant: "error",
      });
    } else {
      notify({
        title: "Verified successfully",
        description: "Welcome to Sura Rentals.",
        variant: "success",
      });
      router.push("/dashboard");
    }

    setIsLoading(false);
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-16">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">
          Create your Sura Rentals account
        </h1>
        <p className="text-sm text-slate-500">
          Complete three quick steps to verify your identity and start booking.
        </p>
      </div>
      <Card className="space-y-6">
        {!hasSupabaseEnv ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Supabase environment variables are missing. Add
            NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to
            enable signup and OTP verification.
          </div>
        ) : null}
        <div className="flex items-center gap-3 text-xs font-semibold uppercase text-slate-400">
          <span className={step >= 1 ? "text-slate-900" : ""}>1. Details</span>
          <span>→</span>
          <span className={step >= 2 ? "text-slate-900" : ""}>2. Verify</span>
          <span>→</span>
          <span className={step >= 3 ? "text-slate-900" : ""}>
            3. OTP
          </span>
        </div>

        {step === 1 ? (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-slate-500">
                Full name
              </label>
              <Input
                value={state.fullName}
                onChange={updateField("fullName")}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-slate-500">
                Location
              </label>
              <Select value={state.location} onChange={updateField("location")}>
                {locations.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-slate-500">
                Email address
              </label>
              <Input
                type="email"
                value={state.email}
                onChange={updateField("email")}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-slate-500">
                Phone number
              </label>
              <Input
                type="tel"
                value={state.phone}
                onChange={updateField("phone")}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-slate-500">
                Password
              </label>
              <Input
                type="password"
                value={state.password}
                onChange={updateField("password")}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-slate-500">
                Confirm password
              </label>
              <Input
                type="password"
                value={state.confirmPassword}
                onChange={updateField("confirmPassword")}
                required
              />
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">Human check</p>
              <p className="mt-1">
                We verify every account to keep renters and hosts safe.
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-slate-500">
                What is 4 + 5?
              </label>
              <Input
                value={state.humanAnswer}
                onChange={updateField("humanAnswer")}
                placeholder="Your answer"
              />
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
              <input type="checkbox" required className="h-4 w-4" />
              <span>I am not a robot.</span>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-800">
              Enter the OTP codes sent to your email and phone to activate your
              account.
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-slate-500">
                  Email OTP
                </label>
                <Input
                  value={emailOtp}
                  onChange={(event) => setEmailOtp(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-slate-500">
                  Phone OTP
                </label>
                <Input
                  value={phoneOtp}
                  onChange={(event) => setPhoneOtp(event.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={handleSendOtp}
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Resend OTP"}
              </Button>
              <Button type="button" onClick={handleVerify} disabled={isLoading}>
                {isLoading ? "Verifying..." : "Verify & continue"}
              </Button>
            </div>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-4">
          {step < 3 ? (
            <Button type="button" onClick={handleNext} disabled={isLoading}>
              {isLoading ? "Processing..." : "Continue"}
            </Button>
          ) : null}
          <p className="text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-slate-900">
              Log in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
