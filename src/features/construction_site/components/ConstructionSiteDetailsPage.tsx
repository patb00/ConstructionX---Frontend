import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useConstructionSite } from "../hooks/useConstructionSite";

export default function ConstructionSiteDetailsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const siteId = Number(id);
  if (!Number.isFinite(siteId))
    return <div>{t("constructionSites.edit.invalidUrlId")}</div>;

  const { data } = useConstructionSite(siteId);

  console.log(data);

  return (
    <Stack spacing={2} sx={{ width: "100%", minWidth: 0 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("constructionSites.detail.title", {
            defaultValue: "Pregled gradilišta",
          })}
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/constructionSites")}
          sx={{ color: "primary.main" }}
        >
          {t("constructionSites.edit.back")}
        </Button>
      </Box>

      <Card elevation={3} sx={{ p: 2 }}>
        <CardHeader
          titleTypographyProps={{ variant: "subtitle1", fontWeight: 600 }}
          title={t("constructionSites.detail.summary", {
            defaultValue: "Sažetak gradilišta",
          })}
          sx={{ p: 0, mb: 1 }}
        />
        <Divider />
        <Box sx={{ height: 140 }} />
      </Card>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          mt: 2,
          width: "100%",
        }}
      >
        <Card
          elevation={3}
          sx={{
            flexBasis: { md: "50%" },
            flexGrow: 1,
            p: 2,
          }}
        >
          <CardHeader
            titleTypographyProps={{ variant: "subtitle1", fontWeight: 600 }}
            title={t("constructionSites.detail.employees", {
              defaultValue: "Zaposlenici",
            })}
            sx={{ p: 0, mb: 1 }}
          />
          <Divider />
          <Box sx={{ height: 220 }} />
        </Card>

        <Card
          elevation={3}
          sx={{
            flexBasis: { md: "50%" },
            flexGrow: 1,
            p: 2,
          }}
        >
          <CardHeader
            titleTypographyProps={{ variant: "subtitle1", fontWeight: 600 }}
            title={t("constructionSites.detail.tools", {
              defaultValue: "Alati",
            })}
            sx={{ p: 0, mb: 1 }}
          />
          <Divider />
          <Box sx={{ height: 220 }} />
        </Card>
      </Box>

      <Card elevation={3} sx={{ mt: 2, p: 2 }}>
        <CardHeader
          titleTypographyProps={{ variant: "subtitle1", fontWeight: 600 }}
          title={t("constructionSites.detail.activity", {
            defaultValue: "Vozila",
          })}
          sx={{ p: 0, mb: 1 }}
        />
        <Divider />
        <Box sx={{ height: 220 }} />
      </Card>
    </Stack>
  );
}
