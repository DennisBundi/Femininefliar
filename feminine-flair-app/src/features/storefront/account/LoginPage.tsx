import { useState, type FormEvent } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

export function LoginPage() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) {
    const redirectTo = (location.state as { from?: string } | null)?.from ?? "/account/orders";
    return <Navigate to={redirectTo} replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    if (mode === "signin") {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) setError("Incorrect email or password.");
      setSubmitting(false);
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) {
      setError(signUpError.message);
      setSubmitting(false);
      return;
    }
    if (data.user) {
      const { error: profileError } = await supabase
        .from("customers")
        .insert([{ id: data.user.id, full_name: fullName, email }]);
      if (profileError) {
        setError(profileError.message);
        setSubmitting(false);
        return;
      }
    }
    setSubmitting(false);
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-sm items-center px-8 py-12">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="mb-6 flex gap-6 border-b border-blush-soft text-sm">
          <button
            type="button"
            onClick={() => setMode("signin")}
            className={`-mb-px border-b-2 pb-2.5 ${mode === "signin" ? "border-burgundy font-semibold text-burgundy" : "border-transparent text-ink/60"}`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`-mb-px border-b-2 pb-2.5 ${mode === "signup" ? "border-burgundy font-semibold text-burgundy" : "border-transparent text-ink/60"}`}
          >
            Create account
          </button>
        </div>

        {mode === "signup" && (
          <label className="mb-4 block">
            <span className="mb-1.5 block text-xs text-ink/60">Full name</span>
            <input
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded border border-blush-soft px-3 py-2.5 text-sm"
            />
          </label>
        )}
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
            minLength={6}
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
          {submitting ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
        </button>
      </form>
    </main>
  );
}
