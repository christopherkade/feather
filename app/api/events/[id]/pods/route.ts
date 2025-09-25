import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { assignToPods } from "@/lib/pods/assign";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  // Only event owner can assign
  const { data: event } = await supabase
    .from("events")
    .select("id, created_by")
    .eq("id", params.id)
    .maybeSingle();
  if (!event || event.created_by !== user.id)
    return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const { data: participants } = await supabase
    .from("event_participants_view")
    .select("user_id, username")
    .eq("event_id", params.id);
  const players = (participants ?? []).map((p) => ({
    id: p.user_id,
    name: p.username ?? p.user_id,
  }));
  const res = assignToPods(players, 4);
  if (!res.ok) return NextResponse.json({ error: res.error }, { status: 400 });

  // wipe previous pods
  await supabase.from("pods").delete().eq("event_id", params.id);
  // insert pods and members
  for (let i = 0; i < res.pods.length; i++) {
    const { data: pod, error: podError } = await supabase
      .from("pods")
      .insert({ event_id: params.id, index_in_event: i })
      .select("id")
      .single();
    if (podError)
      return NextResponse.json({ error: podError.message }, { status: 500 });
    const rows = res.pods[i].map((pl) => ({ pod_id: pod.id, user_id: pl.id }));
    const { error: membersError } = await supabase
      .from("pod_members")
      .insert(rows);
    if (membersError)
      return NextResponse.json(
        { error: membersError.message },
        { status: 500 }
      );
  }

  return NextResponse.json({ ok: true });
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = getSupabaseServer();
  const { data: pods } = await supabase
    .from("pods")
    .select("id, index_in_event")
    .eq("event_id", params.id)
    .order("index_in_event");
  if (!pods || pods.length === 0) return NextResponse.json({ pods: [] });
  const { data: members } = await supabase
    .from("pod_members")
    .select("pod_id, user_id");
  const { data: profiles } = await supabase
    .from("event_participants_view")
    .select("user_id, username")
    .eq("event_id", params.id);
  const nameById = new Map(
    (profiles ?? []).map((p) => [p.user_id, p.username ?? p.user_id] as const)
  );
  const membersByPod = new Map<string, { id: string; name: string }[]>();
  for (const m of members ?? []) {
    const arr = membersByPod.get(m.pod_id) ?? [];
    arr.push({ id: m.user_id, name: nameById.get(m.user_id) ?? m.user_id });
    membersByPod.set(m.pod_id, arr);
  }
  const result = pods.map((p) => ({
    index: p.index_in_event,
    players: membersByPod.get(p.id) ?? [],
  }));
  return NextResponse.json({ pods: result });
}
