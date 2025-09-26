import * as React from "react";
import {
  Box,
  Stack,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
} from "@mui/material";

function formatForDateTimeLocal(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const tzOffset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - tzOffset * 60000);
  return local.toISOString().slice(0, 16);
}

function toIsoUtc(localValue?: string) {
  if (!localValue) return new Date().toISOString();
  const d = new Date(localValue);
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

export type FieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "datetime-local"
  | "checkbox"
  | "textarea";

export type FieldConfig<TValues extends Record<string, any>> = {
  name: keyof TValues & string;
  label: string;
  type?: FieldType;
  required?: boolean;

  defaultValue?: any;
  transformIn?: (value: any, allDefaults: Partial<TValues>) => any;
  transformOut?: (value: any, allValues: TValues) => any;

  props?: Omit<
    React.ComponentProps<typeof TextField>,
    "value" | "onChange" | "label" | "type" | "required" | "multiline"
  > & {
    checkboxProps?: Omit<
      React.ComponentProps<typeof Checkbox>,
      "checked" | "onChange"
    >;
  };
};

export type SmartFormProps<TValues extends Record<string, any>> = {
  fields: FieldConfig<TValues>[];
  rows?: Array<keyof TValues & string>[];
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

    return (
      <TextField
        key={f.name}
        label={f.label}
        required={f.required}
        size="small"
        fullWidth
        type={type === "textarea" ? undefined : type}
        value={(values as any)[f.name] ?? ""}
        onChange={update(f.name)}
        multiline={type === "textarea"}
        InputLabelProps={
          type === "datetime-local" ? { shrink: true } : undefined
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
      if (f.transformOut) out[f.name] = f.transformOut(raw, values);
      else if (f.type === "datetime-local") out[f.name] = toIsoUtc(raw);
      else out[f.name] = raw;
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
