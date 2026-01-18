import { Typography } from "@mui/material";

export default function SectionTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Typography
      variant="body2"
      sx={{ letterSpacing: 0.2, color: "text.primary" }}
    >
      {children}
    </Typography>
  );
}
