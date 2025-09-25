"use client";
import { useEffect, useRef, useState } from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function CopyEventId({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);
  async function copy() {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setCopied(false), 2000);
    } catch (_) {
      // noop
    }
  }
  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);
  return (
    <>
      <Tooltip title={copied ? "Copied!" : "Copy event ID"}>
        <IconButton aria-label="Copy event ID" size="small" onClick={copy}>
          {copied ? (
            <CheckCircleIcon
              fontSize="inherit"
              sx={{ color: "success.main" }}
            />
          ) : (
            <ContentCopyIcon fontSize="inherit" />
          )}
        </IconButton>
      </Tooltip>
    </>
  );
}
