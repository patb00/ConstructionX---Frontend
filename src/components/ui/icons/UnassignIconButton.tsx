import { IconButton, Tooltip } from "@mui/material";
import React from "react";

type Props = {
  title: string;
  disabled?: boolean;
  onClick: (evt: React.MouseEvent) => void;
  sx?: any;
  children: React.ReactNode;
};

export function UnassignIconButton({
  title,
  disabled,
  onClick,
  sx,
  children,
}: Props) {
  return (
    <Tooltip title={title}>
      <IconButton
        size="small"
        onClick={(evt) => {
          evt.stopPropagation();
          onClick(evt);
        }}
        disabled={disabled}
        sx={sx}
      >
        {children}
      </IconButton>
    </Tooltip>
  );
}
