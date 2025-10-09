import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (fails, err: any) => (err?.status === 401 ? false : fails < 2),
    },
  },
});
