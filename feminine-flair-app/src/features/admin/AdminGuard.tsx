import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

// Role lives in app_metadata (set via the Supabase Admin API), never user_metadata — the latter
// is client-editable and unsafe to use for authorization.
export function AdminGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (user?.app_metadata?.role !== "admin") return <Navigate to="/account/login" replace />;

  return <>{children}</>;
}
