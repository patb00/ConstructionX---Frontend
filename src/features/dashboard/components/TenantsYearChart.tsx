import { Card, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { BarChart } from "@mui/x-charts/BarChart";

type Row = {
  month: string;
  total: number;
  active: number;
  inactive: number;
  expired: number;
};

type Filter = "all" | "active" | "inactive" | "expired";

export function TenantsYearChart({
  dataset,
  currentYear,
  filter = "all",
}: {
  dataset: Row[];
  currentYear: number;
  filter?: Filter;
}) {
  const theme = useTheme();

  const fullSeries = [
    //{ dataKey: "total", label: "Ukupno", color: theme.palette.grey[500] },
    { dataKey: "active", label: "Aktivni", color: theme.palette.success.main },
    {
      dataKey: "inactive",
      label: "Neaktivni",
      color: theme.palette.warning.main,
    },
    { dataKey: "expired", label: "Istekli", color: theme.palette.error.main },
  ] as const;

  const series =
    filter === "active"
      ? fullSeries.filter((s) => s.dataKey === "active")
      : filter === "inactive"
      ? fullSeries.filter((s) => s.dataKey === "inactive")
      : filter === "expired"
      ? fullSeries.filter((s) => s.dataKey === "expired")
      : fullSeries;

  return (
    <Card elevation={3} sx={{ mt: 2, p: 2 }}>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Status tenanata po mjesecima ({currentYear})
      </Typography>
      <BarChart
        dataset={dataset}
        xAxis={[{ dataKey: "month" }]}
        series={series as any}
        yAxis={[{ min: 0, label: "Broj tenanata" }]}
        margin={{ left: 60, right: 20, top: 20, bottom: 40 }}
      />
    </Card>
  );
}
