import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.slug || !body?.category || !body?.name) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const { slug, category, name } = body;
  const supabase = await createClient();

  const { error } = await supabase.rpc("increment_video_views", {
    p_slug: slug,
    p_category: category,
    p_name: name,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
