import { Box, Card, Stack, Typography } from "@mui/material";
import * as React from "react";

export default function StatCard({
  icon,
  label,
  value,
  caption,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  caption?: string;
}) {
  return (
    <Card sx={{ flex: 1, minWidth: 240 }}>
      <Box sx={{ p: 1.5 }}>
        <Stack spacing={1.25}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                p: 1,
                borderRadius: 2,
                border: (t) => `1px solid ${t.palette.divider}`,
              }}
            >
              {icon}
            </Box>
            <Typography variant="overline" color="text.secondary">
              {label}
            </Typography>
          </Stack>
          <Typography variant="h6" fontWeight={700} color="primary.main">
            {value}
          </Typography>
          {caption && (
            <Typography variant="caption" color="text.secondary">
              {caption}
            </Typography>
          )}
        </Stack>
      </Box>
    </Card>
  );
}
