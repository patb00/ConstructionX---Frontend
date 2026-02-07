import { Dialog, DialogContent, DialogTitle, IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import VehicleRegistrationForm from "../../vehicle_registrations/components/VehicleRegistrationForm";
import { useAddVehicleRegistration } from "../../vehicle_registrations/hooks/useAddVehicleRegistration";
import { useUploadVehicleRegistrationDocument } from "../../vehicle_registrations/hooks/useUploadVehicleRegistrationDocument";
import { useUpdateVehicleRegistrationEmployee } from "../hooks/useUpdateVehicleRegistrationEmployee";
import type { VehicleRegistrationEmployee } from "../index";
import type { NewVehicleRegistrationRequest } from "../../vehicle_registrations";

type ResolveVehicleRegistrationTaskDialogProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  task: VehicleRegistrationEmployee | null;
};

export default function ResolveVehicleRegistrationTaskDialog({
  open,
  onClose,
  onSuccess,
  task,
}: ResolveVehicleRegistrationTaskDialogProps) {
  const { t } = useTranslation();
  const [docFile, setDocFile] = useState<File | null>(null);

  const { mutateAsync: createRegistration, isPending: creating } =
    useAddVehicleRegistration();
  const { mutateAsync: uploadDocument, isPending: uploading } =
    useUploadVehicleRegistrationDocument();
  const { mutateAsync: updateStatus, isPending: updating } =
    useUpdateVehicleRegistrationEmployee();

  const handleSubmit = async (values: NewVehicleRegistrationRequest) => {
    if (!task) return;

    try {
      // 1. Create registration
      const result = await createRegistration(values);
      const newId = (result as any)?.data?.id || (result as any)?.data;

      if (!newId) {
        console.error("Failed to get new registration ID");
        return;
      }

      // 2. Upload document if present
      if (docFile) {
        await uploadDocument({
          registrationId: Number(newId),
          file: docFile,
        });
      }

      // 3. Complete task
      await updateStatus({
        id: task.id,
        vehicleId: task.vehicleId,
        employeeId: task.employeeId,
        expiresOn: task.expiresOn,
        vehicleRegistrationId: Number(newId),
        status: 3, // Completed
        note: task.note ?? null,
        completedAt: new Date().toISOString(),
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  const busy = creating || uploading || updating;

  if (!task) return null;

  return (
    <Dialog
      open={open}
      onClose={() => !busy && onClose()}
      fullWidth
      maxWidth="md"
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mt: 2,
          mr: 2,
          ml: 3,
          mb: 1,
        }}
      >
        <DialogTitle sx={{ p: 0 }}>
          {t("vehicleRegistrationTasks.resolveDialog.title", {
            defaultValue: "Create Registration & Complete Task",
          })}
        </DialogTitle>
        <IconButton onClick={onClose} disabled={busy}>
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent>
        <VehicleRegistrationForm
          onSubmit={handleSubmit}
          busy={busy}
          docFile={docFile}
          onDocFileChange={setDocFile}
          defaultValues={{
            vehicleId: task.vehicleId,
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
