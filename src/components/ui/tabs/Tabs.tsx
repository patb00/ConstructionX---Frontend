import * as React from "react";
import {
  Box,
  Tabs as MuiTabs,
  Tab,
  type SxProps,
  type Theme,
} from "@mui/material";

export type ProductiveTabItem<T extends string | number> = {
  value: T;
  label: React.ReactNode;
  disabled?: boolean;
};

type Props<T extends string | number> = {
  value: T;
  onChange: (value: T) => void;
  items: ProductiveTabItem<T>[];
  ariaLabel?: string;
  sx?: SxProps<Theme>;
  tabsSx?: SxProps<Theme>;
};

export function Tabs<T extends string | number>({
  value,
  onChange,
  items,
  ariaLabel,
  sx,
  tabsSx,
}: Props<T>) {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 999,
        p: 0.5,
        backgroundColor: (t) =>
          t.palette.mode === "dark"
            ? "rgba(255,255,255,0.04)"
            : "rgba(0,0,0,0.02)",
        overflow: "hidden",
        ...sx,
      }}
    >
      <MuiTabs
        value={value}
        onChange={(_e, v) => onChange(v)}
        variant="scrollable"
        scrollButtons="auto"
        aria-label={ariaLabel}
        TabIndicatorProps={{ style: { display: "none" } }}
        allowScrollButtonsMobile
        sx={{
          minHeight: 40,
          "& .MuiTabs-flexContainer": { gap: 1 },
          "& .MuiTabs-scrollButtons": { borderRadius: 999 },
          ...tabsSx,
        }}
      >
        {items.map((it) => (
          <Tab
            key={String(it.value)}
            value={it.value}
            label={it.label}
            disabled={it.disabled}
            disableRipple
            sx={{
              textTransform: "none",
              fontWeight: 600,
              fontSize: 13,
              minHeight: 40,
              height: 40,
              minWidth: 80,
              px: 1.5,
              borderRadius: 999,
              color: "text.secondary",
              transition: "all 160ms ease",

              "&:hover": {
                backgroundColor: (t) =>
                  t.palette.mode === "dark"
                    ? `rgba(${t.palette.primary.main}, 0.12)`
                    : t.palette.primary.main + "14",
                color: "primary.main",
              },

              "&.Mui-selected": {
                color: "primary.main",
                backgroundColor: (t) =>
                  t.palette.mode === "dark"
                    ? `rgba(255,255,255,0.08)`
                    : t.palette.primary.main + "1F",
                boxShadow: (t) => `0 0 0 1px ${t.palette.primary.main}33 inset`,
              },

              "&.Mui-disabled": {
                opacity: 0.45,
              },

              "&:focus-visible": {
                outline: "2px solid",
                outlineColor: "primary.main",
                outlineOffset: 2,
              },
            }}
          />
        ))}
      </MuiTabs>
    </Box>
  );
}
