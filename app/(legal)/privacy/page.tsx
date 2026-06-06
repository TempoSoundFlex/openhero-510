import Link from "next/link";
import { Icon } from "@iconify/react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for openhero - learn how we handle data on the free cinematic hero gallery.",
};

const LAST_UPDATED = "May 11, 2026";

const sections = [
  {
    n: "01",
    title: "Introduction",
    content:
      "openhero (\"we\", \"the Service\") is committed to protecting your privacy. This policy explains what minimal data we collect, how we use it, and the choices you have. openhero does not require account creation and does not collect personal information beyond what is strictly necessary to operate the platform.",
  },
  {
    n: "02",
    title: "Data We Collect",
    content: "We collect the following data:",
    items: [
      "Anonymous session ID - a random UUID generated and stored in your browser's localStorage to track likes and view counts per session. It is never linked to your identity.",
      "IP address hash - a one-way salted hash of your IP address used exclusively for submission rate-limiting (max 2 per 30 days). The raw IP is never stored.",
      "Interaction events - when you view or like a video, we record the video slug, category, and name alongside your session ID. No personal identifiers are involved.",
      "Submitted content - if you voluntarily submit a hero section, we store the ZIP file, title, and description you provide.",
    ],
  },
  {
    n: "03",
    title: "How We Use Data",
    content: "Data collected is used only for the following purposes:",
    items: [
      "Displaying accurate view and like counts on video cards",
      "Preventing duplicate likes from the same session",
      "Enforcing submission rate limits to prevent abuse",
      "Reviewing and publishing community-submitted hero sections",
    ],
  },
  {
    n: "04",
    title: "Data Storage and Security",
    content:
      "All data is stored in Supabase (a GDPR-compliant cloud database). Access is restricted via Row Level Security policies. Server-side functions run with SECURITY DEFINER to bypass RLS safely.",
    highlight: {
      icon: "solar:shield-check-linear",
      title: "IP Privacy",
      body: "Raw IP addresses are never stored. Only a salted one-way hash is persisted for rate-limiting and cannot be reversed to identify you.",
    },
  },
  {
    n: "05",
    title: "Cookies and Local Storage",
    content: "openhero does not use tracking cookies. We use:",
    items: [
      "localStorage (session ID) - persisted in your browser until you clear site data",
      "No analytics cookies, advertising cookies, or cross-site trackers",
      "No third-party cookie SDKs",
    ],
  },
  {
    n: "06",
    title: "Third-Party Services",
    content: "The following third-party services may process data when you use openhero:",
    items: [
      "Supabase - database and storage backend (supabase.com/privacy)",
      "Vercel - hosting and edge network (vercel.com/legal/privacy-policy)",
      "Google Fonts - font delivery via CSS import (may log font requests)",
    ],
  },
  {
    n: "07",
    title: "Your Rights",
    content:
      "Because we do not collect personal data, most data subject rights are not applicable. However, if you believe data related to your session ID should be removed, contact us and we will delete it within 30 days.",
  },
  {
    n: "08",
    title: "Data Retention",
    content:
      "Session-based interaction data is retained indefinitely to maintain accurate statistics. Submission rate-limit records are automatically purged after 30 days. Submitted hero content is retained until reviewed; rejected submissions are deleted.",
  },
  {
    n: "09",
    title: "Children",
    content:
      "openhero is not directed at children under 13. We do not knowingly collect any information from children.",
  },
  {
    n: "10",
    title: "Changes to This Policy",
    content:
      "We may update this Privacy Policy from time to time. The last updated date at the top reflects any changes. Continued use after changes constitutes acceptance of the revised policy.",
  },
  {
    n: "11",
    title: "Contact",
    content:
      "Questions about this Privacy Policy? Reach out via the contact information available on openhero.art. We aim to respond within 7 business days.",
  },
];

type Section = (typeof sections)[number];

export default function PrivacyPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <nav className="mb-10" aria-label="Breadcrumb">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-white"
          >
            <Icon icon="solar:arrow-left-linear" width="15" aria-hidden="true" />
            Back to home
          </Link>
        </nav>

        <div className="mb-8 rounded-2xl bg-white/3 ring-1 ring-white/10 p-6">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
            <Icon icon="solar:shield-check-linear" width="12" className="text-white/40" />
            <span className="text-[10px] uppercase tracking-widest text-white/40">Legal</span>
          </div>
          <h1 className="text-2xl font-semibold text-white sm:text-3xl">Privacy Policy</h1>
          <p className="mt-2 text-sm text-white/40">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-4">
          <Icon icon="solar:lock-password-linear" width="16" className="mt-0.5 shrink-0 text-emerald-400/70" />
          <p className="text-sm leading-relaxed text-white/50">
            openhero collects <span className="text-white/80">no personal data</span>. No account required, no tracking cookies, no ads. Only an anonymous session ID and an IP hash for rate limiting.
          </p>
        </div>

        <div className="space-y-3">
          {sections.map((s: Section) => (
            <div
              key={s.n}
              className="rounded-2xl bg-white/3 ring-1 ring-white/10 p-5 transition-colors hover:bg-white/5"
            >
              <div className="mb-3 flex items-center gap-3">
                <span className="font-mono text-[11px] text-white/20">{s.n}</span>
                <h2 className="text-sm font-semibold text-white">{s.title}</h2>
              </div>
              <p className="text-sm leading-relaxed text-white/55">{s.content}</p>

              {s.items && (
                <ul className="mt-3 space-y-1.5">
                  {s.items.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-white/45">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-white/20" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              {s.highlight && (
                <div className="mt-4 flex items-start gap-3 rounded-xl border border-emerald-500/15 bg-emerald-500/5 p-3">
                  <Icon icon={s.highlight.icon} width="14" className="mt-0.5 shrink-0 text-emerald-400/70" />
                  <div>
                    <p className="text-xs font-semibold text-emerald-400/80">{s.highlight.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-white/40">{s.highlight.body}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl bg-white/2 ring-1 ring-white/8 p-5">
          <p className="text-sm text-white/35">
            By using openhero you also agree to our{" "}
            <Link href="/terms" className="text-white/70 underline underline-offset-2 transition-colors hover:text-white">
              Terms of Service
            </Link>
            . Both documents together constitute the full agreement between you and openhero.
          </p>
        </div>
      </div>
    </div>
  );
}
