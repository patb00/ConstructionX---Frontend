import { Tab, Tabs, type TabsProps } from "@mui/material";
import type { SyntheticEvent } from "react";

export type PillTabItem = {
  value: string | number;
  label: string;
  props?: object;
};

type PillTabsProps = {
  value: string | number;
  onChange: (event: SyntheticEvent, value: any) => void;
  items: PillTabItem[];
  tabsProps?: Omit<TabsProps, "value" | "onChange">;
};

export const PillTabs = ({
  value,
  onChange,
  items,
  tabsProps,
}: PillTabsProps) => {
  return (
    <Tabs
      value={value}
      onChange={onChange}
      TabIndicatorProps={{ style: { display: "none" } }}
      sx={{
        "& .MuiTabs-flexContainer": { gap: 1 },
        "& .MuiTab-root": {
          textTransform: "none",
          fontWeight: 700,
          borderRadius: 999,
          minHeight: 36,
          px: 2,
          py: 0.5,
          transition: "all 0.2s ease",
        },
        "& .MuiTab-root.Mui-selected": {
          bgcolor: "primary.main",
          color: "#fff",
        },
      }}
      {...tabsProps}
    >
      {items.map((item) => (
        <Tab
          key={item.value}
          value={item.value}
          label={item.label}
          {...item.props}
        />
      ))}
    </Tabs>
  );
};
