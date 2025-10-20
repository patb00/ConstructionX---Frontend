import {
  Card,
  CardHeader,
  Divider,
  Stack,
  Typography,
  Box,
} from "@mui/material";

import { useTranslation } from "react-i18next";
import Row from "../../../components/ui/Row";
import { formatDateRange } from "../utils/dates";

type Employee = {
  id: number;
  firstName: string;
  lastName: string;
  jobPositionName?: string | null;
  dateFrom?: string | null;
  dateTo?: string | null;
};
export default function EmployeesSection({
  employees,
  onAdd,
  onRowClick,
}: {
  employees?: Employee[];
  onAdd: () => void;
  onRowClick?: (id: number) => void;
}) {
  const { t } = useTranslation();
  return (
    <Card elevation={3} sx={{ flexBasis: { md: "50%" }, flexGrow: 1, p: 2 }}>
      <CardHeader
        titleTypographyProps={{ variant: "subtitle1", fontWeight: 600 }}
        title={t("constructionSites.detail.employees", {
          defaultValue: "Zaposlenici",
        })}
        sx={{ p: 0, mb: 1 }}
      />
      <Divider />
      <Box sx={{ maxHeight: 260, overflow: "auto", pt: 1 }}>
        {employees?.length ? (
          <Stack divider={<Divider flexItem />} sx={{ "& > *": { px: 0.5 } }}>
            {employees.map((e) => (
              <Row
                key={e.id}
                left={`${e.firstName} ${e.lastName}`}
                sub={
                  e.jobPositionName ||
                  t("common.notAvailable", {
                    defaultValue: "Nije definirano radno mjesto",
                  })
                }
                right={
                  <Typography variant="caption" color="primary.main">
                    {formatDateRange(e.dateFrom, e.dateTo)}
                  </Typography>
                }
                onClick={() => onRowClick?.(e.id)}
              />
            ))}
            <Row
              addRow
              left={t("constructionSites.detail.addEmployee", {
                defaultValue: "Dodaj zaposlenika",
              })}
              onClick={onAdd}
            />
          </Stack>
        ) : (
          <Stack spacing={1.5} sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {t("constructionSites.detail.noEmployees", {
                defaultValue: "Nema dodijeljenih zaposlenika.",
              })}
            </Typography>
            <Row
              addRow
              left={t("constructionSites.detail.addFirstEmployee", {
                defaultValue: "Dodaj prvog zaposlenika",
              })}
              onClick={onAdd}
            />
          </Stack>
        )}
      </Box>
    </Card>
  );
}
