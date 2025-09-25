"use client";
import { Container, Stack, CircularProgress, Typography } from "@mui/material";

export default function LoadingEvent() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Stack
        alignItems="center"
        justifyContent="center"
        gap={2}
        sx={{ minHeight: "50vh" }}
      >
        <CircularProgress />
        <Typography variant="body1" color="text.secondary">
          Loading event…
        </Typography>
      </Stack>
    </Container>
  );
}
