import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  if (!q) return NextResponse.json({ data: [] });
  const res = await fetch(
    `https://api.scryfall.com/cards/search?q=${encodeURIComponent(q)}`
  );
  const json = await res.json();
  return NextResponse.json(json);
}
