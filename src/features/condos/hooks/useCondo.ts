import { useQuery } from "@tanstack/react-query";

import { condosKeys } from "../api/condos.keys";
import { CondosApi } from "../api/condos.api";
import type { CondoDetails } from "..";

export function useCondo(condoId: number) {
  return useQuery<CondoDetails>({
    queryKey: condosKeys.detail(condoId),
    queryFn: () => CondosApi.getById(condoId),
    enabled: !!condoId,
  });
}
