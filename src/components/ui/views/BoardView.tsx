import * as React from "react";
import {
  Box,
  Stack,
  Typography,
  CircularProgress,
  Divider,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

export type BoardColumnConfig<T = any> = {
  id: string;
  icon?: React.ReactNode;
  title: React.ReactNode;
  loading?: boolean;
  rows: T[];
  count?: number;
  headerAction?: React.ReactNode;
  renderRow: (row: T) => React.ReactNode;
  emptyContent?: React.ReactNode;
};

type BoardViewProps = {
  columns: BoardColumnConfig[];
  sx?: SxProps<Theme>;
};

export const BoardView: React.FC<BoardViewProps> = ({ columns, sx }) => {
  const columnSx: SxProps<Theme> = {
    flexGrow: 1,
    flexBasis: {
      xs: "100%",
      sm: "100%",
      md: "calc(25% - 16px)",
    },
    minWidth: 0,
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "flex-start",
        width: "100%",
        ...sx,
      }}
    >
      {columns.map((col) => {
        const hasRows = col.rows.length > 0;
        const count = col.count ?? col.rows.length;

        return (
          <Box key={col.id} sx={columnSx}>
            <Box
              sx={{
                mb: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                {col.icon}
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  color="text.secondary"
                >
                  {col.title} ({count})
                </Typography>
              </Stack>

              {col.headerAction}
            </Box>

            <Divider sx={{ my: 1 }} />

            {col.loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                <CircularProgress size={22} />
              </Box>
            ) : !hasRows ? (
              col.emptyContent ?? (
                <Typography variant="body2" color="text.secondary">
                  Nema podataka za prikaz.
                </Typography>
              )
            ) : (
              <Stack spacing={1.5}>
                {col.rows.map((row) => col.renderRow(row))}
              </Stack>
            )}
          </Box>
        );
      })}
    </Box>
  );
};
