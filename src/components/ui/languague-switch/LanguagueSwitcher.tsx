import { useTranslation } from "react-i18next";
import {
  MenuItem,
  Select,
  type SelectChangeEvent,
  Box,
  Typography,
  Avatar,
} from "@mui/material";

const LANG_CONFIG: Record<
  string,
  { label: string; name: string; flag: string }
> = {
  en: { label: "EN", name: "English", flag: "/flags/us.svg" },
  hr: { label: "HR", name: "Hrvatski", flag: "/flags/hr.svg" },
  de: { label: "DE", name: "Deutsch", flag: "/flags/de.svg" },
};

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const value = i18n.language?.split("-")[0] ?? "en";

  const handleChange = (e: SelectChangeEvent<string>) => {
    const lng = e.target.value;
    void i18n.changeLanguage(lng);
    document.documentElement.lang = lng;
  };

  return (
    <Box sx={{ minWidth: 90 }}>
      <Select<string>
        size="small"
        value={value}
        onChange={handleChange}
        displayEmpty
        inputProps={{ "aria-label": "Language" }}
        sx={(theme) => ({
          height: 32,
          bgcolor: "rgba(255,255,255,0.9)",
          boxShadow: "0 0 0 1px rgba(0,0,0,0.04)",

          "& .MuiOutlinedInput-notchedOutline": { border: "none" },
          "& .MuiSelect-select": {
            py: 0,
            pl: 1.2,
            pr: 4,
            display: "flex",
            alignItems: "center",
            gap: 1,
          },
          "& .MuiSelect-icon": {
            right: 8,
            color: theme.palette.text.secondary,
          },
        })}
        renderValue={(selected) => {
          const lang = LANG_CONFIG[selected as string];
          return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar
                src={lang.flag}
                alt={lang.label}
                sx={{ width: 18, height: 18 }}
              />
              <Typography
                variant="caption"
                sx={{ fontWeight: 600, letterSpacing: 1 }}
              >
                {lang.label}
              </Typography>
            </Box>
          );
        }}
      >
        {Object.keys(LANG_CONFIG).map((lng) => {
          const lang = LANG_CONFIG[lng];

          return (
            <MenuItem key={lng} value={lng}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  width: "100%",
                }}
              >
                <Avatar
                  src={lang.flag}
                  alt={lang.label}
                  sx={{ width: 22, height: 22 }}
                />
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography variant="body2">{lang.name}</Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", letterSpacing: 1 }}
                  >
                    {lang.label}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
          );
        })}
      </Select>
    </Box>
  );
}
