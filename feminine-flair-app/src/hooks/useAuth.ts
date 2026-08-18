import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function applySession(nextUser: User | null) {
      if (cancelled) return;
      setUser(nextUser);
      if (!nextUser) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      // Being signed in only proves this is a Supabase Auth user — a future customer-account
      // login uses the same auth.users table, so admin access is a separate server-checked fact.
      const { data, error } = await supabase.rpc("is_admin");
      if (cancelled) return;
      setIsAdmin(!error && data === true);
      setLoading(false);
    }

    supabase.auth.getSession().then(({ data }) => applySession(data.session?.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoading(true);
      applySession(session?.user ?? null);
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { user, isAdmin, loading };
}
