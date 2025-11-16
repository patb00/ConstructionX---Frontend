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
  disabled?: boolean;
};

export function StatCard({
  label,
  value,
  icon,
  sx,
  onClick,
  selected,
  disabled,
}: Props) {
  const computedDisabled =
    disabled ?? (typeof value === "number" ? value === 0 : value === "0");

  const interactive = !!onClick && !computedDisabled;
  const isSelected = !!selected && !computedDisabled;

  return (
    <Card
      elevation={isSelected ? 6 : 1}
      onClick={interactive ? onClick : undefined}
      role={interactive ? "button" : undefined}
      aria-disabled={computedDisabled || undefined}
      tabIndex={interactive ? 0 : -1}
      sx={{
        height: 120,
        cursor: interactive
          ? "pointer"
          : computedDisabled
          ? "not-allowed"
          : "default",
        outline: "none",
        border: (theme) =>
          isSelected
            ? `2px solid ${theme.palette.primary.main}`
            : "2px solid transparent",
        backgroundColor: (theme) =>
          isSelected ? theme.palette.primary.main : "inherit",
        color: (theme) => (isSelected ? theme.palette.common.white : "inherit"),
        "& .MuiTypography-root": {
          color: (theme) =>
            isSelected ? theme.palette.common.white : undefined,
        },
        "& svg": {
          color: (theme) =>
            isSelected ? theme.palette.common.white : undefined,
        },
        opacity: computedDisabled ? 0.5 : 1,
        pointerEvents: computedDisabled ? "none" : "auto",
        "&:hover": interactive ? { transform: "translateY(-2px)" } : undefined,
        transition: "transform 120ms ease, box-shadow 120ms ease",
        ...sx,
      }}
      onKeyDown={(e) => {
        if (!interactive) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
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
