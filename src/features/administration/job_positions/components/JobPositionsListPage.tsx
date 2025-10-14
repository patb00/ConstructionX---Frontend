import { Button, Stack, Typography, Paper } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import JobPositionsTable from "./JobPositionsTable";
import { useJobPositions } from "../hooks/useJobPositions";

import { PermissionGate } from "../../../../lib/permissions";

const JobPositionsListPage = () => {
  const { jobPositionsRows, jobPositionsColumns } = useJobPositions();

  return (
    <Stack spacing={2} sx={{ height: "100%", width: "100%" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          Radna mjesta
        </Typography>

        <PermissionGate
          guard={{ permission: "Permission.JobPositions.Create" }}
        >
          <Button
            size="small"
            component={RouterLink}
            to="create"
            variant="contained"
          >
            Kreiraj radno mjesto
          </Button>
        </PermissionGate>
      </Stack>

      <Paper elevation={0} sx={{ flexGrow: 1, mt: 1, p: 0 }}>
        <JobPositionsTable
          rows={jobPositionsRows}
          columns={jobPositionsColumns}
        />
      </Paper>
    </Stack>
  );
};

export default JobPositionsListPage;
