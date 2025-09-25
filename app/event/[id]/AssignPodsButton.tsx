"use client";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useState } from "react";

export default function AssignPodsButton({ id }: { id: string }) {
  const [error, setError] = useState<string | null>(null);
  async function onAssign() {
    const res = await fetch(`/api/events/${id}/pods`, { method: "POST" });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setError(json?.error ?? "Failed to assign pods");
    } else {
      // Success: let the page fetch pods via server and refresh
      location.reload();
    }
  }
  return (
    <>
      <Button variant="contained" onClick={onAssign}>
        Assign Pods
      </Button>
      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" variant="filled" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
}
