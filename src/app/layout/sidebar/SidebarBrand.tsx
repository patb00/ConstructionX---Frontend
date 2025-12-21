import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { FaHardHat } from "react-icons/fa";

type Props = {
  isMobile: boolean;
};

export function SidebarBrand({ isMobile }: Props) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        px: 2,
        height: 64,
      }}
    >
      <Box
        sx={{
          display: "grid",
          placeItems: "center",
          width: 36,
          height: 36,
          borderRadius: 1,
          bgcolor: theme.palette.grey[200],
          color: theme.palette.primary.main,
        }}
      >
        <FaHardHat />
      </Box>

      {!isMobile && (
        <Typography sx={{ fontWeight: 700 }}>ConstructionX</Typography>
      )}
    </Box>
  );
}
