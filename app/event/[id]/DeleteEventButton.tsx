"use client";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";

export default function DeleteEventButton({ id }: { id: string }) {
  const router = useRouter();
  async function onDelete() {
    if (!confirm("Delete this event? This cannot be undone.")) return;
    const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      const { error } = await res.json().catch(() => ({ error: "Unknown" }));
      alert(`Failed to delete: ${error}`);
    }
  }
  return (
    <Button color="error" variant="outlined" onClick={onDelete}>
      Delete Event
    </Button>
  );
}
