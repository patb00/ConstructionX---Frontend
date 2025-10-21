import { Stack } from "@mui/material";
import { useAuthStore } from "../../auth/store/useAuthStore";
import { ForceChangePasswordDialog } from "../components/ForceChangePasswordDialog";
import RootDashboard from "../components/RootDashboard";
import AdminDashboard from "../components/AdminDashbaord";

export default function DashboardRoute() {
  const mustChangePassword = useAuthStore((s) => s.mustChangePassword);
  const clearAuth = useAuthStore((s) => s.clear);

  const tenant = useAuthStore((s) => s.tenant);

  const isRoot = (tenant ?? "").toLowerCase() === "root";

  return (
    <Stack sx={{ width: "100%", minWidth: 0 }}>
      {isRoot ? <RootDashboard /> : <AdminDashboard />}

      <ForceChangePasswordDialog
        open={mustChangePassword}
        onDone={() => {}}
        onLogout={() => {
          clearAuth();
          window.location.href = "/login";
        }}
      />
    </Stack>
  );
}
