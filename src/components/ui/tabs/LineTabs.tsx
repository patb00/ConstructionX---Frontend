import { Tab, Tabs, type TabsProps } from "@mui/material";
import type { SyntheticEvent } from "react";

export type LineTabItem = {
  value: string | number;
  label: string;
  props?: object;
};

type LineTabsProps = {
  value: string | number;
  onChange: (event: SyntheticEvent, value: any) => void;
  items: LineTabItem[];
  tabsProps?: Omit<TabsProps, "value" | "onChange">;
};

export const LineTabs = ({
  value,
  onChange,
  items,
  tabsProps,
}: LineTabsProps) => {
  return (
    <Tabs
      value={value}
      onChange={onChange}
      sx={{
        minHeight: 48,
        "& .MuiTabs-flexContainer": { gap: 3 },
        "& .MuiTabs-indicator": {
          height: 3,
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
          backgroundColor: "primary.main",
        },
        "& .MuiTab-root": {
          textTransform: "none",
          fontWeight: 600,
          fontSize: 14,
          minHeight: 48,
          minWidth: "auto",
          px: 0.5,
          color: "text.secondary",
          "&:hover": {
            color: "primary.main",
            opacity: 1,
          },
          "&.Mui-selected": {
            color: "primary.main",
          },
        },
      }}
      variant="scrollable"
      scrollButtons="auto"
      allowScrollButtonsMobile
      {...tabsProps}
    >
      {items.map((item) => (
        <Tab
          key={item.value}
          value={item.value}
          label={item.label}
          disableRipple
          {...item.props}
        />
      ))}
    </Tabs>
  );
};
