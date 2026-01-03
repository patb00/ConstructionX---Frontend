import { Box } from "@mui/material";
import type { ReactNode } from "react";
import { FaMinusCircle } from "react-icons/fa";

type RemoveBadgeIconProps = {
  icon: ReactNode;
};

export function RemoveBadgeIcon({ icon }: RemoveBadgeIconProps) {
  return (
    <Box sx={{ position: "relative", width: 16, height: 16 }}>
      {icon}
      <FaMinusCircle
        size={10}
        color="#d32f2f"
        style={{
          position: "absolute",
          bottom: -4,
          right: -4,
          background: "white",
          borderRadius: "50%",
        }}
      />
    </Box>
  );
}
