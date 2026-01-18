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

export type SelectOption = {
  value: string;
  label: string;
  dotValue?: number;
  disabled?: boolean;
};

type Props = {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  disabled?: boolean;
  fullWidth?: boolean;
  size?: "small" | "medium";
  value?: string;
  onChange?: (value: string) => void;
  showDotInValue?: boolean;
  showDotInMenu?: boolean;
  width?: number | string;
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

export default function FilterSelect({
  label = "Filter",
  placeholder = "All",
  options,
  disabled,
  fullWidth,
  size = "small",
  value = "",
  onChange,
  showDotInValue = true,
  showDotInMenu = true,
  width,
}: Props) {
  const theme = useTheme();
  const items = useMemo(() => options ?? [], [options]);

  const handleChange = (e: SelectChangeEvent<string>) => {
    onChange?.(e.target.value);
  };

  const selectedOption = useMemo(
    () => items.find((o) => o.value === value),
    [items, value]
  );

  const containerWidth = fullWidth ? "100%" : width ?? 260;

  const renderOptionRow = (opt: SelectOption, withDot: boolean) => {
    const shouldShowDot = withDot && opt.dotValue != null;
    const color = shouldShowDot ? statusColor(opt.dotValue!, theme) : undefined;

    return (
      <Stack direction="row" alignItems="center" spacing={1}>
        {shouldShowDot && color ? <Dot color={color} /> : null}
        <Typography variant="body2">{opt.label}</Typography>
      </Stack>
    );
  };

  return (
    <Stack spacing={0.5} sx={{ width: containerWidth }}>
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

        <Select<string>
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

            return renderOptionRow(selectedOption, showDotInValue);
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

          {items.map((opt) => (
            <MenuItem key={opt.value} value={opt.value} disabled={opt.disabled}>
              {renderOptionRow(opt, showDotInMenu)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
}
