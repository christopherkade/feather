"use client";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase/client";

export default function LeaveEventButton({
  id,
  userId,
  selfName,
}: {
  id: string;
  userId: string;
  selfName: string;
}) {
  const router = useRouter();
  async function onLeave() {
    const supabase = getSupabaseClient();
    await supabase
      .from("event_participants")
      .delete()
      .eq("event_id", id)
      .eq("user_id", userId);
    // Broadcast leave to notify others
    await supabase
      .channel(`event-${id}`)
      .send({ type: "broadcast", event: "left", payload: { name: selfName } });
    router.push("/dashboard");
    router.refresh();
  }
  return (
    <Button color="inherit" variant="text" onClick={onLeave}>
      Leave
    </Button>
  );
}
