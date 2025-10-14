import { useEffect, useState } from "react";
import { Paper, Stack, Typography, Button, TextField } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { useUpdateUser } from "../hooks/useUpdateUser";
import { useUser } from "../hooks/useUser";

export default function UserEditPage() {
  const { id } = useParams<{ id: string }>();
  if (!id) return <div>Neispravan URL (id)</div>;

  const navigate = useNavigate();
  const { data: user, isLoading, error } = useUser(id);
  const { mutateAsync: updateUser, isPending } = useUpdateUser();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName ?? "");
      setLastName(user.lastName ?? "");
      setPhoneNumber(user.phoneNumber ?? "");
      setEmail(user.email ?? "");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUser({ id, firstName, lastName, phoneNumber });
    navigate("/app/administration/users");
  };

  if (error) return <div>Neuspjelo učitavanje korisnika.</div>;

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          Uredi korisnika
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/administration/users")}
          sx={{
            color: "primary.main",
          }}
        >
          Natrag
        </Button>
      </Stack>

      <Paper
        elevation={0}
        sx={{
          border: (t) => `1px solid ${t.palette.divider}`,
          p: 2,
          width: "100%",
        }}
      >
        <form onSubmit={handleSubmit}>
          <Stack spacing={2} maxWidth={480}>
            <Typography variant="subtitle1">
              Korisnik: <strong>{email}</strong>
            </Typography>

            <TextField
              label="Ime"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={isLoading || isPending}
            />
            <TextField
              label="Prezime"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={isLoading || isPending}
            />
            <TextField
              label="Broj telefona"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={isLoading || isPending}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={isPending || isLoading}
            >
              Spremi
            </Button>
          </Stack>
        </form>
      </Paper>
    </Stack>
  );
}
