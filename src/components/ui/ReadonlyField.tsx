import { Box, TextField, Typography } from "@mui/material";

export type ReadonlyFieldProps = {
  label: string;
  value?: React.ReactNode;
  placeholder?: string;
  monospace?: boolean;
};

export default function ReadonlyField({
  label,
  value,
  placeholder = "—",
  monospace,
}: ReadonlyFieldProps) {
  const commonSx = {
    mt: 0.5,
    "& .MuiOutlinedInput-root": {
      backgroundColor: "rgba(0,0,0,0.02)",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "divider",
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "primary.light",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "primary.main",
        boxShadow: "0 0 0 1px rgba(25,118,210,0.12)",
      },
    },
  } as const;

  const displayValue =
    value === null || value === undefined || value === "" ? placeholder : value;

  return (
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography variant="caption" sx={{ color: "text.secondary" }}>
        {label}
      </Typography>

      <TextField
        size="small"
        fullWidth
        value={displayValue as any}
        sx={commonSx}
        label={undefined}
        InputProps={{
          readOnly: true,
          sx: {
            cursor: "default",
            "& input": {
              cursor: "default",
              fontFamily: monospace
                ? "ui-monospace, SFMono-Regular, Menlo, monospace"
                : undefined,

              letterSpacing: monospace ? "0.2px" : undefined,
            },
            pointerEvents: "none",
          },
        }}
      />
    </Box>
  );
}
