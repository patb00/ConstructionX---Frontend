import * as React from "react";
import {
  Box,
  Collapse,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  type SxProps,
  type Theme,
} from "@mui/material";
import { ChevronRightRounded, ExpandMoreRounded } from "@mui/icons-material";
import type { ChipProps } from "@mui/material/Chip";
import type { SystemStyleObject } from "@mui/system";

export const listViewColDividerSx: SystemStyleObject<Theme> = {
  borderRight: "1px solid",
  borderColor: "divider",
};

export const listViewBodyCellSx: SystemStyleObject<Theme> = {
  py: 1.35,
  verticalAlign: "middle",
};

export const listViewChipSx: SystemStyleObject<Theme> = {
  height: 24,
  borderRadius: 1,
  fontWeight: 600,
  bgcolor: "grey.50",
  border: "1px solid",
  borderColor: "divider",
  "& .MuiChip-label": { px: 1 },
};

export type ListViewStatusTag = {
  label: string;
  color: ChipProps["color"];
};

export type ListViewSection<T> = {
  key: string;
  title: string;
  items: T[];
};

export type ListViewColumn<T> = {
  key: string;
  header: React.ReactNode;

  width?: number | string;
  align?: "left" | "center" | "right";
  padding?: "normal" | "checkbox" | "none";

  headSx?: SxProps<Theme>;
  cellSx?: SxProps<Theme>;
  render?: (row: T) => React.ReactNode;
};

export type ListViewProps<T> = {
  sections: Array<ListViewSection<T>>;
  openByKey?: Record<string, boolean>;
  onToggleSection?: (key: string) => void;
  getRowKey: (row: T) => string;
  renderRow?: (row: T) => React.ReactNode;
  columns: Array<ListViewColumn<T>>;
  renderSectionEndAdornment?: (section: ListViewSection<T>) => React.ReactNode;

  sx?: SxProps<Theme>;
  sectionHeaderSx?: SxProps<Theme>;
  tableSx?: SxProps<Theme>;
  containerSx?: SxProps<Theme>;
};

const headCellBaseSx: SxProps<Theme> = {
  fontSize: 12,
  fontWeight: 700,
  color: "text.secondary",
  bgcolor: "background.paper",
  whiteSpace: "nowrap",
  py: 1.25,
};

export default function ListView<T>({
  sections,
  openByKey,
  onToggleSection,
  getRowKey,
  renderRow,
  columns,
  renderSectionEndAdornment,
  sx,
  sectionHeaderSx,
  tableSx,
  containerSx,
}: ListViewProps<T>) {
  const [internalOpen, setInternalOpen] = React.useState<
    Record<string, boolean>
  >({});

  React.useEffect(() => {
    if (openByKey) return;

    setInternalOpen((prev) => {
      const next = { ...prev };
      let changed = false;

      for (const s of sections) {
        if (next[s.key] === undefined) {
          next[s.key] = true;
          changed = true;
        }
      }

      for (const key of Object.keys(next)) {
        if (!sections.some((s) => s.key === key)) {
          delete next[key];
          changed = true;
        }
      }

      return changed ? next : prev;
    });
  }, [openByKey, sections]);

  const isControlled = Boolean(openByKey);

  const getOpen = React.useCallback(
    (key: string) =>
      isControlled ? openByKey?.[key] ?? true : internalOpen[key] ?? true,
    [internalOpen, isControlled, openByKey]
  );

  const toggle = React.useCallback(
    (key: string) => {
      if (isControlled) {
        onToggleSection?.(key);
        return;
      }
      setInternalOpen((prev) => ({ ...prev, [key]: !(prev[key] ?? true) }));
    },
    [isControlled, onToggleSection]
  );

  return (
    <Stack spacing={2} sx={{ width: "100%", ...sx }}>
      {sections.map((section) => {
        const open = getOpen(section.key);

        return (
          <Box key={section.key} sx={{ width: "100%" }}>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 1.25,
                py: 1,
                borderRadius: 2,
                bgcolor: "#F4F6FF",
                color: "#6F7295",
                ...sectionHeaderSx,
              }}
            >
              <IconButton
                size="small"
                onClick={() => toggle(section.key)}
                sx={{ width: 28, height: 28, borderRadius: 1 }}
              >
                {open ? <ExpandMoreRounded /> : <ChevronRightRounded />}
              </IconButton>

              <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
                {section.title}
              </Typography>

              <Box
                sx={{
                  height: 18,
                  minWidth: 18,
                  px: 0.5,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 0.75,
                  fontSize: 12,
                  fontWeight: 700,
                  lineHeight: 1,
                  bgcolor: "#EEF0FF",
                  color: "#6F7295",
                  border: "1px solid",
                  borderColor: "#D9DCF5",
                }}
              >
                {section.items.length}
              </Box>

              <Box sx={{ ml: "auto" }}>
                {renderSectionEndAdornment?.(section)}
              </Box>
            </Box>

            <Box
              sx={{
                mt: 1,
                borderColor: "divider",
                borderRadius: 1,
                overflow: "hidden",
                bgcolor: "background.paper",
                ...containerSx,
              }}
            >
              <Collapse in={open} timeout={160} unmountOnExit={false}>
                <Table
                  size="small"
                  stickyHeader
                  sx={{
                    width: "100%",
                    borderCollapse: "separate",
                    borderSpacing: 0,
                    bgcolor: "background.paper",
                    "& .MuiTableCell-root": {
                      borderBottom: "1px solid",
                      borderColor: "divider",
                    },
                    "& .MuiTableBody-root .MuiTableRow-root:last-of-type .MuiTableCell-root":
                      { borderBottom: "none" },
                    ...tableSx,
                  }}
                >
                  <TableHead>
                    <TableRow>
                      {columns.map((c) => (
                        <TableCell
                          key={c.key}
                          align={c.align}
                          padding={c.padding}
                          sx={{
                            ...headCellBaseSx,
                            ...(c.width ? { width: c.width } : null),
                            ...(c.headSx as any),
                          }}
                        >
                          {c.header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {section.items.map((row) => {
                      const key = getRowKey(row);

                      if (renderRow) {
                        return (
                          <React.Fragment key={key}>
                            {renderRow(row)}
                          </React.Fragment>
                        );
                      }

                      return (
                        <TableRow key={key} hover>
                          {columns.map((c) => (
                            <TableCell
                              key={c.key}
                              align={c.align}
                              padding={c.padding}
                              sx={c.cellSx}
                            >
                              {c.render ? c.render(row) : null}
                            </TableCell>
                          ))}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Collapse>
            </Box>
          </Box>
        );
      })}
    </Stack>
  );
}
