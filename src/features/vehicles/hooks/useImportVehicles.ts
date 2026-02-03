import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { VehiclesApi } from "../api/vehicles.api";
import { vehiclesKeys } from "../api/vehicles.keys";

export function useImportVehicles() {
  const queryClient = useQueryClient();

  return useCallback(
    async (file: File) => {
      const result = await VehiclesApi.import(file);
      await queryClient.invalidateQueries({ queryKey: vehiclesKeys.all });
      return result;
    },
    [queryClient]
  );
}
