import { getSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function Dashboard() {
  const supabase = getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");
  const { data: myParticipation } = await supabase
    .from("event_participants")
    .select("event_id")
    .eq("user_id", user.id);
  const { data: myOwned } = await supabase
    .from("events")
    .select("id")
    .eq("created_by", user.id);
  const ids = new Set<string>();
  for (const row of myParticipation ?? []) ids.add(row.event_id as string);
  for (const row of myOwned ?? []) ids.add(row.id as string);
  const eventIds = Array.from(ids);
  return (
    <DashboardClient userName={user.user_metadata?.name} eventIds={eventIds} />
  );
}
