import {
  Card,
  CardContent,
  Typography,
  Box,
  type SxProps,
  type Theme,
} from "@mui/material";

type Props = {
  label: string;
  value: number | string;
  icon?: React.ReactNode;
  sx?: SxProps<Theme>;
  onClick?: () => void;
  selected?: boolean;
};

export function StatCard({ label, value, icon, sx, onClick, selected }: Props) {
  return (
    <Card
      elevation={selected ? 6 : 3}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : -1}
      sx={{
        height: 120,
        cursor: onClick ? "pointer" : "default",
        outline: "none",
        border: (theme) =>
          selected
            ? `2px solid ${theme.palette.primary.main}`
            : "2px solid transparent",
        backgroundColor: (theme) =>
          selected ? theme.palette.primary.main : "inherit",
        color: (theme) => (selected ? theme.palette.common.white : "inherit"),
        "& .MuiTypography-root": {
          color: (theme) => (selected ? theme.palette.common.white : undefined),
        },
        "& svg": {
          color: (theme) => (selected ? theme.palette.common.white : undefined),
        },
        "&:hover": onClick ? { transform: "translateY(-2px)" } : undefined,
        transition: "transform 120ms ease, box-shadow 120ms ease",
        ...sx,
      }}
      onKeyDown={(e) => {
        if (!onClick) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          {icon}
          <Typography variant="subtitle2" color="text.secondary">
            {label}
          </Typography>
        </Box>
        <Typography variant="h4" fontWeight={600}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}
