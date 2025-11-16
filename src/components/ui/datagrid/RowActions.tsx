import * as React from "react";
import {
  Box,
  Button,
  Tooltip,
  CircularProgress,
  type ButtonProps,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CheckIcon from "@mui/icons-material/Check";
import BlockIcon from "@mui/icons-material/Block";
import SecurityIcon from "@mui/icons-material/Security";

export type RowActionsLabels = {
  view?: string;
  edit?: string;
  delete?: string;
  activate?: string;
  deactivate?: string;
  roles?: string;
};

type RowActionsProps = {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleActive?: () => void;
  isActive?: boolean;
  toggleLoading?: boolean;
  onManageRoles?: () => void;
  disabled?: boolean;
  color?: string;
  labels?: RowActionsLabels;
  buttonProps?: Partial<ButtonProps>;
};

export function RowActions({
  onView,
  onEdit,
  onDelete,
  onToggleActive,
  isActive,
  toggleLoading,
  onManageRoles,
  disabled,
  color = "#F1B103",
  labels,
  buttonProps,
}: RowActionsProps) {
  const theme = useTheme();

  const errorColor = theme.palette.error.main; // #FF6666
  const successColor = theme.palette.success.main; // #21D191

  const normalBg = alpha(color, 0.12);
  const normalBgHover = alpha(color, 0.2);

  const iconButtonSx = {
    minWidth: 0,
    width: 32,
    height: 32,
    p: 0,
    borderRadius: 2,
    boxShadow: "none",
    backgroundColor: normalBg,
    color,
    "&:hover": { backgroundColor: normalBgHover },
    "&.Mui-disabled": {
      backgroundColor: normalBg,
      color: alpha(color, 0.5),
    },
  } as const;

  const deleteButtonSx = {
    ...iconButtonSx,
    backgroundColor: alpha(errorColor, 0.12),
    color: errorColor,
    "&:hover": { backgroundColor: alpha(errorColor, 0.2) },
    "&.Mui-disabled": {
      backgroundColor: alpha(errorColor, 0.12),
      color: alpha(errorColor, 0.5),
    },
  } as const;

  const toggleButtonSx = isActive
    ? {
        ...iconButtonSx,
        backgroundColor: alpha(errorColor, 0.12),
        color: errorColor,
        "&:hover": { backgroundColor: alpha(errorColor, 0.2) },
        "&.Mui-disabled": {
          backgroundColor: alpha(errorColor, 0.12),
          color: alpha(errorColor, 0.5),
        },
      }
    : {
        ...iconButtonSx,
        backgroundColor: alpha(successColor, 0.12),
        color: successColor,
        "&:hover": { backgroundColor: alpha(successColor, 0.2) },
        "&.Mui-disabled": {
          backgroundColor: alpha(successColor, 0.12),
          color: alpha(successColor, 0.5),
        },
      };

  const handleClick =
    (fn?: () => void, extraDisabled?: boolean) => (e: React.MouseEvent) => {
      e.stopPropagation();
      if (disabled || extraDisabled || !fn) return;
      fn();
    };

  const hasAnyAction =
    onView || onEdit || onDelete || onToggleActive || onManageRoles;

  if (!hasAnyAction) return null;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 0.5,
        height: "100%",
      }}
    >
      {/* VIEW */}
      {onView && (
        <Tooltip title={labels?.view ?? "Pregled"}>
          <span>
            <Button
              variant="contained"
              size="small"
              sx={iconButtonSx}
              disabled={disabled}
              onClick={handleClick(onView)}
              {...buttonProps}
            >
              <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
            </Button>
          </span>
        </Tooltip>
      )}

      {/* EDIT */}
      {onEdit && (
        <Tooltip title={labels?.edit ?? "Uredi"}>
          <span>
            <Button
              variant="contained"
              size="small"
              sx={iconButtonSx}
              disabled={disabled}
              onClick={handleClick(onEdit)}
              {...buttonProps}
            >
              <EditOutlinedIcon sx={{ fontSize: 16 }} />
            </Button>
          </span>
        </Tooltip>
      )}

      {/* DELETE */}
      {onDelete && (
        <Tooltip title={labels?.delete ?? "Izbriši"}>
          <span>
            <Button
              variant="contained"
              size="small"
              sx={deleteButtonSx}
              disabled={disabled}
              onClick={handleClick(onDelete)}
              {...buttonProps}
            >
              <DeleteOutlineIcon sx={{ fontSize: 16 }} />
            </Button>
          </span>
        </Tooltip>
      )}

      {/* ACTIVATE / DEACTIVATE — NEW COLORS */}
      {onToggleActive && (
        <Tooltip
          title={
            isActive
              ? labels?.deactivate ?? "Deaktiviraj"
              : labels?.activate ?? "Aktiviraj"
          }
        >
          <span>
            <Button
              variant="contained"
              size="small"
              sx={toggleButtonSx}
              disabled={disabled || toggleLoading}
              onClick={handleClick(onToggleActive, toggleLoading)}
              {...buttonProps}
            >
              {toggleLoading ? (
                <CircularProgress size={16} />
              ) : isActive ? (
                <BlockIcon sx={{ fontSize: 16 }} />
              ) : (
                <CheckIcon sx={{ fontSize: 16 }} />
              )}
            </Button>
          </span>
        </Tooltip>
      )}

      {/* ROLES */}
      {onManageRoles && (
        <Tooltip title={labels?.roles ?? "Role"}>
          <span>
            <Button
              variant="contained"
              size="small"
              sx={iconButtonSx}
              disabled={disabled}
              onClick={handleClick(onManageRoles)}
              {...buttonProps}
            >
              <SecurityIcon sx={{ fontSize: 16 }} />
            </Button>
          </span>
        </Tooltip>
      )}
    </Box>
  );
}
