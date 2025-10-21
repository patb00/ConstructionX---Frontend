import {
  Card,
  CardHeader,
  Chip,
  Divider,
  Stack,
  Typography,
  Box,
} from "@mui/material";

import { useTranslation } from "react-i18next";
import Row from "../../../components/ui/Row";
import { formatDateRange } from "../utils/dates";

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
  return (
    <Card elevation={3} sx={{ flexBasis: { md: "50%" }, flexGrow: 1, p: 2 }}>
      <CardHeader
        titleTypographyProps={{ variant: "subtitle1", fontWeight: 600 }}
        title={t("constructionSites.detail.tools", { defaultValue: "Alati" })}
        sx={{ p: 0, mb: 1 }}
      />
      <Divider />
      <Box sx={{ maxHeight: 260, overflow: "auto", pt: 1 }}>
        {tools?.length ? (
          <Stack divider={<Divider flexItem />} sx={{ "& > *": { px: 0.5 } }}>
            {tools.map((tool) => (
              <Row
                key={tool.id}
                left={
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ flexWrap: "wrap", rowGap: 0.5 }}
                  >
                    <Typography variant="body2" fontWeight={600} noWrap>
                      {tool.name || "—"}
                    </Typography>
                    {tool.responsibleEmployeeName && (
                      <Chip
                        size="small"
                        variant="outlined"
                        label={tool.responsibleEmployeeName}
                      />
                    )}
                    {/* {tool.status && (
                      <Chip size="small" variant="outlined" label={tool.status} />
                    )} */}
                    {tool.condition && (
                      <Chip size="small" label={tool.condition} />
                    )}
                  </Stack>
                }
                sub={
                  [
                    tool.model &&
                      `${t("constructionSites.detail.tool.modelShort", {
                        defaultValue: "Model",
                      })}: ${tool.model}`,
                    tool.inventoryNumber &&
                      `${t("constructionSites.detail.tool.inventoryShort", {
                        defaultValue: "Inv. br.",
                      })}: ${tool.inventoryNumber}`,
                    tool.serialNumber &&
                      `${t("constructionSites.detail.tool.serialShort", {
                        defaultValue: "Ser. br.",
                      })}: ${tool.serialNumber}`,
                  ]
                    .filter(Boolean)
                    .join(" · ") || "—"
                }
                right={
                  <Typography variant="caption" color="primary.main">
                    {formatDateRange(tool.dateFrom, tool.dateTo)}
                  </Typography>
                }
                onClick={() => onRowClick?.(tool.id)}
              />
            ))}
            <Row
              addRow
              left={t("constructionSites.detail.addTool", {
                defaultValue: "Dodaj alat",
              })}
              onClick={onAdd}
            />
          </Stack>
        ) : (
          <Stack spacing={1.5} sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {t("constructionSites.detail.noTools", {
                defaultValue: "Nema dodijeljenih alata.",
              })}
            </Typography>
            <Row
              addRow
              left={t("constructionSites.detail.addFirstTool", {
                defaultValue: "Dodaj prvi alat",
              })}
              onClick={onAdd}
            />
          </Stack>
        )}
      </Box>
    </Card>
  );
}
