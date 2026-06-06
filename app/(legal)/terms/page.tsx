import Link from "next/link";
import { Icon } from "@iconify/react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for openhero - the free cinematic video hero section gallery.",
};

const LAST_UPDATED = "May 11, 2026";

const sections = [
  {
    n: "01",
    title: "Acceptance of Terms",
    content:
      "By accessing or using openhero (\"the Service\"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service. Continued use of the Service after any changes constitutes your acceptance of the new terms.",
  },
  {
    n: "02",
    title: "Description of Service",
    content:
      "openhero is a free gallery of cinematic video hero sections and background images. The Service provides:",
    items: [
      "Browsing and previewing full-screen video hero sections",
      "Downloading video files and production-ready source code (HTML, Next.js)",
      "Access to a curated library of 272+ background images",
      "The ability to submit your own hero sections for community review",
    ],
  },
  {
    n: "03",
    title: "Intellectual Property",
    content:
      "All videos, images, and source code available on openhero are provided for free personal and commercial use unless otherwise noted. You may not redistribute the assets as a standalone product, resell them as stock content, or claim authorship. Submitted content remains the property of the original creator; by submitting you grant openhero a non-exclusive license to display it.",
  },
  {
    n: "04",
    title: "Acceptable Use",
    content: "When using the Service you agree not to:",
    items: [
      "Use automated scrapers or bots to bulk-download content",
      "Submit content that infringes third-party intellectual property rights",
      "Attempt to reverse-engineer or disrupt the platform infrastructure",
      "Upload malicious files, exploits, or harmful code through the submission system",
    ],
  },
  {
    n: "05",
    title: "User Submissions",
    content:
      "Content submitted to openhero is subject to review before publication. We reserve the right to reject or remove any submission without notice. You are solely responsible for ensuring you hold the rights to any content you submit. Rate limits apply to prevent abuse (maximum 2 submissions per IP per 30 days).",
  },
  {
    n: "06",
    title: "Limitation of Liability",
    content:
      "The Service is provided \"as is\" without warranties of any kind. openhero is not liable for any damages arising from use of the Service, including but not limited to:",
    items: [
      "Loss of data or business interruption",
      "Errors or inaccuracies in the source code provided",
      "Temporary unavailability of downloads or the platform",
      "Third-party claims relating to submitted content",
    ],
  },
  {
    n: "07",
    title: "Modifications",
    content:
      "We reserve the right to modify these Terms at any time. Changes will be reflected by updating the \"Last updated\" date at the top of this page. Material changes will be announced on the platform.",
  },
  {
    n: "08",
    title: "Governing Law",
    content:
      "These Terms shall be governed by and construed in accordance with applicable law. Any disputes arising under these Terms shall be resolved through good-faith negotiation before pursuing formal legal action.",
  },
  {
    n: "09",
    title: "Contact",
    content:
      "If you have questions about these Terms, please reach out via the contact information available on openhero.art.",
  },
];

export default function TermsPage() {
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
            <Icon icon="solar:document-text-linear" width="12" className="text-white/40" />
            <span className="text-[10px] uppercase tracking-widest text-white/40">Legal</span>
          </div>
          <h1 className="text-2xl font-semibold text-white sm:text-3xl">Terms of Service</h1>
          <p className="mt-2 text-sm text-white/40">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="space-y-3">
          {sections.map((s) => (
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
                  {s.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-white/45">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-white/20" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl bg-white/2 ring-1 ring-white/8 p-5">
          <p className="text-sm text-white/35">
            By using openhero you also agree to our{" "}
            <Link href="/privacy" className="text-white/70 underline underline-offset-2 transition-colors hover:text-white">
              Privacy Policy
            </Link>
            . Both documents together constitute the full agreement between you and openhero.
          </p>
        </div>

      </div>
    </div>
  );
}

