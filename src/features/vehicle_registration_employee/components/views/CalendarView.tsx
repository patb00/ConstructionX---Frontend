import { Box, Chip, Stack, Typography } from "@mui/material";

import type { VehicleRegistrationEmployee } from "../..";
import { RowActions } from "../../../../components/ui/datagrid/RowActions";
import type { CalendarDay, TaskView } from "./types";

type CalendarViewProps = {
  days: CalendarDay[];
  unscheduledTasks: TaskView[];
  onChangeStatus: (task: VehicleRegistrationEmployee) => void;
  isUpdating: boolean;
  changeStatusLabel: string;
};

const CalendarView = ({
  days,
  unscheduledTasks,
  onChangeStatus,
  isUpdating,
  changeStatusLabel,
}: CalendarViewProps) => (
  <Stack spacing={2}>
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: `repeat(${days.length + 1}, minmax(160px, 1fr))`,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        overflow: "hidden",
        bgcolor: "background.paper",
      }}
    >
      {days.map((day) => (
        <Box
          key={day.key}
          sx={{
            borderRight: "1px solid",
            borderColor: "divider",
            p: 1,
            bgcolor: "background.default",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {day.label}
          </Typography>
          <Typography variant="subtitle2" fontWeight={700}>
            {day.dateLabel}
          </Typography>
        </Box>
      ))}
      <Box sx={{ p: 1, bgcolor: "background.default" }}>
        <Typography variant="caption" color="text.secondary">
          Unscheduled
        </Typography>
        <Typography variant="subtitle2" fontWeight={700}>
          No date
        </Typography>
      </Box>

      {days.map((day) => (
        <Box
          key={`${day.key}-tasks`}
          sx={{
            borderTop: "1px solid",
            borderRight: "1px solid",
            borderColor: "divider",
            p: 1,
            minHeight: 220,
          }}
        >
          <Stack spacing={1}>
            {day.tasks.map((item) => (
              <Box
                key={String(item.task.id)}
                sx={{
                  borderRadius: 1.5,
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "background.default",
                  p: 1,
                }}
              >
                <Typography variant="body2" fontWeight={600} noWrap>
                  {item.title}
                </Typography>
                {item.subtitle ? (
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {item.subtitle}
                  </Typography>
                ) : null}
                <Stack direction="row" spacing={0.75} mt={0.75} flexWrap="wrap">
                  <Chip
                    size="small"
                    label={item.statusTag.label}
                    color={item.statusTag.color}
                    variant="outlined"
                  />
                  <Chip
                    size="small"
                    label={item.projectName}
                    variant="outlined"
                  />
                </Stack>
                {!item.isCompleted ? (
                  <Box sx={{ mt: 0.5 }}>
                    <RowActions
                      disabled={item.disabled || isUpdating}
                      onChangeStatus={() => onChangeStatus(item.task)}
                      labels={{ status: changeStatusLabel }}
                      buttonProps={{ size: "small" }}
                    />
                  </Box>
                ) : null}
              </Box>
            ))}
          </Stack>
        </Box>
      ))}

      <Box
        sx={{
          borderTop: "1px solid",
          borderColor: "divider",
          p: 1,
          minHeight: 220,
        }}
      >
        <Stack spacing={1}>
          {unscheduledTasks.map((item) => (
            <Box
              key={String(item.task.id)}
              sx={{
                borderRadius: 1.5,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.default",
                p: 1,
              }}
            >
              <Typography variant="body2" fontWeight={600} noWrap>
                {item.title}
              </Typography>
              {item.subtitle ? (
                <Typography variant="caption" color="text.secondary" noWrap>
                  {item.subtitle}
                </Typography>
              ) : null}
              <Stack direction="row" spacing={0.75} mt={0.75} flexWrap="wrap">
                <Chip
                  size="small"
                  label={item.statusTag.label}
                  color={item.statusTag.color}
                  variant="outlined"
                />
                <Chip
                  size="small"
                  label={item.projectName}
                  variant="outlined"
                />
              </Stack>
              {!item.isCompleted ? (
                <Box sx={{ mt: 0.5 }}>
                  <RowActions
                    disabled={item.disabled || isUpdating}
                    onChangeStatus={() => onChangeStatus(item.task)}
                    labels={{ status: changeStatusLabel }}
                    buttonProps={{ size: "small" }}
                  />
                </Box>
              ) : null}
            </Box>
          ))}

          {unscheduledTasks.length === 0 ? (
            <Box
              sx={{
                borderRadius: 1.5,
                border: "1px dashed",
                borderColor: "divider",
                p: 1,
                textAlign: "center",
                color: "text.secondary",
                typography: "caption",
              }}
            >
              No unscheduled tasks
            </Box>
          ) : null}
        </Stack>
      </Box>
    </Box>
  </Stack>
);

export default CalendarView;
