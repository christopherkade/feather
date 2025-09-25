"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase/client";
import { Snackbar, Alert } from "@mui/material";

export default function EventRealtime({
  id,
  selfName,
}: {
  id: string;
  selfName: string;
}) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<
    { id: number; message: string; severity: "info" | "error" }[]
  >([]);
  const didAnnounceJoin = useRef(false);
  const nextId = useRef(1);

  useEffect(() => {
    const supabase = getSupabaseClient();
    const channel = supabase
      .channel(`event-${id}`)
      .on("broadcast", { event: "joined" }, (payload) => {
        const name = (payload.payload as any)?.name as string | undefined;
        if (name) {
          const id = nextId.current++;
          setNotifications((prev) => [
            ...prev,
            { id, message: `${name} joined the event`, severity: "info" },
          ]);
        }
        router.refresh();
      })
      .on("broadcast", { event: "deleted" }, () => {
        router.push("/?eventDeleted=1");
      })
      .on("broadcast", { event: "left" }, (payload) => {
        const name = (payload.payload as any)?.name as string | undefined;
        const id = nextId.current++;
        setNotifications((prev) => [
          ...prev,
          {
            id,
            message: name
              ? `${name} left the event`
              : `A player left the event`,
            severity: "error",
          },
        ]);
        router.refresh();
      })
      .subscribe();

    // Announce this user's join once per mount
    if (!didAnnounceJoin.current) {
      didAnnounceJoin.current = true;
      supabase.channel(`event-${id}`).send({
        type: "broadcast",
        event: "joined",
        payload: { name: selfName },
      });
    }

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, router, selfName]);

  if (notifications.length === 0) return null;
  return (
    <>
      {notifications.map((n, index) => (
        <Snackbar
          key={n.id}
          open
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          onClose={() =>
            setNotifications((prev) => prev.filter((x) => x.id !== n.id))
          }
          sx={{ bottom: `${16 + index * 64}px !important` }}
        >
          <Alert
            severity={n.severity}
            variant="filled"
            onClose={() =>
              setNotifications((prev) => prev.filter((x) => x.id !== n.id))
            }
          >
            {n.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
}
