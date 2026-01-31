import { Chip, Stack, Typography, Box } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import PersonIcon from "@mui/icons-material/Person";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";

import {
  HistoryPanelShell,
  pillSx,
} from "../../../../components/ui/history/HistoryPanelShell";
import { HistoryCard } from "../../../../components/ui/history/HistoryCard";
import { HistoryAccordionSection } from "../../../../components/ui/history/HistoryAccordionSection";
import { useMedicalExaminationsByEmployee } from "../../../medical_examinations/hooks/useMedicalExaminationsByEmployee";
import { useCertificationsByEmployee } from "../../../certifications/hooks/useCertificationsByEmployee";
import { formatDate } from "../../../construction_site/utils/dates";


export function EmployeeHistoryDetails({ employeeId }: { employeeId: number }) {
  const theme = useTheme();
  const { t } = useTranslation();

  const {
    medicalExaminationsRows,
    isLoading: loadingMedical,
    error: errorMedical,
  } = useMedicalExaminationsByEmployee(employeeId);

  const {
    certificationsRows,
    isLoading: loadingCert,
    error: errorCert,
  } = useCertificationsByEmployee(employeeId);

  return (
    <HistoryPanelShell
      title={t("history.employee.title")}
      headerChips={
        <Chip
          size="small"
          icon={<PersonIcon sx={{ fontSize: 14 }} />}
          label={`${t("history.common.employeeId")}: ${employeeId}`}
          sx={{ ...pillSx, bgcolor: alpha(theme.palette.primary.main, 0.04) }}
        />
      }
    >
      <HistoryAccordionSection
        defaultExpanded
        icon={<MedicalServicesIcon sx={{ fontSize: 18 }} />}
        label={t("history.employee.medicalExaminations")}
        count={medicalExaminationsRows.length}
        isLoading={loadingMedical}
        isError={!!errorMedical}
        errorText={t("history.common.loadError")}
        emptyText={t("history.employee.emptyMedicalExaminations")}
      >
        <Stack spacing={1}>
          {medicalExaminationsRows.map((item) => (
            <HistoryCard key={item.id}>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" fontWeight={600} noWrap>
                  {item.examinationTypeName ||
                    t("history.employee.medicalExaminationFallback")}
                </Typography>

                <Stack
                  direction="row"
                  spacing={0.75}
                  sx={{ mt: 0.75, flexWrap: "wrap", rowGap: 0.5 }}
                  alignItems="center"
                >
                  <Chip
                    size="small"
                    label={formatDate(item.examinationDate)}
                    sx={{
                      ...pillSx,
                      bgcolor: alpha(theme.palette.info.main, 0.06),
                    }}
                  />
                  {item.nextExaminationDate && (
                    <Chip
                      size="small"
                      label={`Next: ${formatDate(item.nextExaminationDate)}`}
                      sx={{
                        ...pillSx,
                        bgcolor: alpha(theme.palette.warning.main, 0.06),
                      }}
                    />
                  )}
                  {item.result && (
                    <Chip
                      size="small"
                      label={item.result}
                      sx={{
                        ...pillSx,
                        bgcolor: alpha(theme.palette.success.main, 0.06),
                      }}
                    />
                  )}
                </Stack>
              </Box>
            </HistoryCard>
          ))}
        </Stack>
      </HistoryAccordionSection>

      <HistoryAccordionSection
        defaultExpanded
        icon={<WorkspacePremiumIcon sx={{ fontSize: 18 }} />}
        label={t("history.employee.certifications")}
        count={certificationsRows.length}
        isLoading={loadingCert}
        isError={!!errorCert}
        errorText={t("history.common.loadError")}
        emptyText={t("history.employee.emptyCertifications")}
      >
        <Stack spacing={1}>
          {certificationsRows.map((item) => (
            <HistoryCard key={item.id}>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" fontWeight={600} noWrap>
                  {item.certificationTypeName ||
                    t("history.employee.certificationFallback")}
                </Typography>

                <Stack
                  direction="row"
                  spacing={0.75}
                  sx={{ mt: 0.75, flexWrap: "wrap", rowGap: 0.5 }}
                  alignItems="center"
                >
                  <Chip
                    size="small"
                    label={formatDate(item.certificationDate)}
                    sx={{
                      ...pillSx,
                      bgcolor: alpha(theme.palette.info.main, 0.06),
                    }}
                  />
                  {item.nextCertificationDate && (
                    <Chip
                      size="small"
                      label={`Next: ${formatDate(item.nextCertificationDate)}`}
                      sx={{
                        ...pillSx,
                        bgcolor: alpha(theme.palette.warning.main, 0.06),
                      }}
                    />
                  )}
                  {item.status && (
                    <Chip
                      size="small"
                      label={
                         // @ts-ignore
                        t(`certifications.status.${item.status.toLowerCase()}`) || item.status
                      }
                      sx={{
                        ...pillSx,
                        bgcolor: alpha(theme.palette.secondary.main, 0.06),
                      }}
                    />
                  )}
                </Stack>
              </Box>
            </HistoryCard>
          ))}
        </Stack>
      </HistoryAccordionSection>
    </HistoryPanelShell>
  );
}
