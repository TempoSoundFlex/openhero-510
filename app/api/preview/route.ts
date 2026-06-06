import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const R2_BASE = "https://videos.openhero.art";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") ?? "";
  const slug = searchParams.get("slug") ?? "";

  if (!category || !slug) {
    return new NextResponse("Not found", { status: 404 });
  }

  const htmlPath = path.join(
    process.cwd(),
    "public",
    "downloads",
    category,
    slug,
    "index.html",
  );

  if (!fs.existsSync(htmlPath)) {
    return new NextResponse("Not found", { status: 404 });
  }

  // Downloads-folder videos live at downloads/{category}/{slug}/video.mp4 in R2.
  const r2VideoUrl = `${R2_BASE}/downloads/${category}/${slug}/video.mp4`;

  let html = fs.readFileSync(htmlPath, "utf-8");

  // Replace every variant of the local video src with the R2 URL.
  html = html
    .replace(/src=["']\.\/video\.mp4["']/gi, `src="${r2VideoUrl}"`)
    .replace(/src=["']\/video\.mp4["']/gi, `src="${r2VideoUrl}"`)
    .replace(/src=["']\/downloads\/[^"']+["']/gi, `src="${r2VideoUrl}"`);

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}

