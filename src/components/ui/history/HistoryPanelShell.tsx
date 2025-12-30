import { Box, Divider, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

export const pillSx = {
  borderRadius: 999,
  fontSize: 11,
  px: 1.2,
  py: 0.2,
} as const;

type Props = {
  title: string;
  headerChips?: ReactNode;
  children: ReactNode;
};

export function HistoryPanelShell({ title, headerChips, children }: Props) {
  return (
    <Box
      p={2}
      sx={{
        bgcolor: "#F7F7F8",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>
          {title}
        </Typography>

        {headerChips ? (
          <Stack
            direction="row"
            spacing={0.75}
            flexWrap="wrap"
            sx={{ mb: 1.5 }}
          >
            {headerChips}
          </Stack>
        ) : null}

        <Divider />
      </Box>

      <Stack spacing={2.5} sx={{ overflowY: "auto", pr: 0.5 }}>
        {children}
      </Stack>
    </Box>
  );
}
