import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { SidebarNavList, type SidebarNavItem } from "./SidebarNavList";
import type { ReactNode } from "react";

type Props = {
  sectionLabelKey: string;
  accordion?: { title: string; items: SidebarNavItem[]; icon?: ReactNode }[];
  listItems?: SidebarNavItem[];
  pathname: string;
  onClose: () => void;
};

export function SidebarSection({
  sectionLabelKey,
  accordion = [],
  listItems = [],
  pathname,
  onClose,
}: Props) {
  const theme = useTheme();
  const { t } = useTranslation();

  const renderSectionLabel = (key: string) => (
    <Typography
      variant="overline"
      sx={{
        color: theme.palette.text.secondary,
        px: 2,
        pt: 2,
        pb: 1,
        letterSpacing: 0.6,
      }}
    >
      {t(key as any)}
    </Typography>
  );

  const renderAccordion = (
    title: string,
    items: SidebarNavItem[],
    icon?: ReactNode
  ) => {
    if (!items.length) return null;

    return (
      <Accordion
        disableGutters
        elevation={0}
        defaultExpanded
        square
        sx={{ bgcolor: "transparent", "&:before": { display: "none" } }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            px: 2,
            minHeight: 40,
            "& .MuiAccordionSummary-content": { my: 0.5 },
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            {icon ? (
              <Typography
                component="span"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  color: theme.palette.text.secondary,
                  fontSize: 16,
                }}
              >
                {icon}
              </Typography>
            ) : null}

            <Typography
              variant="subtitle2"
              sx={{ color: theme.palette.text.secondary }}
            >
              {title}
            </Typography>
          </Stack>
        </AccordionSummary>

        <AccordionDetails sx={{ p: 0 }}>
          <SidebarNavList items={items} pathname={pathname} onClose={onClose} />
        </AccordionDetails>
      </Accordion>
    );
  };

  return (
    <>
      {renderSectionLabel(sectionLabelKey)}
      {accordion.map((a) => (
        <div key={a.title}>{renderAccordion(a.title, a.items, a.icon)}</div>
      ))}
      {!!listItems.length && (
        <SidebarNavList
          items={listItems}
          pathname={pathname}
          onClose={onClose}
        />
      )}
    </>
  );
}
