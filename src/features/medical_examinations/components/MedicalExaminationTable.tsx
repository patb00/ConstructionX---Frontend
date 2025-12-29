import { useMemo, useState, useCallback } from "react";
import { alpha, Box, useTheme } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import type { GridRowClassNameParams } from "@mui/x-data-grid-pro";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import type { MedicalExamination } from "..";
import { useMedicalExaminations } from "../hooks/useMedicalExaminations";
import { useMedicalExaminationsByExaminationType } from "../hooks/useMedicalExaminationsByExaminationType";
import { useDeleteMedicalExamination } from "../hooks/useDeleteMedicalExamination";

import { PermissionGate, useCan } from "../../../lib/permissions";
import ReusableDataGrid from "../../../components/ui/datagrid/ReusableDataGrid";
import ConfirmDialog from "../../../components/ui/confirm-dialog/ConfirmDialog";
import { RowActions } from "../../../components/ui/datagrid/RowActions";
import { useEmployees } from "../../administration/employees/hooks/useEmployees";

type Props = {
  examinationTypeId: number | null;
  groupByEmployee?: boolean;
};

export default function MedicalExaminationsTable({
  examinationTypeId,
  groupByEmployee = false,
}: Props) {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const can = useCan();

  const all = useMedicalExaminations();
  const byType = useMedicalExaminationsByExaminationType(
    examinationTypeId ?? 0
  );

  const isAll = !examinationTypeId;

  const rows = isAll
    ? all.medicalExaminationsRows
    : byType.medicalExaminationsRows;

  const columns = isAll
    ? all.medicalExaminationsColumns
    : byType.medicalExaminationsColumns;

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

  const deleteMedicalExamination = useDeleteMedicalExamination();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingRow, setPendingRow] = useState<MedicalExamination | null>(null);

  const requestDelete = useCallback((row: MedicalExamination) => {
    setPendingRow(row);
    setConfirmOpen(true);
  }, []);

  const handleCancel = useCallback(() => {
    if (deleteMedicalExamination.isPending) return;
    setConfirmOpen(false);
    setPendingRow(null);
  }, [deleteMedicalExamination.isPending]);

  const handleConfirm = useCallback(() => {
    if (!pendingRow) return;
    deleteMedicalExamination.mutate((pendingRow as any).id, {
      onSuccess: () => {
        setConfirmOpen(false);
        setPendingRow(null);
      },
    });
  }, [deleteMedicalExamination, pendingRow]);

  const columnsWithActions = useMemo<GridColDef<MedicalExamination>[]>(() => {
    const base = (columns ?? []).map((c) =>
      c.field === "result" || c.field === "note"
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
      permission: "Permission.MedicalExaminations.Update",
    });
    const canDelete = can({
      permission: "Permission.MedicalExaminations.Delete",
    });

    if (!(canEdit || canDelete)) return base;
    if (base.some((c) => c.field === "actions")) return base;

    return [
      ...base,
      {
        field: "actions",
        headerName: t("medicalExaminations.actions"),
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
              disabled={deleteMedicalExamination.isPending}
              color="#F1B103"
              labels={{
                view: t("medicalExaminations.table.detailView"),
                edit: t("medicalExaminations.table.edit"),
                delete: t("medicalExaminations.table.delete"),
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
  }, [
    columns,
    can,
    deleteMedicalExamination.isPending,
    navigate,
    requestDelete,
    t,
  ]);

  const hasActions = columnsWithActions.some((c) => c.field === "actions");

  const getRowClassName = useCallback(
    (params: GridRowClassNameParams<MedicalExamination>) => {
      const raw = (params.row as any)?.nextExaminationDate;
      if (!raw) return "";

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const next = new Date(raw);
      next.setHours(0, 0, 0, 0);

      const diffDays =
        (next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

      return diffDays <= 0 && diffDays >= -14 ? "row--dueSoon" : "";
    },
    []
  );

  const dueSoonRowSx = {
    "& .MuiDataGrid-row.row--dueSoon": {
      backgroundColor: alpha(theme.palette.error.main, 0.12),
    },
  };

  if (error) return <div>{t("medicalExaminations.list.error")}</div>;

  return (
    <>
      <ReusableDataGrid<MedicalExamination>
        key={groupByEmployee ? "tree" : "flat"}
        {...(groupByEmployee
          ? {
              treeData: true,
              getTreeDataPath: (row) => [
                employeeNameById.get((row as any).employeeId) ??
                  t("employees.unknown"),
                t("medicalExaminations.tree.exam", {
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
        storageKey="medical_examinations"
        rows={rows}
        columns={columnsWithActions}
        getRowId={(r) => String((r as any).id)}
        pinnedRightField={hasActions ? "actions" : undefined}
        loading={!!isLoading}
        getRowClassName={getRowClassName}
        sx={dueSoonRowSx}
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
        guard={{ permission: "Permission.MedicalExaminations.Delete" }}
      >
        <ConfirmDialog
          open={confirmOpen}
          title={t("medicalExaminations.delete.title")}
          description={t("medicalExaminations.delete.description")}
          confirmText={t("medicalExaminations.delete.confirm")}
          cancelText={t("medicalExaminations.delete.cancel")}
          loading={deleteMedicalExamination.isPending}
          disableBackdropClose
          onClose={handleCancel}
          onConfirm={handleConfirm}
        />
      </PermissionGate>
    </>
  );
}
