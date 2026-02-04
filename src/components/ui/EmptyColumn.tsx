import { Box, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export function EmptyColumn(props: {
  text: string;
  cta: string;
  onAdd: () => void;
}) {
  return (
    <Stack spacing={1.5} sx={{ p: 2, pl: 0 }}>
      <Typography variant="body2" color="text.secondary">
        {props.text}
      </Typography>

      <Box
        onClick={props.onAdd}
        sx={{
          p: 1.5,
          border: "1px dashed",
          borderColor: "primary.main",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <AddIcon fontSize="small" color="primary" />
        <Typography variant="body2">{props.cta}</Typography>
      </Box>
    </Stack>
  );
}
