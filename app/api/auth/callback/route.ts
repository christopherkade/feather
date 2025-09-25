import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";
  const origin = new URL(request.url).origin;
  try {
    if (!code) {
      return NextResponse.redirect(new URL(`/?error=missing_code`, origin));
    }
    const supabase = getSupabaseServer();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("OAuth exchange error:", error.message);
      return NextResponse.redirect(new URL(`/?error=exchange_failed`, origin));
    }
    return NextResponse.redirect(new URL(next, origin));
  } catch (err: any) {
    console.error("/api/auth/callback failed:", err?.message ?? err);
    return NextResponse.redirect(new URL(`/?error=server_error`, origin));
  }
}
