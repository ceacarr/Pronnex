import { Toaster } from "sonner";
import { AuthProvider } from "./auth-context";
import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const queryClient = new QueryClient();

const ReactQueryProvider = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
      </AuthProvider>
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  );
};

export default ReactQueryProvider;
