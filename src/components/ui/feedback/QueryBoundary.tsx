import type { ReactNode } from "react";
import { FullScreenError, FullScreenLoader } from "./PageStates";

type Props = {
  isLoading?: boolean;
  error?: unknown;
  children: ReactNode;
  fallbackLoader?: ReactNode;
  fallbackError?: ReactNode;
};

export function QueryBoundary({
  isLoading,
  error,
  children,
  fallbackLoader,
  fallbackError,
}: Props) {
  if (isLoading) return <>{fallbackLoader ?? <FullScreenLoader />}</>;
  if (error) return <>{fallbackError ?? <FullScreenError />}</>;
  return <>{children}</>;
}
