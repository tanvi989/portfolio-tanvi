// app/projects/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NoteCard, { type NoteCardProps } from "@/app/components/NoteCard"; // <- update path
// <- update path
import Link from "next/link";

// ========== Types ==========
type Link = { label: string; href: string; external?: boolean };
type Metric = { label: string; value: string };
type Section = { title: string; bullets: string[] };

type Project = {
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  gradient: string; // for hero bg
  stack: string[];
  metrics?: Metric[];
  features?: string[];
  links?: Link[];
  timeline?: string; // e.g. "Q1 2024 – Q3 2024"
  role?: string;     // e.g. "Frontend Engineer"
  responsibilities?: string[];
  challenges?: Section;
  outcomes?: Section;
  notes?: NoteCardProps[]; // attach your notes/case studies PDFs
};

// ========== Data Registry (sample projects) ==========
const PROJECTS: Record<string, Project> = {
  "analytics-dashboard": {
    slug: "analytics-dashboard",
    title: "Analytics Dashboard",
    tagline: "Next.js + RSC real-time analytics with streamed charts",
    summary:
      "A multi-tenant analytics dashboard leveraging React Server Components and streaming for sub-second TTFB, cached data fetching, and responsive charting with optimistic UI.",
    gradient: "from-indigo-500 via-sky-500 to-emerald-500",
    stack: ["Next.js (App Router & RSC)", "TypeScript", "Edge runtime", "Postgres", "Charting"],
    metrics: [
      { label: "TTFB", value: "↓ 40%" },
      { label: "LCP", value: "↓ 35%" },
      { label: "Uptime SLO", value: "99.9%" },
    ],
    features: [
      "Server Components with streaming data panes",
      "Incremental caching & revalidation",
      "Role-based dashboards and theming",
      "Optimistic UI for filters & drill-down",
    ],
    links: [
      { label: "Live Demo", href: "https://example.com/analytics", external: true },
      { label: "Case Study", href: "/projects/analytics-dashboard#case-study" },
    ],
    timeline: "2024 • 3 months",
    role: "Frontend Engineer",
    responsibilities: [
      "Built RSC-driven pages with streamed sections",
      "Set up caching & revalidation strategy",
      "Implemented responsive chart components",
    ],
    challenges: {
      title: "Key Challenges",
      bullets: [
        "Balancing caching with real-time freshness for charts",
        "Minimizing hydration costs with selective client boundaries",
        "Designing resilient loading states with Suspense",
      ],
    },
    outcomes: {
      title: "Outcomes",
      bullets: [
        "Sub-second TTFB on heavy dashboard routes",
        "35% improvement to LCP via image & font strategy",
        "Reusable chart primitives reduced code duplication",
      ],
    },
    notes: [
      {
        title: "RSC + Streaming in Production",
        desc: "Architecture overview and trade-offs for server-driven dashboards.",
        gradient: "from-sky-600 via-indigo-500 to-purple-600",
        tags: ["RSC", "Streaming", "Caching"],
        pdfUrl:
          "https://www.sathyabama.ac.in/sites/default/files/course-material/2020-10/UNIT4.pdf",
  
      },
    ],
  },

  "pdp-revamp": {
    slug: "pdp-revamp",
    title: "E-commerce PDP Revamp",
    tagline: "Suspense data fetching, image optimization, and A11y AA",
    summary:
      "Redesigned the product detail page with Suspense-based data fetching and a11y improvements, lifting conversion by 18% and improving CWV.",
    gradient: "from-fuchsia-500 via-pink-500 to-rose-500",
    stack: ["React", "Suspense", "Tailwind", "Image Optimization", "Accessibility"],
    metrics: [
      { label: "Conversion", value: "+18%" },
      { label: "CLS", value: "< 0.05" },
      { label: "Bundle", value: "↓ 28%" },
    ],
    features: [
      "Above-the-fold streaming data",
      "Responsive image sets and preloading",
      "Keyboard & screen reader parity",
    ],
    links: [
      { label: "Write-up", href: "/projects/pdp-revamp#case-study" },
    ],
    timeline: "2023 • 2 months",
    role: "React Developer",
    responsibilities: [
      "Refactored PDP with Suspense boundaries",
      "Set perf budgets & CI checks",
      "Ran a11y audit & fixes to AA",
    ],
    outcomes: {
      title: "Results",
      bullets: [
        "18% conversion lift on PDP",
        "CLS stabilized under 0.05",
        "Significant bundle reduction via code-splitting",
      ],
    },
  },

  "component-library": {
    slug: "component-library",
    title: "Component Library & Tokens",
    tagline: "Reusable UI system with Storybook docs and design tokens",
    summary:
      "A themable component library (dark/light) with motion guidelines and Storybook docs, used across multiple apps.",
    gradient: "from-amber-500 via-orange-500 to-red-500",
    stack: ["React", "TypeScript", "Storybook", "Design Tokens", "Tailwind"],
    features: [
      "40+ components with a11y baked-in",
      "Theming via tokens & CSS variables",
      "Docs, playgrounds, and usage recipes",
    ],
    links: [
      { label: "Storybook", href: "https://example.com/storybook", external: true },
    ],
    timeline: "2022 – 2024",
    role: "Frontend Engineer",
    responsibilities: [
      "API design and prop ergonomics",
      "A11y and keyboard interactions",
      "Docs & example integration recipes",
    ],
  },
};

