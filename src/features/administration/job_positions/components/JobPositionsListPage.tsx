import { Button, Stack, Typography, Paper } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import JobPositionsTable from "./JobPositionsTable";
import { useJobPositions } from "../hooks/useJobPositions";
import { QueryBoundary } from "../../../../components/ui/feedback/QueryBoundary";
import { FullScreenError } from "../../../../components/ui/feedback/PageStates";
import { PermissionGate } from "../../../../lib/permissions";

const JobPositionsListPage = () => {
  const { jobPositionsRows, jobPositionsColumns, error, isLoading } =
    useJobPositions();

  return (
    <QueryBoundary
      isLoading={isLoading}
      error={error}
      fallbackError={
        <FullScreenError title="Neuspjelo učitavanje radnih mjesta" />
      }
    >
      <Stack spacing={2} sx={{ height: "100%", width: "100%" }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
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
    </QueryBoundary>
  );
};

export default JobPositionsListPage;
