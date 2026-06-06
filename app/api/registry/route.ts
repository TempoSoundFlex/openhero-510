import { NextResponse } from "next/server";
import registry from "@/public/registry.json";

export const runtime = "edge";

export function GET() {
  return NextResponse.json(registry, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
