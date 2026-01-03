import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";

import type { UpdateVehicleRegistrationEmployeeRequest } from "..";
import { VehicleRegistrationEmployeesApi } from "../api/vehicle-registration-employee.api";
import { vehicleRegistrationEmployeesKeys } from "../api/vehicle-registration-employee.keys";

export function useUpdateVehicleRegistrationEmployee() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (payload: UpdateVehicleRegistrationEmployeeRequest) =>
      VehicleRegistrationEmployeesApi.update(payload),

    onSuccess: (data: any) => {
      qc.invalidateQueries({ queryKey: vehicleRegistrationEmployeesKeys.all });
      enqueueSnackbar(data?.messages?.[0] || data?.messages, {
        variant: "success",
      });
    },

    onError: (err: any) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
