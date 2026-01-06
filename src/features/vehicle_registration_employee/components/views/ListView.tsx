import {
  Box,
  Checkbox,
  Chip,
  Collapse,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import {
  ArrowDropDownRounded,
  CheckCircleRounded,
  ChevronRightRounded,
  ExpandMoreRounded,
  RadioButtonUncheckedRounded,
} from "@mui/icons-material";

import type { VehicleRegistrationEmployee } from "../..";
import { RowActions } from "../../../../components/ui/datagrid/RowActions";
import type { TaskSection } from "./types";

const gridCols = "40px 1fr 140px 200px 260px";

type ListViewProps = {
  sections: TaskSection[];
  openByKey: Record<string, boolean>;
  onToggleSection: (key: string) => void;
  onChangeStatus: (task: VehicleRegistrationEmployee) => void;
  isUpdating: boolean;
  labels: {
    deadline: string;
    projects: string;
    labels: string;
    changeStatus: string;
  };
};

const ListView = ({
  sections,
  openByKey,
  onToggleSection,
  onChangeStatus,
  isUpdating,
  labels,
}: ListViewProps) => (
  <Stack spacing={2} sx={{ width: "100%" }}>
    {sections.map((section) => {
      const open = openByKey[section.key] ?? true;

      return (
        <Box key={section.key} sx={{ width: "100%" }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: gridCols,
              alignItems: "center",
              gap: 0,
              px: 0,
              py: 0,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconButton
                size="small"
                onClick={() => onToggleSection(section.key)}
              >
                {open ? <ExpandMoreRounded /> : <ChevronRightRounded />}
              </IconButton>
            </Box>

            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ minWidth: 0, py: 0.75 }}
            >
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  maxWidth: "100%",
                  px: 1.25,
                  py: 0.5,
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "background.paper",
                }}
              >
                <Typography variant="body2" fontWeight={600} noWrap>
                  {section.title}
                </Typography>
              </Box>
            </Stack>

            <Stack
              direction="row"
              alignItems="center"
              spacing={0.25}
              sx={{ py: 0.75 }}
            >
              <Typography variant="caption" color="text.secondary">
                {labels.deadline}
              </Typography>
              <ArrowDropDownRounded
                sx={{ fontSize: 18, color: "text.disabled" }}
              />
            </Stack>

            <Stack
              direction="row"
              alignItems="center"
              spacing={0.25}
              sx={{ py: 0.75 }}
            >
              <Typography variant="caption" color="text.secondary">
                {labels.projects}
              </Typography>
              <ArrowDropDownRounded
                sx={{ fontSize: 18, color: "text.disabled" }}
              />
            </Stack>

            <Stack
              direction="row"
              alignItems="center"
              spacing={0.25}
              sx={{ py: 0.75 }}
            >
              <Typography variant="caption" color="text.secondary">
                {labels.labels}
              </Typography>
              <ArrowDropDownRounded
                sx={{ fontSize: 18, color: "text.disabled" }}
              />
            </Stack>
          </Box>

          <Box
            sx={{
              mt: 0.75,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              overflow: "hidden",
              bgcolor: "background.paper",
            }}
          >
            <Collapse in={open} timeout={160} unmountOnExit={false}>
              <Stack divider={<Divider flexItem />}>
                {section.items.map((item) => (
                  <Box
                    key={String(item.task.id)}
                    sx={{
                      display: "grid",
                      gridTemplateColumns: gridCols,
                      alignItems: "center",
                      px: 0,
                      py: 0,
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <Checkbox
                        checked={item.task.status === 3}
                        onChange={() => onChangeStatus(item.task)}
                        disabled={isUpdating}
                        icon={<RadioButtonUncheckedRounded />}
                        checkedIcon={<CheckCircleRounded />}
                        sx={{ p: 0.5 }}
                      />
                    </Box>

                    <Box sx={{ py: 0.9, pr: 1, minWidth: 0 }}>
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {item.title}
                      </Typography>
                      {item.subtitle ? (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          noWrap
                        >
                          {item.subtitle}
                        </Typography>
                      ) : null}
                    </Box>

                    <Box sx={{ py: 0.9, pr: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {item.deadline || "-"}
                      </Typography>
                    </Box>

                    <Box sx={{ py: 0.9, pr: 1, minWidth: 0 }}>
                      <Chip
                        size="small"
                        label={item.projectName}
                        variant="outlined"
                        sx={{ height: 24, maxWidth: "100%" }}
                      />
                    </Box>

                    <Box
                      sx={{
                        py: 0.9,
                        pr: 1,
                        minWidth: 0,
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        gap: 1,
                      }}
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{ minWidth: 0, overflow: "hidden" }}
                      >
                        <Chip
                          size="small"
                          label={item.statusTag.label}
                          color={item.statusTag.color}
                          variant="outlined"
                          sx={{ height: 24 }}
                        />

                        {item.regNumber ? (
                          <Chip
                            size="small"
                            label={item.regNumber}
                            variant="outlined"
                            sx={{ height: 24 }}
                          />
                        ) : null}
                      </Stack>

                      {!item.isCompleted ? (
                        <Box sx={{ ml: "auto", flexShrink: 0 }}>
                          <RowActions
                            disabled={item.disabled}
                            onChangeStatus={() => onChangeStatus(item.task)}
                            labels={{
                              status: labels.changeStatus,
                            }}
                            buttonProps={{ size: "small" }}
                          />
                        </Box>
                      ) : null}
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Collapse>
          </Box>
        </Box>
      );
    })}
  </Stack>
);

export default ListView;
