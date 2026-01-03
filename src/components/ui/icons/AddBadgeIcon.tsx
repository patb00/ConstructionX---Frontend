import { Box } from "@mui/material";
import { FaPlusCircle } from "react-icons/fa";

type AddBadgeIconProps = {
  icon: React.ReactNode;
};

export function AddBadgeIcon({ icon }: AddBadgeIconProps) {
  return (
    <Box sx={{ position: "relative", width: 16, height: 16 }}>
      {icon}
      <FaPlusCircle
        size={10}
        color="#1976d2"
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
