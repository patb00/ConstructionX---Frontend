import * as React from "react";
import {
  Box,
  Stack,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  MenuItem,
} from "@mui/material";

function formatForDateTimeLocal(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const tzOffset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - tzOffset * 60000);
  return local.toISOString().slice(0, 16);
}

// Return ISO UTC for datetime-local, or undefined if blank
function toIsoUtc(localValue?: string) {
  if (!localValue) return undefined;
  const d = new Date(localValue);
  return isNaN(d.getTime()) ? undefined : d.toISOString();
}

// Normalize anything (Date | ISO string | yyyy-mm-dd) to 'YYYY-MM-DD' for DateOnly
function toDateOnly(v?: string | Date | null) {
  if (!v) return "";
  if (v instanceof Date && !isNaN(v.getTime())) {
    const y = v.getFullYear();
    const m = String(v.getMonth() + 1).padStart(2, "0");
    const d = String(v.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  const s = String(v);
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s; // already good
  const datePart = s.split("T")[0];
  return /^\d{4}-\d{2}-\d{2}$/.test(datePart) ? datePart : "";
}

export type FieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "datetime-local"
  | "date" // <-- NEW
  | "checkbox"
  | "textarea"
  | "select";

export type FieldConfig<TValues extends Record<string, any>> = {
  name: keyof TValues & string;
  label: string;
  type?: FieldType;
  required?: boolean;

  defaultValue?: any;
  transformIn?: (value: any, allDefaults: Partial<TValues>) => any;
  transformOut?: (value: any, allValues: TValues) => any;

  /** For select fields */
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
};

export type SmartFormProps<TValues extends Record<string, any>> = {
  fields: FieldConfig<TValues>[];
  /** Rows of field names to render side-by-side on larger screens */
  rows?: Array<(keyof TValues & string)[]>;
  defaultValues?: Partial<TValues>;
  onSubmit: (values: TValues) => void;
  busy?: boolean;
  submitLabel?: string;
  formProps?: Omit<React.ComponentProps<typeof Box>, "component" | "onSubmit">;
};

export function SmartForm<TValues extends Record<string, any>>({
  fields,
  rows,
  defaultValues,
  onSubmit,
  busy,
  submitLabel = "Spremi",
  formProps,
}: SmartFormProps<TValues>) {
  const initial = React.useMemo(() => {
    const base: Record<string, any> = {};
    for (const f of fields) {
      const incoming =
        (defaultValues as any)?.[f.name] ??
        f.defaultValue ??
        (f.type === "checkbox" ? false : "");
      if (f.transformIn) {
        base[f.name] = f.transformIn(incoming, defaultValues ?? {});
      } else if (f.type === "datetime-local") {
        base[f.name] = formatForDateTimeLocal(incoming);
      } else if (f.type === "date") {
        base[f.name] = toDateOnly(incoming);
      } else if (f.type === "checkbox") {
        base[f.name] = Boolean(incoming);
      } else {
        base[f.name] = incoming ?? "";
      }
    }
    return base as TValues;
  }, [fields, defaultValues]);

  const [values, setValues] = React.useState<TValues>(initial);

  React.useEffect(() => setValues(initial), [initial]);

  const update =
    (name: keyof TValues & string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const isCheckbox = e.target.type === "checkbox";
      const next: any = isCheckbox ? (e.target as any).checked : e.target.value;
      setValues((v) => ({ ...v, [name]: next }));
    };

  const renderField = (f: FieldConfig<TValues>) => {
    const type = f.type ?? "text";

    if (type === "checkbox") {
      return (
        <FormControlLabel
          key={f.name}
          control={
            <Checkbox
              checked={Boolean((values as any)[f.name])}
              onChange={update(f.name)}
              {...(f.props?.checkboxProps as any)}
            />
          }
          label={f.label}
        />
      );
    }

    if (type === "select") {
      return (
        <TextField
          key={f.name}
          label={f.label}
          required={f.required}
          size="small"
          fullWidth
          select
          value={(values as any)[f.name] ?? ""}
          onChange={update(f.name)}
          {...(f.props as any)}
        >
          {(f.options ?? []).map((opt) => (
            <MenuItem key={String(opt.value)} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </TextField>
      );
    }

    // For "date", use native date input; for "datetime-local" keep as-is
    const tfType =
      type === "textarea" ? undefined : type === "date" ? "date" : type;

    return (
      <TextField
        key={f.name}
        label={f.label}
        required={f.required}
        size="small"
        fullWidth
        type={tfType}
        value={(values as any)[f.name] ?? ""}
        onChange={update(f.name)}
        multiline={type === "textarea"}
        InputLabelProps={
          type === "datetime-local" || type === "date"
            ? { shrink: true }
            : undefined
        }
        {...(f.props as any)}
      />
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
      .map(
        (names) =>
          names
            .map((n) => fieldsByName.get(n)!)
            .filter(Boolean) as FieldConfig<TValues>[]
      )
      .filter((r) => r.length > 0);
  }, [rows, fields, fieldsByName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const out: Record<string, any> = {};
    for (const f of fields) {
      const raw = (values as any)[f.name];
      if (f.transformOut) {
        out[f.name] = f.transformOut(raw, values);
      } else if (f.type === "datetime-local") {
        out[f.name] = toIsoUtc(raw); // ISO string or undefined
      } else if (f.type === "date") {
        out[f.name] = raw ? toDateOnly(raw) : null; // 'YYYY-MM-DD' or null
        // 'YYYY-MM-DD' or undefined
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

        <Button type="submit" variant="contained" disabled={busy} size="small">
          {busy ? "Spremanje" : submitLabel}
        </Button>
      </Stack>
    </Box>
  );
}

export default SmartForm;
