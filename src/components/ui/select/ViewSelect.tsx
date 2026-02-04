import * as React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Typography,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

export type AppSelectOption = {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
};

type AppSelectProps = {
  label?: string;
  value: string;
  options: AppSelectOption[];
  onChange: (value: string) => void;
  size?: "small" | "medium";
  sx?: SxProps<Theme>;
};

export const ViewSelect: React.FC<AppSelectProps> = ({
  label = "assignments.view.label",
  value,
  options,
  onChange,
  size = "small",
  sx = {},
}) => {
  const { t } = useTranslation();
  const labelId = React.useId();

  const translatedLabel = label ? t(label) : undefined;

  const selected = options.find((o) => o.value === value);

  const handleChange = (event: SelectChangeEvent<string>) => {
    onChange(event.target.value);
  };

  return (
    <FormControl
      size={size}
      sx={{
        width: 160,
        minWidth: 160,
        "& .MuiInputLabel-root": {
          fontSize: 12,
          fontWeight: 500,
        },
        ...sx,
      }}
    >
      {translatedLabel && (
        <InputLabel id={labelId}>{translatedLabel}</InputLabel>
      )}

      <Select
        labelId={translatedLabel ? labelId : undefined}
        value={value}
        label={translatedLabel}
        onChange={handleChange}
        displayEmpty
        sx={(theme) => ({
          width: 160,
          borderRadius: 1,
          "& .MuiSelect-select": {
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            py: 0.5,
            px: 1.25,
            fontSize: 15,
          },
          "& fieldset": {
            borderColor: theme.palette.divider,
          },
          "&:hover fieldset": {
            borderColor: theme.palette.grey[400],
          },
          "&.Mui-focused fieldset": {
            borderColor: theme.palette.primary.main,
          },
        })}
        renderValue={() =>
          selected && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {selected.icon && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    "& svg": {
                      fontSize: 15,
                      color: "primary.main",
                    },
                  }}
                >
                  {selected.icon}
                </Box>
              )}
              <Typography
                variant="body2"
                sx={{ fontSize: 13, fontWeight: 500 }}
              >
                {selected.label}
              </Typography>
            </Box>
          )
        }
      >
        {options.map((opt) => (
          <MenuItem
            key={opt.value}
            value={opt.value}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              py: 0.75,
              fontSize: 13,
            }}
          >
            {opt.icon && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  "& svg": {
                    fontSize: 15,
                    color: "primary.main",
                  },
                }}
              >
                {opt.icon}
              </Box>
            )}
            <Typography variant="body2" sx={{ fontSize: 13 }}>
              {opt.label}
            </Typography>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
