import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import fs from "fs";
import path from "path";
import { getNextjsCode, getHtmlCode } from "@/lib/hero-templates";
import { slugToName } from "@/lib/utils";

type Format = "nextjs" | "html";

const FORMAT_CONFIG: Record<Format, { filename: string; staticFile: string }> = {
  nextjs: { filename: "page.tsx", staticFile: "page.tsx" },
  html: { filename: "index.html", staticFile: "index.html" },
};

const R2_BASE = "https://videos.openhero.art";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") ?? "";
  const slug = searchParams.get("slug") ?? "";
  const format = (searchParams.get("format") ?? "nextjs") as Format;

  if (!category || !slug || !FORMAT_CONFIG[format]) {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  }

  const name = slugToName(slug);
  const { filename, staticFile } = FORMAT_CONFIG[format];

  const downloadsDir = path.join(process.cwd(), "public", "downloads", category, slug);
  const staticFilePath = path.join(downloadsDir, staticFile);

  let code: string;
  if (fs.existsSync(staticFilePath)) {
    code = fs.readFileSync(staticFilePath, "utf-8");
  } else {
    const opts = { name, slug, videoSrc: "", category };
    code = format === "html" ? getHtmlCode(opts) : getNextjsCode(opts);
  }

  const zip = new JSZip();
  const folder = zip.folder(`${slug}-${format}`) as JSZip;
  folder.file(filename, code);

  const r2VideoUrl = `${R2_BASE}/downloads/${category}/${slug}/video.mp4`;
  let videoArrayBuffer: ArrayBuffer | null = null;
  try {
    const videoRes = await fetch(r2VideoUrl);
    if (videoRes.ok) videoArrayBuffer = await videoRes.arrayBuffer();
  } catch {
  }

  if (videoArrayBuffer) {
    folder.file("video.mp4", new Uint8Array(videoArrayBuffer));
  } else {
    folder.file(
      "README.txt",
      [
        `Hero: ${name}`,
        `Category: ${category}`,
        ``,
        `Video source (Cloudflare R2):`,
        `  ${r2VideoUrl}`,
        ``,
        `To use:`,
        `  1. Download the video from the URL above (or provide your own).`,
        `  2. Rename it to: video.mp4`,
        `  3. Place it in the same folder as ${filename}`,
        `  4. The code already references "./video.mp4" (relative path).`,
      ].join("\n"),
    );
  }

  const buffer = await zip.generateAsync({ type: "arraybuffer", compression: "DEFLATE" });

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${slug}-${format}.zip"`,
      "Cache-Control": "no-store",
    },
  });
}

