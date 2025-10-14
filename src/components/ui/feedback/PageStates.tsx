import { Stack, CircularProgress, Typography } from "@mui/material";

export function FullScreenLoader() {
  return (
    <Stack
      sx={{ height: "100%", width: "100%" }}
      alignItems="center"
      justifyContent="center"
    >
      <CircularProgress />
    </Stack>
  );
}

export function FullScreenError(props: {
  title?: string;
  message?: string;
  action?: React.ReactNode;
}) {
  return (
    <Stack
      sx={{ height: "100%", width: "100%", p: 3, textAlign: "center" }}
      alignItems="center"
      justifyContent="center"
      spacing={1.5}
    >
      <Typography variant="h6">
        {props.title ?? "Došlo je do greške"}
      </Typography>
      {props.message && (
        <Typography variant="body2" color="text.secondary">
          {props.message}
        </Typography>
      )}
      {props.action}
    </Stack>
  );
}
