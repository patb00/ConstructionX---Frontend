import { Button, Paper, Stack, Typography } from "@mui/material";
import ToolForm from "./ToolForm";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useToolCategories } from "../../tools_category/hooks/useToolCategories";
import { useAddTool } from "../hooks/useAddTool";
import { useEmployees } from "../../administration/employees/hooks/useEmployees";
import { useToolStatuses } from "../constants/hooks/useToolStatuses";
import { useToolConditions } from "../constants/hooks/useToolConditions";

export default function ToolCreatePage() {
  const { t } = useTranslation();
  const { mutateAsync, isPending } = useAddTool();
  const navigate = useNavigate();

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

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("tools.create.title")}
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/tools")}
          sx={{ color: "primary.main" }}
        >
          {t("tools.create.back")}
        </Button>
      </Stack>
      <Paper
        elevation={0}
        sx={{
          border: (t) => `1px solid ${t.palette.divider}`,
          height: "100%",
          width: "100%",
          p: 2,
        }}
      >
        <ToolForm
          onSubmit={mutateAsync}
          busy={
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
