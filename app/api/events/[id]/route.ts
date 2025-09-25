import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  // Ensure the user owns the event
  const { data: ev } = await supabase
    .from("events")
    .select("id, created_by")
    .eq("id", params.id)
    .maybeSingle();
  if (!ev || ev.created_by !== user.id) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  // Delete event cascades to participants due to FK on delete cascade
  const { error } = await supabase.from("events").delete().eq("id", params.id);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = getSupabaseServer();
  const { data } = await supabase
    .from("events")
    .select("id")
    .eq("id", params.id)
    .maybeSingle();
  return NextResponse.json({ exists: !!data });
}
