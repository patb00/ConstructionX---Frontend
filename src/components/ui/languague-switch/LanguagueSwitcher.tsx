import { useTranslation } from "react-i18next";
import { MenuItem, Select, type SelectChangeEvent, Box } from "@mui/material";

const LANG_LABELS: Record<string, string> = {
  en: "EN",
  hr: "HR",
  de: "DE",
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
    <Box sx={{ minWidth: 80 }}>
      <Select
        size="small"
        value={value}
        onChange={handleChange}
        variant="outlined"
        sx={{
          height: 32,
          "& .MuiSelect-select": {
            py: 0.5,
            display: "flex",
            alignItems: "center",
          },
        }}
        inputProps={{ "aria-label": "Language" }}
      >
        {Object.keys(LANG_LABELS).map((lng) => (
          <MenuItem key={lng} value={lng}>
            {LANG_LABELS[lng]}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}
