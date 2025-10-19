import { Paper, Stack, Typography, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import ToolForm from "./ToolForm";
import { useTranslation } from "react-i18next";
import { useUpdateTool } from "../hooks/useUpdateTool";
import { useTool } from "../hooks/useTool";
import { useToolCategories } from "../../tools_category/hooks/useToolCategories";
import { useEmployees } from "../../administration/employees/hooks/useEmployees";
import type { NewToolRequest } from "..";
import { useToolStatuses } from "../constants/hooks/useToolStatuses";
import { useToolConditions } from "../constants/hooks/useToolConditions";

export default function ToolEditPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const toolId = Number(id);
  if (!Number.isFinite(toolId))
    return <div>{t("tools.edit.invalidUrlId")}</div>;

  const navigate = useNavigate();
  const { data: tool, isLoading: toolLoading, error } = useTool(toolId);
  const { mutate: updateTool, isPending } = useUpdateTool();

  const { toolCategoriesRows = [], isLoading: categoriesLoading } =
    useToolCategories();
  const categoryOptions = (toolCategoriesRows ?? []).map((c: any) => ({
    value: c.id,
    label: c.name,
  }));

  const { employeeRows = [], isLoading: employeesLoading } = useEmployees();
  const employeeOptions = [
    { value: null, label: t("tools.form.responsible.none") },
    ...(employeeRows ?? []).map((e: any) => ({
      value: e.id,
      label: `${e.firstName ?? ""} ${e.lastName ?? ""}`.trim(),
    })),
  ];

  const { data: statuses = [], isLoading: statusesLoading } = useToolStatuses();
  const { data: conditions = [], isLoading: conditionsLoading } =
    useToolConditions();
  const toOptions = (items: string[]) =>
    items.map((x) => ({ label: x, value: x }));

  const defaultValues: NewToolRequest | undefined = tool && {
    name: tool.name ?? "",
    inventoryNumber: tool.inventoryNumber ?? null,
    serialNumber: tool.serialNumber ?? null,
    manufacturer: tool.manufacturer ?? null,
    model: tool.model ?? null,
    purchaseDate: tool.purchaseDate ?? "",
    purchasePrice: tool.purchasePrice ?? 0,
    status: tool.status ?? null,
    condition: tool.condition ?? null,
    description: tool.description ?? null,
    toolCategoryId: tool.toolCategoryId ?? categoryOptions?.[0]?.value ?? 0,
    responsibleEmployeeId: tool.responsibleEmployeeId ?? null,
  };

  const handleSubmit = (values: NewToolRequest) => {
    const idForUpdate = typeof tool?.id === "number" ? tool.id : toolId;
    updateTool({ id: idForUpdate, ...values } as any, {
      onSuccess: () => navigate("/app/tools"),
    });
  };

  if (error) return <div>{t("tools.edit.loadError")}</div>;

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
          busy={
            toolLoading ||
            isPending ||
            categoriesLoading ||
            employeesLoading ||
            statusesLoading ||
            conditionsLoading
          }
          categoryOptions={categoryOptions}
          employeeOptions={employeeOptions}
          statusOptions={toOptions(statuses)}
          conditionOptions={toOptions(conditions)}
        />
      </Paper>
    </Stack>
  );
}
