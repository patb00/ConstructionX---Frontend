import { Box, Chip, Stack, Typography } from "@mui/material";

import type { VehicleRegistrationEmployee } from "../..";
import { RowActions } from "../../../../components/ui/datagrid/RowActions";
import type { KanbanColumn } from "./types";

type KanbanViewProps = {
  columns: KanbanColumn[];
  onChangeStatus: (task: VehicleRegistrationEmployee) => void;
  isUpdating: boolean;
  changeStatusLabel: string;
};

const KanbanView = ({
  columns,
  onChangeStatus,
  isUpdating,
  changeStatusLabel,
}: KanbanViewProps) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
      gap: 2,
      alignItems: "start",
    }}
  >
    {columns.map((column) => (
      <Stack
        key={column.key}
        spacing={1.5}
        sx={{
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          px: 1.5,
          py: 1.5,
          minHeight: 280,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="subtitle2" fontWeight={700}>
            {column.title}
          </Typography>
          <Chip
            size="small"
            label={column.items.length}
            sx={{ bgcolor: "action.hover" }}
          />
        </Stack>

        <Stack spacing={1.5}>
          {column.items.map((item) => (
            <Box
              key={String(item.task.id)}
              sx={{
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.default",
                p: 1.25,
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Stack spacing={0.25}>
                <Typography variant="body2" fontWeight={600} noWrap>
                  {item.title}
                </Typography>
                {item.subtitle ? (
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {item.subtitle}
                  </Typography>
                ) : null}
              </Stack>

              <Stack direction="row" spacing={0.75} flexWrap="wrap">
                <Chip
                  size="small"
                  label={item.statusTag.label}
                  color={item.statusTag.color}
                  variant="outlined"
                />
                {item.regNumber ? (
                  <Chip size="small" label={item.regNumber} variant="outlined" />
                ) : null}
              </Stack>

              <Stack direction="row" alignItems="center" spacing={0.75}>
                <Typography variant="caption" color="text.secondary">
                  {item.deadline || "No deadline"}
                </Typography>
                <Chip
                  size="small"
                  label={item.projectName}
                  variant="outlined"
                />
                {!item.isCompleted ? (
                  <Box sx={{ ml: "auto" }}>
                    <RowActions
                      disabled={item.disabled || isUpdating}
                      onChangeStatus={() => onChangeStatus(item.task)}
                      labels={{ status: changeStatusLabel }}
                      buttonProps={{ size: "small" }}
                    />
                  </Box>
                ) : null}
              </Stack>
            </Box>
          ))}

          {column.items.length === 0 ? (
            <Box
              sx={{
                borderRadius: 2,
                border: "1px dashed",
                borderColor: "divider",
                px: 1.5,
                py: 2,
                textAlign: "center",
                color: "text.secondary",
                typography: "caption",
              }}
            >
              No tasks
            </Box>
          ) : null}
        </Stack>
      </Stack>
    ))}
  </Box>
);

export default KanbanView;
