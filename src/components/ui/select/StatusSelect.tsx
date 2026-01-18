import {
  alpha,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useMemo } from "react";
import { statusColor } from "../../../utils/statusSelect";

export type StatusOption = { value: number; label: string };

type Props = {
  label?: string;
  placeholder?: string;
  options: StatusOption[];
  disabled?: boolean;
  fullWidth?: boolean;
  size?: "small" | "medium";

  value?: string;
  onChange?: (value: string) => void;
};

function Dot({ color }: { color: string }) {
  return (
    <Box
      sx={{
        width: 10,
        height: 10,
        borderRadius: "50%",
        bgcolor: color,
        flex: "0 0 auto",
        boxShadow: `
          0 0 0 2px ${alpha(color, 0.25)},
          0 0 8px ${alpha(color, 0.45)}
        `,
      }}
    />
  );
}

export default function StatusSelect({
  label = "Status",
  placeholder = "All statuses",
  options,
  disabled,
  fullWidth,
  size = "small",

  value = "",
  onChange,
}: Props) {
  const theme = useTheme();
  const items = useMemo(() => options ?? [], [options]);

  const handleChange = (e: SelectChangeEvent) => {
    onChange?.(e.target.value);
  };

  const selectedOption = useMemo(
    () => items.find((o) => String(o.value) === value),
    [items, value]
  );

  return (
    <Stack spacing={0.5} sx={{ width: fullWidth ? "100%" : 260 }}>
      <Typography
        variant="caption"
        sx={{ fontWeight: 500, color: "text.secondary" }}
      >
        {label}
      </Typography>

      <FormControl
        size={size}
        fullWidth={fullWidth}
        disabled={disabled}
        variant="outlined"
        sx={{
          "& .MuiOutlinedInput-root": {
            backgroundColor: "background.paper",
            "& fieldset": { borderColor: "divider" },
            "&:hover fieldset": { borderColor: "text.secondary" },
            "&.Mui-focused fieldset": { borderColor: "primary.main" },
          },
          "& .MuiSelect-select": { py: 1, fontWeight: 500 },
        }}
      >
        <InputLabel sx={{ display: "none" }}>{label}</InputLabel>

        <Select
          value={value}
          onChange={handleChange}
          displayEmpty
          renderValue={(selected) => {
            if (!selected) {
              return (
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {placeholder}
                </Typography>
              );
            }

            if (!selectedOption) return selected as any;

            return (
              <Stack direction="row" alignItems="center" spacing={1}>
                <Dot color={statusColor(selectedOption.value, theme)} />
                <Typography variant="body2">{selectedOption.label}</Typography>
              </Stack>
            );
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                mt: 0.5,
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              },
            },
          }}
        >
          <MenuItem value="">
            <Typography variant="body2" color="text.secondary">
              {placeholder}
            </Typography>
          </MenuItem>

          {items.map((opt) => {
            const color = statusColor(opt.value, theme);
            return (
              <MenuItem key={opt.value} value={String(opt.value)}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Dot color={color} />
                  <Typography variant="body2">{opt.label}</Typography>
                </Stack>
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Stack>
  );
}
