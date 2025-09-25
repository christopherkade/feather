"use client";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

export default function CopyEventId({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(id);
      setOpen(true);
    } catch (_) {
      // noop
    }
  }
  return (
    <>
      <Tooltip title="Copy event ID">
        <IconButton aria-label="Copy event ID" size="small" onClick={copy}>
          <ContentCopyIcon fontSize="inherit" />
        </IconButton>
      </Tooltip>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setOpen(false)}
        >
          Event ID copied to clipboard
        </Alert>
      </Snackbar>
    </>
  );
}
