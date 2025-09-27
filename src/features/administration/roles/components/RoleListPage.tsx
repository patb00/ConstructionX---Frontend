import { Button, Stack, Typography, Paper } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import RolesTable from "./RolesTable";
import { useRolesFull } from "../hooks/useRolesFull";

const RoleslListPage = () => {
  const { data } = useRolesFull("93ecb76b-5d55-4bd4-af7f-a03ef6954f00");
  console.log("data", data);

  return (
    <Stack spacing={2} sx={{ height: "100%", width: "100%" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          Uloge
        </Typography>
        <Button
          size="small"
          component={RouterLink}
          to="create"
          variant="contained"
        >
          Kreiraj ulogu
        </Button>
      </Stack>
      <Paper
        elevation={0}
        sx={{
          flexGrow: 1,
          mt: 1,
          p: 0,
        }}
      >
        <RolesTable />
      </Paper>
    </Stack>
  );
};

export default RoleslListPage;
