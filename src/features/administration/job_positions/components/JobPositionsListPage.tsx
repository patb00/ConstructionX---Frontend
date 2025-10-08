import { Button, Stack, Typography, Paper } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import JobPositionsTable from "./JobPositionsTable";

const JobPositionsListPage = () => {
  return (
    <Stack spacing={2} sx={{ height: "100%", width: "100%" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          Radna mjesta
        </Typography>
        <Button
          size="small"
          component={RouterLink}
          to="create"
          variant="contained"
        >
          Kreiraj radno mjesto
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
        <JobPositionsTable />
      </Paper>
    </Stack>
  );
};

export default JobPositionsListPage;
