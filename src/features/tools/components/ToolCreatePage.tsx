import { Button, Paper, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import ToolForm from "./ToolForm";
import { useToolCategories } from "../../tools_category/hooks/useToolCategories";
import { useAddTool } from "../hooks/useAddTool";
import { useEmployees } from "../../administration/employees/hooks/useEmployees";
import { useToolStatuses } from "../constants/hooks/useToolStatuses";
import { useToolConditions } from "../constants/hooks/useToolConditions";

import {
  toCategoryOptions,
  toEmployeeOptions,
  toStringEnumOptions,
} from "../utils/options";

export default function ToolCreatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { mutateAsync, isPending: creating } = useAddTool();

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

  const busy =
    creating ||
    categoriesLoading ||
    employeesLoading ||
    statusesLoading ||
    conditionsLoading;

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
