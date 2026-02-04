import { useQuery } from "@tanstack/react-query";

import { materialsKeys } from "../api/materials.keys";
import { MaterialsApi } from "../api/materials.api";
import type { Material } from "..";

export function useMaterial(materialId: number) {
  return useQuery<Material>({
    queryKey: materialsKeys.detail(materialId),
    queryFn: () => MaterialsApi.getById(materialId),
  });
}
