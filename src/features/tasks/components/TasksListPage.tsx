import { Box, Stack, Typography } from "@mui/material";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

import VehicleRegistrationRequestsTab from "./VehicleRegistrationTasksTab";
import {
  tabIndexFromKey,
  tabKeyFromIndex,
} from "../utils/tabs";
import { LineTabs } from "../../../components/ui/tabs/LineTabs";

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
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <Box>
            <Typography variant="h5" fontWeight={600}>
            {t("myTasks.title")}
            </Typography>

            <LineTabs
            value={tab}
            onChange={(e, v) => handleTabChange(e, v)}
            items={[
                {
                value: 0,
                label: t("myTasks.tabs.vehicleRegistration"),
                props: a11yProps(0),
                },
            ]}
            />
        </Box>
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
