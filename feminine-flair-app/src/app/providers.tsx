import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useEffect } from "react";
import { useProducts } from "@/hooks/useProducts";

const queryClient = new QueryClient();

export function AppProviders({ children }: { children: ReactNode }) {
  useEffect(() => {
    useProducts.getState().fetchAll();
  }, []);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
