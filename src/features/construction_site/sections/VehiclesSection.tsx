import {
  Card,
  CardHeader,
  Chip,
  Divider,
  Stack,
  Typography,
  Box,
} from "@mui/material";

import { useTranslation } from "react-i18next";
import Row from "../../../components/ui/Row";
import { formatDateRange } from "../utils/dates";

type Vehicle = {
  id: number;
  name?: string | null;
  registrationNumber?: string | null;
  brand?: string | null;
  model?: string | null;
  vin?: string | null;
  vehicleType?: string | null;
  status?: string | null;
  condition?: string | null;
  yearOfManufacturing?: number | null;
  horsePower?: number | null;
  weight?: number | null;
  averageConsumption?: number | null;
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
  return (
    <Card elevation={3} sx={{ mt: 2, p: 2 }}>
      <CardHeader
        titleTypographyProps={{ variant: "subtitle1", fontWeight: 600 }}
        title={t("constructionSites.detail.vehicles", {
          defaultValue: "Vozila",
        })}
        sx={{ p: 0, mb: 1 }}
      />
      <Divider />
      <Box sx={{ maxHeight: 260, overflow: "auto", pt: 1 }}>
        {vehicles?.length ? (
          <Stack divider={<Divider flexItem />} sx={{ "& > *": { px: 0.5 } }}>
            {vehicles.map((v) => (
              <Row
                key={v.id}
                left={
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ flexWrap: "wrap", rowGap: 0.5 }}
                  >
                    <Typography variant="body2" fontWeight={600} noWrap>
                      {v.name || "—"}
                    </Typography>
                    {v.responsibleEmployeeName && (
                      <Chip
                        size="small"
                        variant="outlined"
                        label={v.responsibleEmployeeName}
                      />
                    )}
                    {v.status && (
                      <Chip size="small" variant="outlined" label={v.status} />
                    )}
                    {v.condition && <Chip size="small" label={v.condition} />}
                    {v.vehicleType && (
                      <Chip
                        size="small"
                        variant="outlined"
                        label={v.vehicleType}
                      />
                    )}
                  </Stack>
                }
                sub={
                  [
                    v.registrationNumber && `Reg.: ${v.registrationNumber}`,
                    (v.brand || v.model) &&
                      `Vozilo: ${[v.brand, v.model].filter(Boolean).join(" ")}`,
                    v.vin && `VIN: ${v.vin}`,
                    v.yearOfManufacturing && `God.: ${v.yearOfManufacturing}`,
                    v.horsePower && `Snaga: ${v.horsePower} KS`,
                    v.weight && `Težina: ${v.weight} kg`,
                    v.averageConsumption &&
                      `Potrošnja: ${v.averageConsumption} L/100km`,
                  ]
                    .filter(Boolean)
                    .join(" · ") || "—"
                }
                right={
                  <Typography variant="caption" color="primary.main">
                    {formatDateRange(v.dateFrom, v.dateTo)}
                  </Typography>
                }
                onClick={() => onRowClick?.(v.id)}
              />
            ))}
            <Row
              addRow
              left={t("constructionSites.detail.addVehicle", {
                defaultValue: "Dodaj vozilo",
              })}
              onClick={onAdd}
            />
          </Stack>
        ) : (
          <Stack spacing={1.5} sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {t("constructionSites.detail.noVehicles", {
                defaultValue: "Nema dodijeljenih vozila.",
              })}
            </Typography>
            <Row
              addRow
              left={t("constructionSites.detail.addFirstVehicle", {
                defaultValue: "Dodaj prvo vozilo",
              })}
              onClick={onAdd}
            />
          </Stack>
        )}
      </Box>
    </Card>
  );
}
