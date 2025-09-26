import * as React from "react";
import {
  Box,
  Stack,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
} from "@mui/material";

export type TenantFormValues = {
  identifier: string;
  name: string;
  connectionString: string;
  email: string;
  firstName: string;
  lastName: string;
  validUpToDate: string;
  isActive: boolean;
};

type Props = {
  defaultValues?: Partial<TenantFormValues>;
  onSubmit: (values: TenantFormValues) => void;
  busy?: boolean;
};

function formatForDateTimeLocal(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  const tzOffset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - tzOffset * 60000);
  return local.toISOString().slice(0, 16);
}

export default function TenantForm({ defaultValues, onSubmit, busy }: Props) {
  const [values, setValues] = React.useState<TenantFormValues>({
    identifier: "",
    name: "",
    connectionString: "",
    email: "",
    firstName: "",
    lastName: "",
    validUpToDate: formatForDateTimeLocal(defaultValues?.validUpToDate),
    isActive: true,
    ...defaultValues,
  });

  const update =
    (k: keyof TenantFormValues) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setValues((v) => ({
        ...v,
        [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
      }));

  return (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(values);
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
          required
          value={values.connectionString}
          onChange={update("connectionString")}
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
