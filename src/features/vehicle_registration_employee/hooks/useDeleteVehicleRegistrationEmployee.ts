import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { VehicleRegistrationEmployeesApi } from "../api/vehicle-registration-employee.api";
import { vehicleRegistrationEmployeesKeys } from "../api/vehicle-registration-employee.keys";

export function useDeleteVehicleRegistrationEmployee() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (taskId: number) =>
      VehicleRegistrationEmployeesApi.delete(taskId),

    onSuccess: (data: any) => {
      qc.invalidateQueries({ queryKey: vehicleRegistrationEmployeesKeys.all });
      enqueueSnackbar(data?.messages?.[0] || data?.messages, {
        variant: "success",
      });
    },

    onError: (err: any) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
