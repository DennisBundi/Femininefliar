import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/useToast";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const showToast = useToast((s) => s.show);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);

    if (error) {
      showToast("Incorrect email or password");
      return;
    }

    // Only admins have anywhere to land right now — customer accounts aren't wired up yet.
    navigate(data.user?.app_metadata?.role === "admin" ? "/admin" : "/");
  }

  return (
    <main className="mx-auto max-w-md px-8 py-12">
      <h1 className="mb-6 text-2xl">Sign in</h1>
      <form onSubmit={handleSubmit}>
        <label className="mb-[18px] block">
          <span className="mb-1.5 block text-xs text-ink/60">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border border-blush-soft px-3 py-2.5 text-sm"
            placeholder="you@email.com"
          />
        </label>
        <label className="mb-[18px] block">
          <span className="mb-1.5 block text-xs text-ink/60">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border border-blush-soft px-3 py-2.5 text-sm"
            placeholder="••••••••"
          />
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded bg-burgundy py-3 text-sm font-bold text-white hover:bg-burgundy-dark disabled:opacity-60"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
