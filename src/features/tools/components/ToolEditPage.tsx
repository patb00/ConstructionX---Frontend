import { Paper, Stack, Typography, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import ToolForm from "./ToolForm";
import type { NewToolRequest } from "..";
import { useUpdateTool } from "../hooks/useUpdateTool";
import { useTool } from "../hooks/useTool";
import { useToolCategories } from "../../tools_category/hooks/useToolCategories";
import { useEmployees } from "../../administration/employees/hooks/useEmployees";
import { useToolStatuses } from "../constants/hooks/useToolStatuses";
import { useToolConditions } from "../constants/hooks/useToolConditions";

import {
  toCategoryOptions,
  toEmployeeOptions,
  toStringEnumOptions,
} from "../utils/options";
import { toolToDefaultValues } from "../utils/toolForm";

export default function ToolEditPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const toolId = Number(id);

  if (!Number.isFinite(toolId))
    return <div>{t("tools.edit.invalidUrlId")}</div>;

  const navigate = useNavigate();

  const { data: tool, isLoading: toolLoading, error } = useTool(toolId);
  const { mutate: updateTool, isPending: updating } = useUpdateTool();

  const { toolCategoriesRows = [], isLoading: categoriesLoading } =
    useToolCategories();
  const categoryOptions = toCategoryOptions(toolCategoriesRows);

  const { employeeRows = [], isLoading: employeesLoading } = useEmployees();
  const employeeOptions = toEmployeeOptions(employeeRows, [
    { value: null, label: t("tools.form.responsible.none") },
  ]);

  const { data: statuses = [], isLoading: statusesLoading } = useToolStatuses();
  const { data: conditions = [], isLoading: conditionsLoading } =
    useToolConditions();

  const fallbackCategoryId = categoryOptions?.[0]?.value ?? 0;
  const defaultValues: NewToolRequest | undefined = toolToDefaultValues(
    tool,
    fallbackCategoryId
  ) as any;

  const handleSubmit = (values: NewToolRequest) => {
    const idForUpdate =
      typeof (tool as any)?.id === "number" ? (tool as any).id : toolId;

    updateTool({ id: idForUpdate, ...values } as any, {
      onSuccess: () => navigate("/app/tools"),
    });
  };

  if (error) return <div>{t("tools.edit.loadError")}</div>;

  const busy =
    toolLoading ||
    updating ||
    categoriesLoading ||
    employeesLoading ||
    statusesLoading ||
    conditionsLoading;

  return (
    <Stack spacing={2}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Typography variant="h5" fontWeight={600}>
          {t("tools.edit.title")}
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/tools")}
          sx={{ color: "primary.main" }}
        >
          {t("tools.edit.back")}
        </Button>
      </Stack>

      <Paper
        elevation={0}
        sx={{ border: (t) => `1px solid ${t.palette.divider}`, p: 2 }}
      >
        <ToolForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          busy={busy}
          categoryOptions={categoryOptions}
          employeeOptions={employeeOptions}
          statusOptions={toStringEnumOptions(statuses)}
          conditionOptions={toStringEnumOptions(conditions)}
        />
      </Paper>
    </Stack>
  );
}
