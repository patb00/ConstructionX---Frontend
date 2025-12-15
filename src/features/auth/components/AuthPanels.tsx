import { Box, Button, Typography } from "@mui/material";
import logSvg from "../assets/log.svg";
import registerSvg from "../assets/register.svg";
import { useTranslation } from "react-i18next";

type AuthMode = "sign-in" | "forgot-password";

type Props = {
  mode: AuthMode;
  onSignIn: () => void;
  onForgotPassword: () => void;
};

export function AuthPanels({ onSignIn, onForgotPassword }: Props) {
  const { t } = useTranslation();

  return (
    <>
      <Box className="panel left-panel">
        <Box className="content">
          <Typography component="h3">{t("auth.panels.left.title")}</Typography>
          <Typography component="p">{t("auth.panels.left.body")}</Typography>
          <Button
            size="small"
            variant="outlined"
            sx={{ borderColor: "white", mt: 1 }}
            onClick={onForgotPassword}
          >
            {t("auth.panels.left.button")}
          </Button>
        </Box>
        <Box component="img" src={logSvg} className="image" alt="" />
      </Box>

      <Box className="panel right-panel">
        <Box className="content">
          <Typography component="h3">{t("auth.panels.right.title")}</Typography>
          <Typography component="p">{t("auth.panels.right.body")}</Typography>
          <Button
            size="small"
            variant="outlined"
            sx={{ borderColor: "white", mt: 1 }}
            onClick={onSignIn}
          >
            {t("auth.panels.right.button")}
          </Button>
        </Box>
        <Box component="img" src={registerSvg} className="image" alt="" />
      </Box>
    </>
  );
}
