"use client";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";

export default function CreateEventButton() {
  const router = useRouter();

  function onClick() {
    router.push("/event/new");
  }

  return (
    <Button variant="contained" onClick={onClick}>
      Create Event
    </Button>
  );
}
