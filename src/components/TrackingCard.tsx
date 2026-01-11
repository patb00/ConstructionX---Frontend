import { Box, Chip, Paper, Stack, Typography } from "@mui/material";

export function TrackingCard(props: {
  badge: {
    text: string;
    color?: "default" | "primary" | "success" | "warning" | "error";
  };
  title: string;
  subtitle?: string;
  line1Label: string;
  line1Value: string;
  line2Label: string;
  line2Value: string;
  bottomNote?: string;
  accent?: string;
  children?: React.ReactNode;
}) {
  const {
    badge,
    title,
    subtitle,
    line1Label,
    line1Value,
    line2Label,
    line2Value,
    bottomNote,
    accent,
    children,
  } = props;

  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        p: 1.5,
        bgcolor: "background.paper",
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="stretch">
        <Box
          sx={{
            width: 18,
            position: "relative",
            display: "flex",
            justifyContent: "center",
            pt: 0.6,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 14,
              bottom: 8,
              left: "50%",
              transform: "translateX(-50%)",
              width: 2,
              bgcolor: (t) => (accent ? accent : t.palette.divider),
              opacity: 0.35,
              borderRadius: 99,
            }}
          />
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: 99,
              bgcolor: accent ?? "primary.main",
              boxShadow: "0 0 0 3px rgba(25,118,210,.12)",
              mt: 0.2,
            }}
          />
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: 800, lineHeight: 1.15 }} noWrap>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="body2" color="text.secondary" noWrap>
                  {subtitle}
                </Typography>
              )}
            </Box>

            <Chip
              size="small"
              label={badge.text}
              color={badge.color ?? "default"}
              sx={{ fontWeight: 700, ml: 1 }}
            />
          </Stack>

          <Box sx={{ mt: 1 }}>
            <Stack spacing={0.6}>
              <Stack direction="row" spacing={1} alignItems="baseline">
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {line1Label}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  noWrap
                  sx={{ minWidth: 0 }}
                >
                  {line1Value}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="baseline">
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {line2Label}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  noWrap
                  sx={{ minWidth: 0 }}
                >
                  {line2Value}
                </Typography>
              </Stack>

              {bottomNote && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 0.3 }}
                >
                  {bottomNote}
                </Typography>
              )}
            </Stack>
          </Box>

          {children && <Box sx={{ mt: 1.25 }}>{children}</Box>}
        </Box>
      </Stack>
    </Paper>
  );
}
