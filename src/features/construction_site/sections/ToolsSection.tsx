import {
  Card,
  Chip,
  Divider,
  Stack,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";
import { formatDateRange } from "../utils/dates";
import HandymanIcon from "@mui/icons-material/Handyman";

type Tool = {
  id: number;
  name?: string | null;
  model?: string | null;
  inventoryNumber?: string | null;
  serialNumber?: string | null;
  status?: string | null;
  condition?: string | null;
  dateFrom?: string | null;
  dateTo?: string | null;
  responsibleEmployeeName?: string | null;
};

export default function ToolsSection({
  tools,
  onAdd,
  onRowClick,
}: {
  tools?: Tool[];
  onAdd: () => void;
  onRowClick?: (id: number) => void;
}) {
  const { t } = useTranslation();
  const count = tools?.length ?? 0;

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <HandymanIcon color="primary" fontSize="small" />
          <Typography
            variant="subtitle2"
            fontWeight={600}
            color="text.secondary"
          >
            {t("constructionSites.detail.tools")} ({count})
          </Typography>
        </Stack>

        <IconButton
          size="small"
          onClick={onAdd}
          disableRipple
          sx={{
            p: 0.25,
            color: "primary.main",
            "&:hover": {
              backgroundColor: "transparent",
              opacity: 0.8,
            },
          }}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>

      <Divider sx={{ my: 1 }} />

      {count ? (
        <Stack spacing={1.5}>
          {tools!.map((tool) => {
            const title =
              tool.name ||
              tool.model ||
              tool.inventoryNumber ||
              tool.serialNumber ||
              "—";

            const meta =
              [
                tool.model &&
                  `${t("constructionSites.detail.tool.modelShort")}: ${
                    tool.model
                  }`,
                tool.inventoryNumber &&
                  `${t("constructionSites.detail.tool.inventoryShort")}: ${
                    tool.inventoryNumber
                  }`,
                tool.serialNumber &&
                  `${t("constructionSites.detail.tool.serialShort")}: ${
                    tool.serialNumber
                  }`,
              ]
                .filter(Boolean)
                .join(" · ") || "—";

            const dateRange = formatDateRange(tool.dateFrom, tool.dateTo);

            return (
              <Card
                key={tool.id}
                onClick={() => onRowClick?.(tool.id)}
                sx={{
                  p: 1.5,
                  cursor: onRowClick ? "pointer" : "default",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 0.5,
                    gap: 1,
                  }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      noWrap
                      sx={{ mb: 0.25 }}
                    >
                      {title}
                    </Typography>

                    {tool.responsibleEmployeeName && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        noWrap
                      >
                        {tool.responsibleEmployeeName}
                      </Typography>
                    )}
                  </Box>

                  {tool.condition && (
                    <Chip size="small" label={tool.condition} />
                  )}
                </Box>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mb: 0.25 }}
                  noWrap
                >
                  {meta}
                </Typography>

                {dateRange && (
                  <Typography
                    variant="caption"
                    color="primary.main"
                    sx={{ display: "block", mt: 0.25 }}
                  >
                    {dateRange}
                  </Typography>
                )}
              </Card>
            );
          })}
        </Stack>
      ) : (
        <Stack spacing={1.5} sx={{ p: 2, pl: 0 }}>
          <Typography variant="body2" color="text.secondary">
            {t("constructionSites.detail.noTools")}
          </Typography>

          <Box
            onClick={onAdd}
            sx={{
              p: 1.5,
              border: "1px dashed",
              borderColor: "primary.main",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <AddIcon fontSize="small" color="primary" />
            <Typography variant="body2">
              {t("constructionSites.detail.addFirstTool")}
            </Typography>
          </Box>
        </Stack>
      )}
    </>
  );
}
