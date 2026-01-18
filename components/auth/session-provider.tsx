"use client";

import * as React from "react";
import type { Session, User } from "@supabase/supabase-js";

import {
  createSupabaseBrowserClient,
  hasSupabaseEnv,
} from "@/lib/supabase/client";

type SessionContextValue = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
};

const SessionContext = React.createContext<SessionContextValue | undefined>(
  undefined,
);

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const supabase = React.useMemo(() => {
    if (!hasSupabaseEnv || typeof window === "undefined") {
      return null;
    }
    return createSupabaseBrowserClient();
  }, []);
  const [session, setSession] = React.useState<Session | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }
    let isMounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (isMounted) {
        setSession(data.session ?? null);
        setIsLoading(false);
      }
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => {
      isMounted = false;
      data.subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <SessionContext.Provider
      value={{ session, user: session?.user ?? null, isLoading }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = React.useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within SessionProvider");
  }
  return context;
};
