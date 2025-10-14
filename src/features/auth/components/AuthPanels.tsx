import { Box, Button, Typography } from "@mui/material";
import logSvg from "../assets/log.svg";
import registerSvg from "../assets/register.svg";

type AuthMode = "sign-in" | "forgot-password";

type Props = {
  mode: AuthMode;
  onSignIn: () => void;
  onForgotPassword: () => void;
};

export function AuthPanels({ onSignIn, onForgotPassword }: Props) {
  return (
    <>
      <Box className="panel left-panel">
        <Box className="content">
          <Typography component="h3">Zaboravljena lozinka?</Typography>
          <Typography component="p">
            Unesite e-poštu i poslat ćemo upute za obnovu.
          </Typography>
          <Button
            size="small"
            variant="outlined"
            sx={{ borderColor: "white", mt: 1 }}
            onClick={onForgotPassword}
          >
            Obnovi lozinku
          </Button>
        </Box>
        <Box component="img" src={logSvg} className="image" alt="" />
      </Box>

      <Box className="panel right-panel">
        <Box className="content">
          <Typography component="h3">Natrag na prijavu</Typography>
          <Typography component="p">
            Vratite se na prijavu i pristupite računu.
          </Typography>
          <Button
            size="small"
            variant="outlined"
            sx={{ borderColor: "white", mt: 1 }}
            onClick={onSignIn}
          >
            Prijava
          </Button>
        </Box>
        <Box component="img" src={registerSvg} className="image" alt="" />
      </Box>
    </>
  );
}
