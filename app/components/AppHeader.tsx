"use client";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Link from "next/link";

export default function AppHeader() {
  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{ borderBottom: 1, borderColor: "divider" }}
    >
      <Toolbar sx={{ maxWidth: 1200, mx: "auto", width: "100%" }}>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
          Feather Pods
        </Typography>
        <Stack direction="row" gap={2}>
          <Button LinkComponent={Link} href="/dashboard">
            Dashboard
          </Button>
          <Button LinkComponent={Link} href="/event/new" variant="contained">
            Create Event
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
