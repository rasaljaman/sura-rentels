"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  createSupabaseBrowserClient,
  hasSupabaseEnv,
} from "@/lib/supabase/client";

export const LogoutButton = () => {
  const supabase =
    hasSupabaseEnv && typeof window !== "undefined"
      ? createSupabaseBrowserClient()
      : null;
  const { notify } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    if (!supabase) {
      notify({
        title: "Supabase not configured",
        description: "Add environment variables before logging out.",
        variant: "error",
      });
      return;
    }
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      notify({
        title: "Unable to log out",
        description: error.message,
        variant: "error",
      });
    } else {
      notify({
        title: "Signed out",
        description: "You have been logged out securely.",
        variant: "success",
      });
    }
    setIsLoading(false);
  };

  return (
    <Button onClick={handleLogout} disabled={isLoading} variant="secondary">
      {isLoading ? "Signing out..." : "Logout"}
    </Button>
  );
};
