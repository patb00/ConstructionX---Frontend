import { IconButton, Tooltip } from "@mui/material";
import type { ReactNode } from "react";

type Props = {
  title: string;
  icon: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  sx?: object;
};

export function RemoveActionButton({
  title,
  icon,
  onClick,
  disabled,
  sx,
}: Props) {
  return (
    <Tooltip title={title}>
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        disabled={disabled}
        sx={sx}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );
}
