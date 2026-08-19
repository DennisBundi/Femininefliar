import { useState, type FormEvent } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

export function AdminLoginPage() {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user && isAdmin) {
    const redirectTo = (location.state as { from?: string } | null)?.from ?? "/admin";
    return <Navigate to={redirectTo} replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (signInError) {
      setError("Incorrect email or password.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f3f4] px-8">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded bg-white p-8 shadow-sm">
        <h1 className="mb-6 font-serif text-2xl text-ink">Admin sign in</h1>
        <label className="mb-4 block">
          <span className="mb-1.5 block text-xs text-ink/60">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border border-blush-soft px-3 py-2.5 text-sm"
          />
        </label>
        <label className="mb-2 block">
          <span className="mb-1.5 block text-xs text-ink/60">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border border-blush-soft px-3 py-2.5 text-sm"
          />
        </label>
        {error && <p className="mb-4 text-xs text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="mt-4 w-full rounded bg-burgundy py-3 text-sm font-semibold text-white hover:bg-burgundy-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
