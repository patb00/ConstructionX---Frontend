import {
  Card,
  Divider,
  Stack,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";
import { formatDateRange } from "../utils/dates";
import GroupIcon from "@mui/icons-material/Group";

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
  const count = employees?.length ?? 0;

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <GroupIcon color="primary" fontSize="small" />
          <Typography
            variant="subtitle2"
            fontWeight={600}
            color="text.secondary"
          >
            {t("constructionSites.detail.employees")} ({count})
          </Typography>
        </Stack>

        <IconButton
          size="small"
          onClick={onAdd}
          disableRipple
          sx={{
            p: 0.25,
            color: "primary.main",
            "&:hover": {
              backgroundColor: "transparent",
              opacity: 0.8,
            },
          }}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>

      <Divider sx={{ my: 1 }} />

      <>
        {count ? (
          <Stack spacing={1.5}>
            {employees!.map((e) => {
              const fullName = `${e.firstName} ${e.lastName}`.trim();
              const position = e.jobPositionName || t("common.notAvailable");
              const dateRange = formatDateRange(e.dateFrom, e.dateTo);

              return (
                <Card
                  key={e.id}
                  onClick={() => onRowClick?.(e.id)}
                  sx={{
                    p: 1.5,
                  }}
                >
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{ mb: 0.25 }}
                    noWrap
                  >
                    {fullName}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mb: 0.25 }}
                    noWrap
                  >
                    {position}
                  </Typography>

                  {dateRange && (
                    <Typography
                      variant="caption"
                      color="primary.main"
                      sx={{ display: "block", mt: 0.25 }}
                    >
                      {dateRange}
                    </Typography>
                  )}
                </Card>
              );
            })}
          </Stack>
        ) : (
          <Stack spacing={1.5} sx={{ p: 2, pl: 0 }}>
            <Typography variant="body2" color="text.secondary">
              {t("constructionSites.detail.noEmployees")}
            </Typography>

            <Box
              onClick={onAdd}
              sx={{
                p: 1.5,
                border: "1px dashed",
                borderColor: "primary.main",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <AddIcon fontSize="small" color="primary" />
              <Typography variant="body2">
                {t("constructionSites.detail.addFirstEmployee")}
              </Typography>
            </Box>
          </Stack>
        )}
      </>
    </>
  );
}
