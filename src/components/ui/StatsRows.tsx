import { Box } from "@mui/material";
import { People, CheckCircle, Cancel, AccessTime } from "@mui/icons-material";
import { StatCard } from "./StatCard";
import { useTranslation } from "react-i18next";

type Filter = "all" | "active" | "inactive" | "expired";

export function StatsRow({
  totals,
  onSelectTotal,
  onSelectActive,
  onSelectInactive,
  onSelectExpired,
  selected,
}: {
  totals: { total: number; active: number; inactive: number; expired: number };
  onSelectTotal: () => void;
  onSelectActive: () => void;
  onSelectInactive: () => void;
  onSelectExpired: () => void;
  selected: Filter;
}) {
  const { t } = useTranslation();

  const itemSx = {
    flexBasis: { xs: "100%", sm: "calc(50% - 8px)", md: "calc(25% - 12px)" },
    flexGrow: 1,
  } as const;

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
      <StatCard
        sx={itemSx}
        label={t("dashboard.root.stats.total")}
        value={totals.total}
        icon={<People color="primary" fontSize="small" />}
        onClick={onSelectTotal}
        selected={selected === "all"}
      />
      <StatCard
        sx={itemSx}
        label={t("dashboard.root.stats.active")}
        value={totals.active}
        icon={<CheckCircle color="primary" fontSize="small" />}
        onClick={onSelectActive}
        selected={selected === "active"}
      />
      <StatCard
        sx={itemSx}
        label={t("dashboard.root.stats.inactive")}
        value={totals.inactive}
        icon={<Cancel color="primary" fontSize="small" />}
        onClick={onSelectInactive}
        selected={selected === "inactive"}
      />
      <StatCard
        sx={itemSx}
        label={t("dashboard.root.stats.expired")}
        value={totals.expired}
        icon={<AccessTime color="primary" fontSize="small" />}
        onClick={onSelectExpired}
        selected={selected === "expired"}
      />
    </Box>
  );
}
