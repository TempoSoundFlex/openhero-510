import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.slug || !body?.sessionId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const { slug, category, name, sessionId } = body;
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("toggle_video_like", {
    p_slug: slug,
    p_category: category ?? "",
    p_name: name ?? "",
    p_session_id: sessionId,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ liked: data });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  const sessionId = searchParams.get("sessionId");

  if (!slug || !sessionId) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_video_stats", {
    p_slug: slug,
    p_session_id: sessionId,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const row = Array.isArray(data) ? data[0] : data;
  return NextResponse.json({
    views: row?.views_count ?? 0,
    likes: row?.likes_count ?? 0,
    liked: row?.is_liked ?? false,
  });
}
