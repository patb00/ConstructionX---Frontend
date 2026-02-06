import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
//import { useNavigate } from "react-router-dom";

import type { AddVehicleRegistrationEmployeeRequest } from "..";
import { VehicleRegistrationEmployeesApi } from "../api/vehicle-registration-employee.api";
import { vehicleRegistrationEmployeesKeys } from "../api/vehicle-registration-employee.keys";

export function useAddVehicleRegistrationEmployee() {
  //const navigate = useNavigate();
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (payload: AddVehicleRegistrationEmployeeRequest) =>
      VehicleRegistrationEmployeesApi.add(payload),

    onSuccess: (data: any) => {
      qc.invalidateQueries({ queryKey: vehicleRegistrationEmployeesKeys.all });
      enqueueSnackbar(data?.messages?.[0] || data?.messages, {
        variant: "success",
      });
      //navigate("/app/vehicle-registration-employees");
    },

    onError: (err: any) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
