import { getSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import crypto from "crypto";

function generateId() {
  return crypto.randomBytes(4).toString("hex");
}

export default async function NewEventPage() {
  const supabase = getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");
  const id = generateId();
  redirect(`/event/${id}?create=1`);
}
