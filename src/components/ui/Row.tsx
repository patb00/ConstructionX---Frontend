import { Box, Stack, Typography } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import * as React from "react";

type Props = {
  left: React.ReactNode;
  right?: React.ReactNode;
  sub?: React.ReactNode;
  chips?: React.ReactNode;
  onClick?: () => void;
  addRow?: boolean;
};
export default function Row({
  left,
  right,
  sub,
  chips,
  onClick,
  addRow,
}: Props) {
  return (
    <Box
      onClick={onClick}
      sx={{
        py: 1,
        px: 0.5,
        borderRadius: 1,
        cursor: onClick ? "pointer" : "default",
        ...(addRow
          ? {
              border: (t) => `1px dashed ${t.palette.divider}`,
              "&:hover": { bgcolor: (t) => t.palette.action.hover },
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              alignItems: "center",
            }
          : {
              display: "grid",
              gridTemplateColumns: "1fr auto",
              alignItems: "center",
            }),
      }}
    >
      {addRow ? (
        <>
          <Box />
          <Stack direction="row" spacing={1} alignItems="center">
            <AddCircleOutlineIcon color="primary" fontSize="small" />
            <Typography variant="body2" fontWeight={500} color="primary.main">
              {left}
            </Typography>
          </Stack>
          <Box />
        </>
      ) : (
        <>
          <Stack spacing={0.3} sx={{ minWidth: 0, overflow: "hidden" }}>
            <Typography variant="body2" fontWeight={600} noWrap>
              {left}
            </Typography>
            {sub && (
              <Typography variant="caption" color="text.secondary" noWrap>
                {sub}
              </Typography>
            )}
            {chips}
          </Stack>
          {right && (
            <Typography
              variant="caption"
              color="primary.main"
              sx={{ ml: 2, whiteSpace: "nowrap" }}
            >
              {right}
            </Typography>
          )}
        </>
      )}
    </Box>
  );
}
