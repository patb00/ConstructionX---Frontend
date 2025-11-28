import * as React from "react";
import {
  Box,
  Stack,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  MenuItem,
  Typography,
  CircularProgress,
} from "@mui/material";

import { DatePicker, DateTimePicker } from "@mui/x-date-pickers";

function toDateOnly(v?: string | Date | null) {
  if (!v) return "";
  if (v instanceof Date && !isNaN(v.getTime())) {
    const y = v.getFullYear();
    const m = String(v.getMonth() + 1).padStart(2, "0");
    const d = String(v.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  const s = String(v);
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const datePart = s.split("T")[0];
  return /^\d{4}-\d{2}-\d{2}$/.test(datePart) ? datePart : "";
}

export type FieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "datetime-local"
  | "date"
  | "checkbox"
  | "textarea"
  | "select"
  | "file";

export type FieldConfig<TValues extends Record<string, any>> = {
  name: keyof TValues & string;
  label: string;
  type?: FieldType;
  required?: boolean;

  defaultValue?: any;
  transformIn?: (value: any, allDefaults: Partial<TValues>) => any;
  transformOut?: (value: any, allValues: TValues) => any;

  options?: Array<{ label: string; value: any }>;

  props?: Omit<
    React.ComponentProps<typeof TextField>,
    | "value"
    | "onChange"
    | "label"
    | "type"
    | "required"
    | "multiline"
    | "select"
  > & {
    checkboxProps?: Omit<
      React.ComponentProps<typeof Checkbox>,
      "checked" | "onChange"
    >;
  };

  fileConfig?: {
    file?: File | null;
    onChange?: (file: File | null) => void;
    accept?: string;
  };
};

export type SmartFormProps<TValues extends Record<string, any>> = {
  fields: FieldConfig<TValues>[];
  rows?: Array<(keyof TValues & string)[]>;
  defaultValues?: Partial<TValues>;
  onSubmit: (values: TValues) => void;
  busy?: boolean;
  submitLabel?: string;
  formProps?: Omit<React.ComponentProps<typeof Box>, "component" | "onSubmit">;
  renderFooterActions?: (values: TValues) => React.ReactNode;
};

function buildInitial<TValues extends Record<string, any>>(
  fields: FieldConfig<TValues>[],
  defaultValues?: Partial<TValues>
): TValues {
  const base: Record<string, any> = {};

  for (const f of fields) {
    if (f.type === "file") continue;

    const incoming =
      (defaultValues as any)?.[f.name] ??
      f.defaultValue ??
      (f.type === "checkbox" ? false : "");

    if (f.transformIn) {
      base[f.name] = f.transformIn(incoming, defaultValues ?? {});
    } else if (f.type === "datetime-local") {
      base[f.name] = incoming;
    } else if (f.type === "date") {
      base[f.name] = toDateOnly(incoming);
    } else if (f.type === "checkbox") {
      base[f.name] = Boolean(incoming);
    } else {
      base[f.name] = incoming ?? "";
    }
  }

  return base as TValues;
}

export function SmartForm<TValues extends Record<string, any>>({
  fields,
  rows,
  defaultValues,
  onSubmit,
  busy,
  submitLabel = "Spremi",
  formProps,
  renderFooterActions,
}: SmartFormProps<TValues>) {
  const [values, setValues] = React.useState<TValues>(() =>
    buildInitial(fields, defaultValues)
  );

  const [hasInteracted, setHasInteracted] = React.useState(false);

  React.useEffect(() => {
    const hasDefaults =
      defaultValues && Object.keys(defaultValues as object).length > 0;
    if (!hasDefaults) return;
    if (hasInteracted) {
      return;
    }

    setValues(buildInitial(fields, defaultValues));
  }, [defaultValues, fields, hasInteracted]);

  const update =
    (name: keyof TValues & string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const isCheckbox = e.target.type === "checkbox";
      const next: any = isCheckbox ? (e.target as any).checked : e.target.value;
      setHasInteracted(true);
      setValues((v) => ({ ...v, [name]: next }));
    };

  const renderField = (f: FieldConfig<TValues>) => {
    const type = f.type ?? "text";

    if (type === "checkbox") {
      const { checkboxProps, ...restProps } = (f.props ?? {}) as any;

      return (
        <FormControlLabel
          key={f.name}
          control={
            <Checkbox
              checked={Boolean((values as any)[f.name])}
              onChange={update(f.name)}
              {...checkboxProps}
            />
          }
          label={
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {f.label}
            </Typography>
          }
          {...restProps}
        />
      );
    }

    const {
      checkboxProps: _ignored,
      sx: fieldSx,
      ...textFieldProps
    } = (f.props ?? {}) as any;

    const commonSx = {
      mt: 0.5,
      "& .MuiOutlinedInput-root": {
        backgroundColor: "background.paper",
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
      ...fieldSx,
    };

    // FILE FIELD (uses fileConfig, not values)
    if (type === "file") {
      const fileCfg = f.fileConfig;
      return (
        <Box key={f.name} sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="caption"
            sx={{ fontWeight: 500, color: "text.secondary" }}
          >
            {f.label}
          </Typography>

          <Box
            sx={{
              mt: 0.5,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <input
              type="file"
              accept={fileCfg?.accept}
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                fileCfg?.onChange?.(file);
              }}
              style={{ fontSize: 12 }}
            />
            {fileCfg?.file && (
              <Typography variant="body2" color="text.secondary">
                {fileCfg.file.name}
              </Typography>
            )}
          </Box>
        </Box>
      );
    }

    // DATE
    if (type === "date") {
      const raw = (values as any)[f.name];
      const dateValue =
        raw && typeof raw === "string"
          ? new Date(raw)
          : raw instanceof Date
          ? raw
          : null;

      return (
        <Box key={f.name} sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="caption"
            sx={{ fontWeight: 500, color: "text.secondary" }}
          >
            {f.label}
            {f.required && (
              <Box component="span" sx={{ color: "error.main", ml: 0.25 }}>
                *
              </Box>
            )}
          </Typography>

          <DatePicker
            value={isNaN(dateValue as any) ? null : dateValue}
            onChange={(newValue) => {
              setHasInteracted(true);
              setValues((v) => ({
                ...v,
                [f.name]: toDateOnly(newValue ?? null),
              }));
            }}
            slotProps={{
              textField: {
                size: "small",
                fullWidth: true,
                required: f.required,
                sx: commonSx,
                label: undefined,
                placeholder: textFieldProps.placeholder ?? f.label,
                ...textFieldProps,
              },
            }}
          />
        </Box>
      );
    }

    // DATETIME
    if (type === "datetime-local") {
      const raw = (values as any)[f.name];
      const dateValue =
        typeof raw === "string"
          ? new Date(raw)
          : raw instanceof Date
          ? raw
          : null;

      return (
        <Box key={f.name} sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="caption"
            sx={{ fontWeight: 500, color: "text.secondary" }}
          >
            {f.label}
            {f.required && (
              <Box component="span" sx={{ color: "error.main", ml: 0.25 }}>
                *
              </Box>
            )}
          </Typography>

          <DateTimePicker
            value={isNaN(dateValue as any) ? null : dateValue}
            onChange={(newValue) => {
              setHasInteracted(true);
              setValues((v) => ({
                ...v,
                [f.name]: newValue ? newValue.toISOString() : null,
              }));
            }}
            slotProps={{
              textField: {
                size: "small",
                fullWidth: true,
                required: f.required,
                sx: commonSx,
                label: undefined,
                placeholder: textFieldProps.placeholder ?? f.label,
                ...textFieldProps,
              },
            }}
          />
        </Box>
      );
    }

    // SELECT
    if (type === "select") {
      return (
        <Box key={f.name} sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="caption"
            sx={{ fontWeight: 500, color: "text.secondary" }}
          >
            {f.label}
            {f.required && (
              <Box component="span" sx={{ color: "error.main", ml: 0.25 }}>
                *
              </Box>
            )}
          </Typography>

          <TextField
            size="small"
            fullWidth
            select
            value={(values as any)[f.name] ?? ""}
            onChange={update(f.name)}
            sx={commonSx}
            {...textFieldProps}
          >
            {(f.options ?? []).map((opt) => (
              <MenuItem key={String(opt.value)} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      );
    }

    // DEFAULT INPUT
    return (
      <Box key={f.name} sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="caption"
          sx={{ fontWeight: 500, color: "text.secondary" }}
        >
          {f.label}
          {f.required && (
            <Box component="span" sx={{ color: "error.main", ml: 0.25 }}>
              *
            </Box>
          )}
        </Typography>

        <TextField
          size="small"
          fullWidth
          variant="outlined"
          type={type === "textarea" ? undefined : type}
          value={(values as any)[f.name] ?? ""}
          onChange={update(f.name)}
          multiline={type === "textarea"}
          sx={commonSx}
          label={undefined}
          placeholder={textFieldProps.placeholder ?? f.label}
          {...textFieldProps}
        />
      </Box>
    );
  };

  const fieldsByName = React.useMemo(() => {
    const map = new Map<string, FieldConfig<TValues>>();
    fields.forEach((f) => map.set(f.name, f));
    return map;
  }, [fields]);

  const layoutRows: FieldConfig<TValues>[][] = React.useMemo(() => {
    if (!rows || rows.length === 0) return fields.map((f) => [f]);

    return rows
      .map((names) => names.map((n) => fieldsByName.get(n)!).filter(Boolean))
      .filter((r) => r.length > 0);
  }, [rows, fields, fieldsByName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const out: Record<string, any> = {};

    for (const f of fields) {
      if (f.type === "file") continue; // file/attachment handled separately

      const raw = (values as any)[f.name];

      if (f.transformOut) {
        out[f.name] = f.transformOut(raw, values);
      } else if (f.type === "datetime-local") {
        out[f.name] = raw ? raw : null;
      } else if (f.type === "date") {
        out[f.name] = raw ? toDateOnly(raw) : null;
      } else {
        out[f.name] = raw;
      }
    }

    onSubmit(out as TValues);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      p={2}
      {...(formProps as Omit<React.ComponentProps<"form">, "onSubmit">)}
    >
      <Stack spacing={2}>
        {layoutRows.map((row, idx) => (
          <Stack key={idx} direction={{ xs: "column", sm: "row" }} spacing={2}>
            {row.map((f) => renderField(f))}
          </Stack>
        ))}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 1,
            gap: 2,
          }}
        >
          <Box>{renderFooterActions ? renderFooterActions(values) : null}</Box>

          <Button
            type="submit"
            variant="contained"
            disabled={busy}
            size="small"
          >
            {busy && (
              <CircularProgress size={16} sx={{ mr: 1, color: "inherit" }} />
            )}
            {submitLabel}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}

export default SmartForm;
