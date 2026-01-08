import { Box, Stack, Tab, Tabs, Typography } from "@mui/material";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

import VehicleRegistrationRequestsTab from "./VehicleRegistrationRequestsTab";

type RequestsTabKey = "vehicleRegistration" | "businessTrips";

const TAB_KEYS: RequestsTabKey[] = ["vehicleRegistration", "businessTrips"];

function tabIndexFromKey(key: string | null): number {
  const idx = TAB_KEYS.indexOf((key ?? "") as RequestsTabKey);
  return idx >= 0 ? idx : 0;
}

function tabKeyFromIndex(index: number): RequestsTabKey {
  return TAB_KEYS[index] ?? "vehicleRegistration";
}

export default function RequestsListPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const tabKey = searchParams.get("tab");
  const tab = useMemo(() => tabIndexFromKey(tabKey), [tabKey]);

  const handleTabChange = useCallback(
    (_: React.SyntheticEvent, value: number) => {
      const nextKey = tabKeyFromIndex(value);
      const next = new URLSearchParams(searchParams);
      next.set("tab", nextKey);
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const a11yProps = (index: number) => ({
    id: `requests-tab-${index}`,
    "aria-controls": `requests-tabpanel-${index}`,
  });

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Box>
        <Typography variant="h5" fontWeight={600}>
          {t("myTasks.title")}
        </Typography>

        <Tabs
          value={tab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab
            label={t("myTasks.tabs.vehicleRegistration")}
            {...a11yProps(0)}
          />
        </Tabs>
      </Box>

      {tab === 0 && (
        <Box
          role="tabpanel"
          id="requests-tabpanel-0"
          aria-labelledby="requests-tab-0"
          sx={{ pt: 2 }}
        >
          <VehicleRegistrationRequestsTab />
        </Box>
      )}
    </Stack>
  );
}
