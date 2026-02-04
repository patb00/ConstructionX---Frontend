import { alpha, type Theme } from "@mui/material";

export const dueSoonRowSx = (theme: Theme) => ({
  "& .MuiDataGrid-row.row--dueSoon": {
    backgroundColor: `${alpha(theme.palette.error.main, 0.12)} !important`,
  },
  "& .MuiDataGrid-row.row--dueSoon .MuiDataGrid-cell": {
    backgroundColor: `${alpha(theme.palette.error.main, 0.12)} !important`,
  },
  "& .MuiDataGrid-row.row--dueSoon .MuiDataGrid-cell--pinnedRight": {
    backgroundColor: `white !important`,
  },
});
