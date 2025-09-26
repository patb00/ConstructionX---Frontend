import * as React from "react";
import { Box, Chip, CircularProgress, TextField } from "@mui/material";
import { type GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import CheckIcon from "@mui/icons-material/Check";
import BlockIcon from "@mui/icons-material/Block";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

import { useTenants } from "../hooks/useTenants";
import { useActivateTenant } from "../hooks/useActivateTenant";
import { useDeactivateTenant } from "../hooks/useDeactivateTenant";
import { useUpdateSubscription } from "../hooks/useUpdateSubscription";
import { extractRows } from "../../../../utilis/dataGrid";
import type { Tenant } from "..";
import { isTenant } from "../../utils/isTenant";
import { useMemo } from "react";
import ReusableDataGrid from "../../../../components/ui/datagrid/ReusableDataGrid";

const pad = (n: number) => String(n).padStart(2, "0");
function isoToLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}
function localInputToIso(local: string): string {
  return new Date(local).toISOString();
}

export default function TenantsTable() {
  const { data } = useTenants();
  const activate = useActivateTenant();
  const deactivate = useDeactivateTenant();
  const updateSub = useUpdateSubscription();

  const rows = React.useMemo(() => extractRows<Tenant>(data, isTenant), [data]);

  const [editing, setEditing] = React.useState<{
    id: string;
    input: string;
  } | null>(null);

  const startEdit = (t: Tenant) =>
    setEditing({ id: t.identifier, input: isoToLocalInput(t.validUpToDate) });
  const cancelEdit = () => setEditing(null);
  const saveEdit = (t: Tenant) => {
    if (!editing?.input) return;
    updateSub.mutate(
      {
        tenantId: t.identifier,
        newExpirationDate: localInputToIso(editing.input),
      },
      { onSuccess: () => setEditing(null) }
    );
  };

  const columns = useMemo<GridColDef<Tenant>[]>(
    () => [
      {
        field: "identifier",
        headerName: "Identifier",
        flex: 1,
        minWidth: 140,
        sortable: true,
      },
      {
        field: "name",
        headerName: "Name",
        flex: 1.2,
        minWidth: 160,
        sortable: true,
      },
      {
        field: "email",
        headerName: "Email",
        flex: 1.8,
        minWidth: 260,
        sortable: true,
      },
      {
        field: "validUpToDate",
        headerName: "Valid Until",
        flex: 1.6,
        minWidth: 220,
        sortable: true,
        type: "dateTime",
        valueGetter: (_v, row) =>
          row.validUpToDate ? new Date(row.validUpToDate) : null,
        sortComparator: (a, b) =>
          new Date(a as any).getTime() - new Date(b as any).getTime(),
        renderCell: (params) => {
          const t = params.row;
          const isThisEditing = editing?.id === t.identifier;
          if (!isThisEditing) {
            const val = t.validUpToDate
              ? new Date(t.validUpToDate).toLocaleString()
              : "";
            return (
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <span>{val}</span>
              </Box>
            );
          }
          const saving =
            updateSub.isPending &&
            (updateSub.variables as any)?.tenantId === t.identifier;

          return (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                type="datetime-local"
                size="small"
                value={editing.input}
                onChange={(e) =>
                  setEditing({ id: t.identifier, input: e.target.value })
                }
                sx={{ width: 260, "& input": { textAlign: "center" } }}
                inputProps={{ "aria-label": "Valid until" }}
                disabled={saving}
              />
            </Box>
          );
        },
      },
      {
        field: "isActive",
        headerName: "Status",
        flex: 1,
        minWidth: 140,
        type: "singleSelect",
        valueOptions: ["Active", "Inactive"],
        align: "center",
        headerAlign: "center",
        valueGetter: (_value, row) => (row.isActive ? "Active" : "Inactive"),
        renderCell: (params) => {
          const active = params.row.isActive;
          return (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Chip
                size="small"
                label={active ? "Active" : "Inactive"}
                color={active ? "success" : "default"}
                variant={active ? "filled" : "outlined"}
                sx={{ lineHeight: 1 }}
              />
            </Box>
          );
        },
      },
      {
        field: "actions",
        type: "actions",
        headerName: "Actions",
        getActions: (params) => {
          const t = params.row;

          const isActivating =
            activate.isPending && (activate.variables as any) === t.identifier;
          const isDeactivating =
            deactivate.isPending &&
            (deactivate.variables as any) === t.identifier;
          const isUpdating =
            updateSub.isPending &&
            (updateSub.variables as any)?.tenantId === t.identifier;

          const isThisEditing = editing?.id === t.identifier;
          const busy = isActivating || isDeactivating || isUpdating;

          const leftSlot = !isThisEditing ? (
            <GridActionsCellItem
              key="edit"
              icon={<EditIcon fontSize="small" />}
              label="Edit Valid Until"
              disabled={busy}
              onClick={() => startEdit(t)}
              showInMenu={false}
            />
          ) : (
            <GridActionsCellItem
              key="save"
              icon={
                isUpdating ? (
                  <CircularProgress size={16} />
                ) : (
                  <SaveIcon fontSize="small" />
                )
              }
              label={isUpdating ? "Saving..." : "Save"}
              disabled={isUpdating || !editing?.input}
              onClick={() => saveEdit(t)}
              showInMenu={false}
            />
          );

          const rightSlot = !isThisEditing ? (
            t.isActive ? (
              <GridActionsCellItem
                key="deactivate"
                icon={
                  isDeactivating ? (
                    <CircularProgress size={16} />
                  ) : (
                    <BlockIcon fontSize="small" />
                  )
                }
                label={isDeactivating ? "Deactivating..." : "Deactivate"}
                disabled={busy}
                onClick={() => deactivate.mutate(t.identifier)}
                showInMenu={false}
              />
            ) : (
              <GridActionsCellItem
                key="activate"
                icon={
                  isActivating ? (
                    <CircularProgress size={16} />
                  ) : (
                    <CheckIcon fontSize="small" />
                  )
                }
                label={isActivating ? "Activating..." : "Activate"}
                disabled={busy}
                onClick={() => activate.mutate(t.identifier)}
                showInMenu={false}
              />
            )
          ) : (
            <GridActionsCellItem
              key="cancel"
              icon={<CloseIcon fontSize="small" />}
              label="Cancel"
              disabled={isUpdating}
              onClick={cancelEdit}
              showInMenu={false}
            />
          );

          return [leftSlot, rightSlot];
        },
        flex: 1,
        minWidth: 220,
        sortable: false,
        filterable: false,
      },
    ],
    [
      editing,
      activate.isPending,
      activate.variables,
      deactivate.isPending,
      deactivate.variables,
      updateSub.isPending,
      updateSub.variables,
    ]
  );

  return (
    <ReusableDataGrid<Tenant>
      rows={rows}
      columns={columns}
      getRowId={(r) => r.identifier}
      pageSize={10}
    />
  );
}
