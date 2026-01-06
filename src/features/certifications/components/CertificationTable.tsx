import { useMemo, useState, useCallback } from "react";
import { Box, useTheme } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import type { GridRowClassNameParams } from "@mui/x-data-grid-pro";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import type { Certification } from "..";
import { useCertifications } from "../hooks/useCertifications";
import { useCertificationsByCertificationType } from "../hooks/useCertificationsByCertificationType";
import { useDeleteCertification } from "../hooks/useDeleteCertification";

import { PermissionGate, useCan } from "../../../lib/permissions";
import ReusableDataGrid from "../../../components/ui/datagrid/ReusableDataGrid";
import ConfirmDialog from "../../../components/ui/confirm-dialog/ConfirmDialog";
import { RowActions } from "../../../components/ui/datagrid/RowActions";
import { useEmployees } from "../../administration/employees/hooks/useEmployees";
import { dueSoonRowSx } from "../../../components/ui/datagrid/styles/dueSoonRowSx";

type Props = {
  certificationTypeId: number | null;
  groupByEmployee?: boolean;
};

export default function CertificationTable({
  certificationTypeId,
  groupByEmployee = false,
}: Props) {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const can = useCan();

  const all = useCertifications();
  const byType = useCertificationsByCertificationType(certificationTypeId ?? 0);

  const isAll = !certificationTypeId;

  const rows = isAll ? all.certificationsRows : byType.certificationsRows;

  const columns = isAll
    ? all.certificationsColumns
    : byType.certificationsColumns;

  const error = isAll ? all.error : byType.error;
  const isLoading = isAll ? all.isLoading : byType.isLoading;

  const total = isAll ? all.total : rows.length;
  const paginationModel = all.paginationModel;
  const setPaginationModel = all.setPaginationModel;

  const { employeeRows } = useEmployees();

  const employeeNameById = useMemo(() => {
    const map = new Map<number, string>();
    employeeRows.forEach((e: any) => {
      map.set(e.id, `${e.firstName} ${e.lastName}`);
    });
    return map;
  }, [employeeRows]);

  const deleteCertification = useDeleteCertification();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingRow, setPendingRow] = useState<Certification | null>(null);

  const requestDelete = useCallback((row: Certification) => {
    setPendingRow(row);
    setConfirmOpen(true);
  }, []);

  const handleCancel = useCallback(() => {
    if (deleteCertification.isPending) return;
    setConfirmOpen(false);
    setPendingRow(null);
  }, [deleteCertification.isPending]);

  const handleConfirm = useCallback(() => {
    if (!pendingRow) return;
    deleteCertification.mutate((pendingRow as any).id, {
      onSuccess: () => {
        setConfirmOpen(false);
        setPendingRow(null);
      },
    });
  }, [deleteCertification, pendingRow]);

  const columnsWithActions = useMemo<GridColDef<Certification>[]>(() => {
    const base = (columns ?? []).map((c) =>
      c.field === "status" || c.field === "note"
        ? {
            ...c,
            renderCell: (params: any) => (
              <Box
                sx={{ display: "flex", alignItems: "center", height: "100%" }}
              >
                {params.value ?? ""}
              </Box>
            ),
          }
        : c
    );

    const canEdit = can({
      permission: "Permission.Certifications.Update",
    });
    const canDelete = can({
      permission: "Permission.Certifications.Delete",
    });

    if (!(canEdit || canDelete)) return base;
    if (base.some((c) => c.field === "actions")) return base;

    return [
      ...base,
      {
        field: "actions",
        headerName: t("certifications.actions"),
        width: 160,
        sortable: false,
        filterable: false,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => {
          if (params.rowNode?.type === "group") {
            return null;
          }

          return (
            <RowActions
              disabled={deleteCertification.isPending}
              color="#F1B103"
              labels={{
                view: t("certifications.table.detailView"),
                edit: t("certifications.table.edit"),
                delete: t("certifications.table.delete"),
              }}
              onEdit={
                canEdit
                  ? () => navigate(`${(params.row as any).id}/edit`)
                  : undefined
              }
              onDelete={canDelete ? () => requestDelete(params.row) : undefined}
            />
          );
        },
      },
    ];
  }, [columns, can, deleteCertification.isPending, navigate, requestDelete, t]);

  const hasActions = columnsWithActions.some((c) => c.field === "actions");

  const getRowClassName = useCallback(
    (params: GridRowClassNameParams<Certification>) => {
      const raw = (params.row as any)?.nextCertificationDate;
      if (!raw) return "";

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const next = new Date(raw);
      next.setHours(0, 0, 0, 0);

      const diffDays =
        (next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

      return diffDays >= 0 && diffDays <= 14 ? "row--dueSoon" : "";
    },
    []
  );

  if (error) return <div>{t("certifications.list.error")}</div>;

  console.log("columns", columns);

  return (
    <>
      <ReusableDataGrid<Certification>
        key={groupByEmployee ? "tree" : "flat"}
        {...(groupByEmployee
          ? {
              treeData: true,
              getTreeDataPath: (row) => [
                employeeNameById.get((row as any).employeeId) ??
                  t("employees.unknown"),
                t("certifications.tree.certification", {
                  id: (row as any).id,
                }),
              ],
              groupingColDef: {
                headerName: t("employees.employee"),
                width: 260,
              },
              defaultGroupingExpansionDepth: 1,
            }
          : {})}
        storageKey="certifications"
        rows={rows}
        columns={columnsWithActions}
        getRowId={(r) => String((r as any).id)}
        pinnedRightField={hasActions ? "actions" : undefined}
        loading={!!isLoading}
        getRowClassName={getRowClassName}
        sx={dueSoonRowSx(theme)}
        {...(isAll && !groupByEmployee
          ? {
              paginationMode: "server" as const,
              rowCount: total,
              paginationModel,
              onPaginationModelChange: setPaginationModel,
            }
          : {
              paginationMode: "client" as const,
              rowCount: total,
            })}
      />

      <PermissionGate
        guard={{ permission: "Permission.Certifications.Delete" }}
      >
        <ConfirmDialog
          open={confirmOpen}
          title={t("certifications.delete.title")}
          description={t("certifications.delete.description")}
          confirmText={t("certifications.delete.confirm")}
          cancelText={t("certifications.delete.cancel")}
          loading={deleteCertification.isPending}
          disableBackdropClose
          onClose={handleCancel}
          onConfirm={handleConfirm}
        />
      </PermissionGate>
    </>
  );
}
