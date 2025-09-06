import { NextRequest, NextResponse } from "next/server";
import { supaAdmin } from "@/lib/supabaseAdmin";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  const { data, error } = await supaAdmin
    .from("locations")
    .select("id,title,lat,lng,work_id")
    .eq("status", "published")
    .ilike("title", q ? `%${q}%` : "%")
    .limit(300);

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, items: data });
}
