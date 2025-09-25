"use client";
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JoinEventPage() {
  const [id, setId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  async function attemptJoin() {
    const res = await fetch(`/api/events/${encodeURIComponent(id)}`);
    const json = await res.json();
    if (json?.exists) {
      router.push(`/event/${id}`);
    } else {
      setError("Event does not exist");
    }
  }
  return (
    <Box p={3}>
      <Stack gap={2}>
        <Typography variant="h5">Join Event</Typography>
        <TextField
          label="Event ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <Button variant="contained" onClick={attemptJoin} disabled={!id}>
          Join
        </Button>
        <Snackbar
          open={!!error}
          autoHideDuration={3000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            severity="error"
            variant="filled"
            icon={false}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        </Snackbar>
      </Stack>
    </Box>
  );
}
