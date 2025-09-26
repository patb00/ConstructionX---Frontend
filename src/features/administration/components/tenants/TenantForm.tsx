import * as React from "react";
import {
  Box,
  Stack,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
} from "@mui/material";
import type { NewTenantRequest } from "../../types";

type Props = {
  defaultValues?: Partial<NewTenantRequest>;
  onSubmit: (values: NewTenantRequest) => void;
  busy?: boolean;
};

function formatForDateTimeLocal(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  const tzOffset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - tzOffset * 60000);
  return local.toISOString().slice(0, 16);
}

function toIsoUtc(localValue?: string) {
  if (!localValue) return new Date().toISOString();
  const d = new Date(localValue);
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

function normalizeBackslashes(s: string) {
  return s.replace(/\\+/g, "\\");
}

function sanitizeConnectionString(s?: string | null): string | null {
  const trimmed = (s ?? "").trim();
  if (!trimmed) return null;
  return normalizeBackslashes(trimmed);
}

export default function TenantForm({ defaultValues, onSubmit, busy }: Props) {
  const [values, setValues] = React.useState<NewTenantRequest>({
    identifier: "",
    name: "",
    connectionString: defaultValues?.connectionString ?? "",
    email: "",
    firstName: "",
    lastName: "",
    validUpToDate: formatForDateTimeLocal(defaultValues?.validUpToDate),
    isActive: true,
    ...defaultValues,
  });

  const update =
    (k: keyof NewTenantRequest) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setValues((v) => ({
        ...v,
        [k]:
          e.target.type === "checkbox"
            ? (e.target as any).checked
            : e.target.value,
      }));

  return (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          ...values,
          connectionString: sanitizeConnectionString(values.connectionString),
          validUpToDate: toIsoUtc(values.validUpToDate),
        });
      }}
      p={2}
    >
      <Stack spacing={2}>
        <Stack direction={{ xs: "row", sm: "row" }} spacing={2}>
          <TextField
            label="Identifier"
            size="small"
            fullWidth
            required
            value={values.identifier}
            onChange={update("identifier")}
          />
          <TextField
            label="Name"
            size="small"
            fullWidth
            required
            value={values.name}
            onChange={update("name")}
          />
        </Stack>

        <TextField
          label="Connection String"
          size="small"
          fullWidth
          value={values.connectionString ?? ""}
          onChange={update("connectionString")}
          inputProps={{
            maxLength: 500,
            spellCheck: false,
            autoCapitalize: "off",
            autoCorrect: "off",
          }}
        />

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="Email"
            size="small"
            fullWidth
            type="email"
            value={values.email}
            onChange={update("email")}
          />
          <TextField
            label="Valid Until"
            size="small"
            fullWidth
            type="datetime-local"
            value={values.validUpToDate}
            onChange={update("validUpToDate")}
            InputLabelProps={{ shrink: true }}
          />
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="First name"
            size="small"
            fullWidth
            value={values.firstName}
            onChange={update("firstName")}
          />
          <TextField
            label="Last name"
            size="small"
            fullWidth
            value={values.lastName}
            onChange={update("lastName")}
          />
        </Stack>

        <FormControlLabel
          control={
            <Checkbox checked={values.isActive} onChange={update("isActive")} />
          }
          label="Active"
        />

        <Button type="submit" variant="contained" disabled={busy} size="small">
          {busy ? "Spremanje" : "Spremi"}
        </Button>
      </Stack>
    </Box>
  );
}
