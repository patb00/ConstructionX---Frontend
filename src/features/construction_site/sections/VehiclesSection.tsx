import {
  Card,
  Chip,
  Divider,
  Stack,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";
import { formatDateRange } from "../utils/dates";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";

type Vehicle = {
  id: number;
  name?: string | null;
  brand?: string | null;
  model?: string | null;
  registrationNumber?: string | null;
  status?: string | null;
  condition?: string | null;
  dateFrom?: string | null;
  dateTo?: string | null;
  responsibleEmployeeName?: string | null;
};

export default function VehiclesSection({
  vehicles,
  onAdd,
  onRowClick,
}: {
  vehicles?: Vehicle[];
  onAdd: () => void;
  onRowClick?: (id: number) => void;
}) {
  const { t } = useTranslation();
  const count = vehicles?.length ?? 0;

  return (
    <>
      {/* Header: "Vehicles (N)  +" */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <DirectionsCarIcon color="primary" fontSize="small" />
          <Typography
            variant="subtitle2"
            fontWeight={600}
            color="text.secondary"
          >
            {t("constructionSites.detail.vehicles")} ({count})
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

      {count ? (
        <Stack spacing={1.5}>
          {vehicles!.map((v) => {
            const title =
              v.name ||
              `${v.brand ?? ""} ${v.model ?? ""}`.trim() ||
              v.registrationNumber ||
              "—";

            const meta =
              [
                v.registrationNumber &&
                  `${t("constructionSites.detail.vehicle.registration")}: ${
                    v.registrationNumber
                  }`,
                v.brand &&
                  v.model &&
                  `${t("constructionSites.detail.vehicle.model")}: ${v.brand} ${
                    v.model
                  }`,
              ]
                .filter(Boolean)
                .join(" · ") || "—";

            const dateRange = formatDateRange(v.dateFrom, v.dateTo);

            return (
              <Card
                key={v.id}
                onClick={() => onRowClick?.(v.id)}
                sx={{
                  p: 1.5,
                  cursor: onRowClick ? "pointer" : "default",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 0.5,
                    gap: 1,
                  }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      noWrap
                      sx={{ mb: 0.25 }}
                    >
                      {title}
                    </Typography>

                    {v.responsibleEmployeeName && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        noWrap
                      >
                        {v.responsibleEmployeeName}
                      </Typography>
                    )}
                  </Box>

                  {(v.condition || v.status) && (
                    <Stack direction="row" spacing={0.5}>
                      {v.status && (
                        <Chip
                          size="small"
                          variant="outlined"
                          label={v.status}
                        />
                      )}
                      {v.condition && <Chip size="small" label={v.condition} />}
                    </Stack>
                  )}
                </Box>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mb: 0.25 }}
                  noWrap
                >
                  {meta}
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
            {t("constructionSites.detail.noVehicles")}
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
              {t("constructionSites.detail.addFirstVehicle")}
            </Typography>
          </Box>
        </Stack>
      )}
    </>
  );
}
