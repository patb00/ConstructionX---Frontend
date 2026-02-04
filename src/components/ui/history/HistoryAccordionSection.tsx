import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Typography,
  CircularProgress,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import type { ReactNode } from "react";
import { useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import { pillSx } from "./HistoryPanelShell";

type Props = {
  icon: ReactNode;
  label: string;
  count: number;

  defaultExpanded?: boolean;

  isLoading?: boolean;
  isError?: boolean;
  errorText?: string;
  emptyText?: string;

  children?: ReactNode;
};

export function HistoryAccordionSection({
  icon,
  label,
  count,
  defaultExpanded = false,
  isLoading,
  isError,
  errorText = "Failed to load.",
  emptyText = "No items.",
  children,
}: Props) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(defaultExpanded);

  const isEmpty = !isLoading && !isError && count === 0;

  return (
    <Accordion
      expanded={expanded}
      onChange={() => setExpanded((p) => !p)}
      disableGutters
      elevation={0}
      sx={{
        bgcolor: "transparent",
        "&:before": { display: "none" },
      }}
    >
      <AccordionSummary
        sx={{
          px: 0,
          py: 0,
          minHeight: 0,
          cursor: "pointer",
          "& .MuiAccordionSummary-content": {
            my: 0,
            alignItems: "center",
            gap: 1,
          },
        }}
      >
        <Box
          onClick={(e) => {
            e.stopPropagation();
            setExpanded((p) => !p);
          }}
          sx={{
            width: 24,
            height: 24,
            borderRadius: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: alpha(theme.palette.primary.main, 0.08),
            color: "text.secondary",
            flexShrink: 0,
          }}
        >
          {expanded ? (
            <RemoveIcon sx={{ fontSize: 16 }} />
          ) : (
            <AddIcon sx={{ fontSize: 16 }} />
          )}
        </Box>

        <Box sx={{ color: "text.secondary", display: "flex" }}>{icon}</Box>

        <Typography
          variant="caption"
          sx={{
            textTransform: "uppercase",
            letterSpacing: 0.6,
            color: "text.secondary",
            fontWeight: 600,
          }}
        >
          {label}
        </Typography>

        <Chip
          size="small"
          label={count}
          sx={{
            ...pillSx,
            ml: "auto",
            bgcolor: alpha(theme.palette.primary.main, 0.06),
            fontWeight: 600,
          }}
        />
      </AccordionSummary>

      <AccordionDetails sx={{ px: 0, pt: 1, pb: 0 }}>
        {isLoading ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CircularProgress size={18} />
            <Typography variant="body2" color="text.secondary">
              Loading…
            </Typography>
          </Box>
        ) : isError ? (
          <Typography variant="body2" color="error">
            {errorText}
          </Typography>
        ) : isEmpty ? (
          <Typography variant="body2" color="text.secondary">
            {emptyText}
          </Typography>
        ) : (
          children
        )}
      </AccordionDetails>
    </Accordion>
  );
}
