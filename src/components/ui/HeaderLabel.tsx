import React from "react";
import { Box, Typography } from "@mui/material";

type HeaderLabelProps = {
  icon: React.ReactNode;
  text: string;
};

const HeaderLabel = ({ icon, text }: HeaderLabelProps) => (
  <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.75 }}>
    <Box
      sx={{
        width: 18,
        height: 18,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 0.75,
        bgcolor: "grey.50",
        border: "1px solid",
        borderColor: "divider",
        "& svg": { fontSize: 14, color: "text.secondary" },
      }}
    >
      {icon}
    </Box>

    <Typography component="span" sx={{ fontSize: 12, fontWeight: 700 }}>
      {text}
    </Typography>
  </Box>
);

export default HeaderLabel;
