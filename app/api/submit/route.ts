import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import JSZip from "jszip";
import { createHash } from "crypto";
import { env } from "@/lib/env";

const MAX_ZIP_SIZE = 5 * 1024 * 1024;   // 5 MB
const MAX_VIDEO_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_HTML_SIZE = 2 * 1024 * 1024;  // 2 MB
const RATE_LIMIT_MAX = 2;
const RATE_LIMIT_WINDOW_DAYS = 30;

function getIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

function hashIp(ip: string): string {
  const salt = env.security.ipHashSalt;
  return createHash("sha256").update(ip + salt).digest("hex");
}

export async function POST(req: NextRequest) {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const title = (formData.get("title") as string | null)?.trim();
  const description = (formData.get("description") as string | null)?.trim() ?? "";
  const file = formData.get("file") as File | null;

  if (!title || title.length < 3 || title.length > 100) {
    return NextResponse.json(
      { error: "Title must be between 3 and 100 characters" },
      { status: 400 },
    );
  }

  if (!file || (file.type !== "application/zip" && !file.name.endsWith(".zip"))) {
    return NextResponse.json(
      { error: "File must be a .zip archive" },
      { status: 400 },
    );
  }

  if (file.size > MAX_ZIP_SIZE) {
    return NextResponse.json(
      { error: "ZIP file must not exceed 5 MB" },
      { status: 400 },
    );
  }

  const ip = getIp(req);
  const ipHash = hashIp(ip);
  const supabase = await createClient();

  const { data: rateRow } = await supabase
    .from("submission_rate_limits")
    .select("count, window_start")
    .eq("ip_hash", ipHash)
    .maybeSingle();

  if (rateRow) {
    const windowStart = new Date(rateRow.window_start);
    const diffDays = (Date.now() - windowStart.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays < RATE_LIMIT_WINDOW_DAYS && rateRow.count >= RATE_LIMIT_MAX) {
      return NextResponse.json(
        {
          error: `You have reached the limit of ${RATE_LIMIT_MAX} submissions per ${RATE_LIMIT_WINDOW_DAYS} days. Try again later.`,
        },
        { status: 429 },
      );
    }
  }

  const arrayBuffer = await file.arrayBuffer();
  let zip: JSZip;

  try {
    zip = await JSZip.loadAsync(arrayBuffer);
  } catch {
    return NextResponse.json(
      { error: "Could not read the ZIP file. Make sure it is a valid archive." },
      { status: 400 },
    );
  }

  const actualFiles = Object.values(zip.files).filter(f => !f.dir);

  if (actualFiles.length > 2) {
    return NextResponse.json(
      { error: "ZIP must contain a maximum of 2 files (1 HTML and optionally 1 MP4)." },
      { status: 400 },
    );
  }

  const hasInvalidExtensions = actualFiles.some(f => {
    const lowerName = f.name.toLowerCase();
    return !lowerName.endsWith(".html") && !lowerName.endsWith(".mp4");
  });

  if (hasInvalidExtensions) {
    return NextResponse.json(
      { error: "ZIP contains invalid files. Only .html and .mp4 extensions are allowed." },
      { status: 400 },
    );
  }

  const htmlEntry = Object.entries(zip.files).find(
    ([name]) => name === "index.html" || name.endsWith("/index.html"),
  );

  const videoEntry = Object.entries(zip.files).find(
    ([name]) => name.toLowerCase().endsWith(".mp4"),
  );

  if (!htmlEntry) {
    return NextResponse.json(
      { error: "ZIP must contain an index.html file" },
      { status: 400 },
    );
  }

  const htmlBuffer = await htmlEntry[1].async("arraybuffer");

  if (htmlBuffer.byteLength > MAX_HTML_SIZE) {
    return NextResponse.json(
      { error: "index.html must not exceed 2 MB" },
      { status: 400 },
    );
  }

  if (videoEntry) {
    const videoBuffer = await videoEntry[1].async("arraybuffer");
    if (videoBuffer.byteLength > MAX_VIDEO_SIZE) {
      return NextResponse.json(
        { error: "The .mp4 file must not exceed 5 MB" },
        { status: 400 },
      );
    }
  }

  const htmlText = new TextDecoder().decode(htmlBuffer);

  if (/<script[^>]*src\s*=\s*["'][^"']*["']/i.test(htmlText)) {
    const allowedDomains = [
      "cdn.tailwindcss.com",
      "cdnjs.cloudflare.com",
      "unpkg.com",
      "cdn.jsdelivr.net",
      "esm.sh",
      "cdn.skypack.dev",
      "jspm.dev",
      "esm.run",
      "deno.land",
      "iconify.design",
      "code.iconify.design",
      "fontawesome.com",
      "use.fontawesome.com",
      "kit.fontawesome.com",
      "ka-f.fontawesome.com",
      "unpkg.com/boxicons",
      "cdn.linearicons.com",
      "unpkg.com/lucide",
      "googleapis.com",
      "fonts.googleapis.com",
      "gstatic.com",
      "fonts.gstatic.com",
      "maps.googleapis.com",
      "code.jquery.com",
      "stackpath.bootstrapcdn.com",
      "maxcdn.bootstrapcdn.com",
      "cdn.spline.design",
      "threejs.org",
      "cdn.babylonjs.com",
      "cdn.plot.ly",
      "d3js.org",
      "unpkg.com/@lottiefiles",
      "js.stripe.com",
      "www.paypal.com",
      "checkout.razorpay.com",
      "www.googletagmanager.com",
      "www.google-analytics.com",
      "tailwindcss.com",
      "cloudflare.com",
      "yastatic.net",
      "vimeo.com",
      "youtube.com",
      "player.vimeo.com",
      "www.youtube.com",
      "://githack.com",
      "cdn.pixi.js",
      "pixijs.download",
      "://amcharts.com",
      "://carbonads.com",
      "cdn.p5js.org",
      "cdnjs.com",
      "cdn.socket.io",
      "://supabase.com",
      "cdn.sanity.io",
      "://framer.com",
      "framer.com",
      "assets.codepen.io",
      "://shopify.com",
      "://unsplash.com",
      "://paddle.com",
      "://intercomcdn.com",
      "://zdassets.com",
      "connect.facebook.net",
      "://twitter.com",
      "://verify.com",
      "cdn.builder.io",
      "://segment.com",
      "://mxpnl.com",
      "://amplitude.com",
      "://heapanalytics.com",
      "://hotjar.com",
      "://mouseflow.com",
      "://luckyorange.com",
      "://fullstory.com",
      "cdn.sentry.io",
      "://bugsnag.com",
      "://logrocket.com",
      "://newrelic.com",
      "://datadoghq.com",
      "cdn.split.io",
      "://optimizely.com",
      "://vwo.com",
      "://adroll.com",
      "://criteo.com",
      "://taboola.com",
      "://outbrain.com",
      "cdn.doubleclick.net",
      "://adnxs.com",
      "://pubmatic.com",
      "://rubiconproject.com",
      "cdn.openx.net",
      "://casalemedia.com",
      "://yieldmo.com",
      "://triplelift.com",
      "://sharethrough.com",
      "://nativo.com",
      "://gumgum.com",
      "://teads.com",
      "://kargo.com",
      "cdn.ogury.io",
      "://inmobi.com",
      "://mopub.com",
      "://applovin.com",
      "://unityads.com",
      "://ironsrc.com",
      "://vungle.com",
      "://chartboost.com",
      "://adcolony.com",
      "://tapjoy.com",
      "://fyber.com",
      "://digitalocean.com",
      "://linode.com",
      "://vultr.com",
      "://heroku.com",
      "cdn.netlify.app",
      "cdn.vercel.app",
      "://firebase.com",
      "://auth0.com",
      "cdn.clerk.dev",
      "://stytch.com",
      "cdn.magic.link",
      "://okta.com",
      "://onelogin.com",
      "://pingidentity.com",
      "://duosecurity.com",
      "://twilio.com",
      "cdn.sendgrid.net",
      "cdn.mailgun.net",
      "://postmarkapp.com",
      "://mandrillapp.com",
      "://sparkpostmail.com",
      "://mailchimp.com",
      "://constantcontact.com",
      "://aweber.com",
      "://getresponse.com",
      "://activecampaign.com",
      "://hubspot.com",
      "://marketo.com",
      "://pardot.com",
      "://salesforce.com",
      "://zendesk.com",
      "://freshdesk.com",
      "cdn.helpscout.net",
      "://drift.com",
      "://olark.com",
      "cdn.tawk.to",
      "cdn.crisp.chat",
      "://frontapp.com",
      "://slack.com",
      "://discordapp.com",
      "://microsoft.com",
      "://visualstudio.com",
      "://github.com",
      "://gitlab.com",
      "cdn.bitbucket.org",
      "://atlassian.com",
      "://trello.com",
      "://asana.com",
      "://monday.com",
      "cdn.notion.so",
      "://airtable.com",
      "://zapier.com",
      "://make.com",
      "://integromat.com",
      "://retool.com",
      "cdn.bubble.io",
      "://webflow.com"
    ];

    const scriptSrcs = [...htmlText.matchAll(/<script[^>]*src\s*=\s*["']([^"']*)["']/gi)].map(
      (m) => m[1]
    );

    const hasDisallowed = scriptSrcs.some(
      (src) => !allowedDomains.some((d) => src.includes(d))
    );

    if (hasDisallowed) {
      return NextResponse.json(
        { error: "index.html contains external scripts from non-allowed domains. Please use standard CDNs (JSDelivr, UNPKG, Cloudflare, etc.)." },
        { status: 400 }
      );
    }
  }

  const timestamp = Date.now();
  const storagePath = `submissions/${timestamp}-${ipHash.slice(0, 8)}.zip`;

  const { error: storageError } = await supabase.storage
    .from("submissions")
    .upload(storagePath, new Uint8Array(arrayBuffer), {
      contentType: "application/zip",
      upsert: false,
    });

  if (storageError) {
    return NextResponse.json(
      { error: "Failed to store the file. Please try again." },
      { status: 500 },
    );
  }

  const { error: insertError } = await supabase.from("hero_submissions").insert({
    title,
    description: description || null,
    file_path: storagePath,
    ip_hash: ipHash,
    status: "pending",
  });

  if (insertError) {
    await supabase.storage.from("submissions").remove([storagePath]);
    return NextResponse.json({ error: "Failed to save submission" }, { status: 500 });
  }

  if (!rateRow) {
    await supabase.from("submission_rate_limits").insert({
      ip_hash: ipHash,
      count: 1,
      window_start: new Date().toISOString(),
    });
  } else {
    const windowStart = new Date(rateRow.window_start);
    const diffDays = (Date.now() - windowStart.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays >= RATE_LIMIT_WINDOW_DAYS) {
      await supabase
        .from("submission_rate_limits")
        .update({ count: 1, window_start: new Date().toISOString() })
        .eq("ip_hash", ipHash);
    } else {
      await supabase
        .from("submission_rate_limits")
        .update({ count: rateRow.count + 1 })
        .eq("ip_hash", ipHash);
    }
  }

  return NextResponse.json({ ok: true, message: "Submission received! We'll review it soon." });
}