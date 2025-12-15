import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const LANGS = ["en", "hr", "de"] as const;

export function LoginLanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = i18n.language?.split("-")[0] ?? "en";

  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      {LANGS.map((lng) => {
        const selected = lng === current;

        return (
          <Typography
            key={lng}
            variant="caption"
            onClick={() => {
              void i18n.changeLanguage(lng);
              document.documentElement.lang = lng;
            }}
            sx={(theme) => ({
              cursor: "pointer",
              fontWeight: selected ? 600 : 400,
              color: selected
                ? theme.palette.text.primary
                : theme.palette.text.secondary,
              textDecoration: selected ? "underline" : "none",
              "&:hover": {
                color: theme.palette.text.primary,
              },
            })}
          >
            {lng.toUpperCase()}
          </Typography>
        );
      })}
    </Box>
  );
}