// ========== Helpers ==========
const cn = (...s: (string | false | null | undefined)[]) => s.filter(Boolean).join(" ");
const toTitle = (s: string) =>
  s.replace(/[-_]/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());

// ========== Metadata ==========
type PageProps = { params: { slug: string } };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const key = params.slug.toLowerCase();
  const p = PROJECTS[key];
  if (!p) {
    return { title: `${toTitle(params.slug)} – Project`, description: "Project details." };
  }
  return {
    title: `${p.title} – Project`,
    description: p.tagline,
    alternates: { canonical: `/projects/${params.slug}` },
    openGraph: {
      title: `${p.title} – Project`,
      description: p.tagline,
      url: `/projects/${params.slug}`,
      siteName: "Portfolio",
      type: "article",
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(PROJECTS).map((slug) => ({ slug }));
}

// ========== Page ==========
export default function ProjectPage({ params }: PageProps) {
  const p = PROJECTS[params.slug.toLowerCase()];
  if (!p) notFound();

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 mt-10">
      {/* Hero */}
      <section className="mac-card mac-window rounded-xl overflow-hidden mb-6">
        <div className="mac-window-controls">
          <div className="mac-control mac-close" />
          <div className="mac-control mac-minimize" />
          <div className="mac-control mac-maximize" />
        </div>
        <div className={cn("h-40 md:h-56 bg-gradient-to-r", p.gradient)} />
        <div className="p-6">
          <h1 className="text-3xl md:text-4xl font-bold">{p.title}</h1>
          <p className="mt-2 text-[var(--muted-foreground,#6b7280)]">{p.tagline}</p>
        </div>
      </section>

      {/* Quick facts */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="mac-card rounded-xl p-4">
          <h3 className="text-sm opacity-80 mb-1">Timeline</h3>
          <div className="text-lg">{p.timeline ?? "—"}</div>
        </div>
        <div className="mac-card rounded-xl p-4">
          <h3 className="text-sm opacity-80 mb-1">Role</h3>
          <div className="text-lg">{p.role ?? "—"}</div>
        </div>
        <div className="mac-card rounded-xl p-4">
          <h3 className="text-sm opacity-80 mb-1">Key Metrics</h3>
          <div className="flex flex-wrap gap-2">
            {p.metrics?.length
              ? p.metrics.map((m, i) => (
                  <span key={i} className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs">
                    {m.label}: <span className="font-semibold ml-1">{m.value}</span>
                  </span>
                ))
              : <span className="text-sm opacity-70">—</span>}
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="mac-card rounded-xl p-5 mb-8">
        <h2 className="font-semibold mb-2">Summary</h2>
        <p className="leading-relaxed">{p.summary}</p>
      </section>

      {/* Stack + Features */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="mac-card rounded-xl p-5">
          <h2 className="font-semibold mb-3">Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {p.stack.map((t, i) => (
              <span key={i} className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs">
                {t}
              </span>
            ))}
          </div>
        </div>
        {p.features?.length ? (
          <div className="mac-card rounded-xl p-5">
            <h2 className="font-semibold mb-3">Key Features</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {p.features.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </div>
        ) : null}
      </section>

      {/* Responsibilities */}
      {p.responsibilities?.length ? (
        <section className="mac-card rounded-xl p-5 mb-8">
          <h2 className="font-semibold mb-3">What I did</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {p.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </section>
      ) : null}

      {/* Challenges & Outcomes */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {p.challenges ? (
          <div className="mac-card rounded-xl p-5">
            <h2 className="font-semibold mb-2">{p.challenges.title}</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {p.challenges.bullets.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          </div>
        ) : null}
        {p.outcomes ? (
          <div className="mac-card rounded-xl p-5">
            <h2 className="font-semibold mb-2">{p.outcomes.title}</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {p.outcomes.bullets.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          </div>
        ) : null}
      </section>

      {/* Notes / Case Studies */}
      {p.notes?.length ? (
        <section className="mb-10" id="case-study">
          <h2 className="font-semibold mb-3">Notes & Case Studies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {p.notes.map((n, i) => (
              <NoteCard
                key={i}
                title={n.title}
                desc={n.desc}
                gradient={n.gradient}
                tags={n.tags}
                pdfUrl={n.pdfUrl}
           
              />
            ))}
          </div>
        </section>
      ) : null}

      {/* Links */}
      {p.links?.length ? (
        <section className="flex flex-wrap gap-3 mt-6">
          {p.links.map((l, i) => (
            <Link
              key={i}
              href={l.href}
              target={l.external ? "_blank" : undefined}
              rel={l.external ? "noopener noreferrer" : undefined}
              className="mac-button px-4 py-2 rounded-lg"
            >
              {l.label}
            </Link>
          ))}
        </section>
      ) : null}

      {/* Footer */}
      <div className="mt-10">
        <Link href="/" className="underline opacity-80 hover:opacity-100">
          Back to home
        </Link>
      </div>
    </main>
  );
}
