

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProjectCard from "@/app/components/ProjectCard";
import Link from "next/link";
import NoteCard, { type NoteCardProps } from "@/app/components/NoteCard"; // path ok

// ---------- Types ----------
type TechStats = {
  yearsExperience: number;
  projectsDelivered: number;
  successRatePct: number;
  nps?: number;
  uptimeSLO?: string;
  performanceWins?: string[];
};

type ExperienceItem = { title: string; period: string; bullets: string[] };

type PortfolioProject = {
  title: string;
  desc: string;
  tags: string[];
  href: string;
  images: string[]; // <-- swapped from `gradient` to images
};

type TechInfo = {
  slug: string;
  name: string;
  short: string;
  description: string;
  homepage: string;
  badges?: string[];
  skills?: string[];
  stats?: TechStats;
  highlights?: string[];
  experience?: ExperienceItem[];
  projects?: PortfolioProject[];
  notes?: NoteCardProps[];
  install?: string;
  example?: { title: string; code: string; language?: "tsx" | "ts" | "js" | "bash" };
};

// ---------- Data ----------
const TECHS: Record<string, TechInfo> = {
  react: {
    slug: "react",
    name: "React",
    short: "A library for building user interfaces",
    description:
      "I build production React apps with Next.js (App Router/RSC), focusing on performance, a11y, and clean component APIs.",
    homepage: "https://react.dev",
    badges: ["Hooks", "Component-based", "RSC/SSR", "TypeScript"],
    skills: [
      "Hooks (useState/useEffect/useMemo/useCallback)",
      "React Server Components + App Router",
      "State: Zustand/Redux/Context",
      "Accessibility (WAI-ARIA) + Keyboard UX",
      "Testing (RTL, Vitest/Jest), Storybook",
      "Perf: memo, virtualization, code-splitting"
    ],
    stats: {
      yearsExperience: 3.5,
      projectsDelivered: 18,
      successRatePct: 96,
      nps: 72,
      uptimeSLO: "99.9%",
      performanceWins: ["LCP ↓35%", "Bundle size ↓28%", "TTFB ↓40% (SSR)"]
    },
    highlights: [
      "Led migration to Next.js App Router across 3 apps",
      "Built reusable UI library (40+ components)",
      "CLS < 0.05 with image & font strategy"
    ],
    experience: [
      {
        title: "Frontend Engineer • SaaS Dashboard",
        period: "2023 – Present",
        bullets: [
          "RSC streaming pages; cut SSR response ~40%",
          "Lighthouse a11y 100 on core screens",
          "Reduced hydration by selective client components"
        ]
      },
      {
        title: "React Developer • E-commerce",
        period: "2022 – 2023",
        bullets: [
          "Suspense + caching on PDP → +18% conversion",
          "Responsive images; perf budgets in CI",
          "Design tokens + Tailwind theming"
        ]
      }
    ],
    // ---- Projects (ProjectCard) ----
    projects: [
      {
        title: "Analytics Dashboard (Next.js + RSC)",
        desc: "Real-time metrics with server components, streamed charts, caching, optimistic UI.",
        tags: ["Next.js", "RSC", "Charts", "Edge"],
        href: "https://example.com/analytics",
        images: [
          "/images/projects/analytics/1.jpg",
          "/images/projects/analytics/2.jpg",
          "/images/projects/analytics/3.jpg",
          "/images/projects/analytics/4.jpg",
          "/images/projects/analytics/5.jpg"
        ]
      },
      {
        title: "E-commerce PDP Revamp",
        desc: "Suspense data fetching, image optimization, a11y fixes to AA, +18% conversion.",
        tags: ["React", "Suspense", "A11y"],
        href: "https://example.com/pdp-revamp",
        images: [
          "/images/projects/pdp/1.jpg",
          "/images/projects/pdp/2.jpg",
          "/images/projects/pdp/3.jpg",
          "/images/projects/pdp/4.jpg"
        ]
      },
      {
        title: "Component Library & Tokens",
        desc: "Design-system primitives, Storybook docs, dark mode, motion guidelines.",
        tags: ["Storybook", "Tailwind", "Design Tokens"],
        href: "https://example.com/library",
        images: [
          "/images/projects/library/1.jpg",
          "/images/projects/library/2.jpg",
          "/images/projects/library/3.jpg",
          "/images/projects/library/4.jpg"
        ]
      }
    ],
    // ---- Notes (NoteCard) ----
    notes: [
      {
        title: "React Hooks Quick Reference",
        desc: "Cheatsheet covering core hooks, rules of hooks, common patterns.",
        gradient: "from-blue-600 via-cyan-500 to-teal-500",
        tags: ["Hooks", "Rules of Hooks", "Patterns"],
        pdfUrl:
          "https://www.sathyabama.ac.in/sites/default/files/course-material/2020-10/UNIT4.pdf"
      },
      {
        title: "Performance & Memoization",
        desc: "Guide to useMemo/useCallback, React memo, when & why, gotchas.",
        gradient: "from-emerald-600 via-lime-500 to-yellow-500",
        tags: ["Performance", "Memo", "Renders"],
        pdfUrl:
          "https://www.sathyabama.ac.in/sites/default/files/course-material/2020-10/UNIT4.pdf"
      },
      {
        title: "RSC + App Router Deep Dive",
        desc: "Server components, streaming, caching and client boundaries.",
        gradient: "from-sky-600 via-indigo-500 to-purple-600",
        tags: ["RSC", "Next.js", "Streaming"],
        pdfUrl:
          "https://www.sathyabama.ac.in/sites/default/files/course-material/2020-10/UNIT4.pdf"
      }
    ],
    install: "npm install react react-dom",
    example: {
      title: "Minimal Hook Example",
      language: "tsx",
      code: `import { useMemo, useState, useCallback } from "react";

export default function PrimeCounter() {
  const [n, setN] = useState(1);
  const isPrime = useMemo(() => {
    for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
    return n > 1;
  }, [n]);
  const inc = useCallback(() => setN(v => v + 1), []);
  return <button onClick={inc}>n = {n} — {isPrime ? "prime ✅" : "not prime"}</button>;
}`
    }
  }
};

// ---------- Helpers ----------
const toTitle = (s: string) =>
  s.replace(/[-_]/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());

// ---------- Metadata ----------
type PageProps = { params: { slug: string } };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const tech = TECHS[params.slug.toLowerCase()];
  if (!tech) {
    return { title: `${toTitle(params.slug)} – Tech`, description: "Tech information page." };
  }
  return {
    title: `${tech.name} – Portfolio`,
    description: tech.short,
    alternates: { canonical: `/skills/${params.slug}` },
    openGraph: {
      title: `${tech.name} – Portfolio`,
      description: tech.short,
      url: `/skills/${params.slug}`,
      siteName: "Portfolio",
      type: "article"
    }
  };
}

export async function generateStaticParams() {
  return Object.keys(TECHS).map((slug) => ({ slug }));
}

// ---------- Page ----------
export default function SkillPage({ params }: PageProps) {
  const tech = TECHS[params.slug.toLowerCase()];
  if (!tech) notFound();

  const s = tech.stats;

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 mt-10">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">{tech.name}</h1>
            <p className="text-[var(--muted-foreground,#6b7280)] mt-1">{tech.short}</p>
          </div>
          <Link
            href={tech.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="mac-button px-4 py-2 rounded-lg"
          >
            Official Docs
          </Link>
        </div>
      </header>

      {/* Badges */}
      {tech.badges?.length ? (
        <div className="flex flex-wrap gap-2 mb-6">
          {tech.badges.map((b, i) => (
            <span key={i} className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs">
              {b}
            </span>
          ))}
        </div>
      ) : null}

      {/* About + Highlights */}
      <section className="mac-card rounded-xl p-5 mb-6">
        <h2 className="font-semibold mb-2">About my {tech.name} work</h2>
        <p className="leading-relaxed">{tech.description}</p>
        {tech.highlights?.length ? (
          <ul className="mt-3 list-disc pl-5 space-y-1">
            {tech.highlights.map((h, idx) => <li key={idx}>{h}</li>)}
          </ul>
        ) : null}
      </section>

      {/* Stats */}
      {s && (
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="mac-card rounded-xl p-4">
            <div className="text-2xl font-bold">{s.yearsExperience}+</div>
            <div className="text-sm opacity-80">Years with {tech.name}</div>
          </div>
          <div className="mac-card rounded-xl p-4">
            <div className="text-2xl font-bold">{s.projectsDelivered}</div>
            <div className="text-sm opacity-80">Projects Delivered</div>
          </div>
          <div className="mac-card rounded-xl p-4">
            <div className="text-2xl font-bold">{s.successRatePct}%</div>
            <div className="text-sm opacity-80">Success Rate</div>
          </div>
          <div className="mac-card rounded-xl p-4">
            <div className="text-2xl font-bold">{s.nps ?? 70}</div>
            <div className="text-sm opacity-80">NPS</div>
          </div>
        </section>
      )}

      {/* Skills */}
      {tech.skills?.length ? (
        <section className="mac-card rounded-xl p-5 mb-8">
          <h2 className="font-semibold mb-3">Core skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {tech.skills.map((sk, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                <p className="text-sm">{sk}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Experience */}
      {tech.experience?.length ? (
        <section className="mb-8">
          <h2 className="font-semibold mb-3">Experience</h2>
          <div className="space-y-4">
            {tech.experience.map((exp, i) => (
              <div key={i} className="mac-card rounded-xl p-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="font-medium">{exp.title}</h3>
                  <span className="text-xs opacity-70">{exp.period}</span>
                </div>
                <ul className="mt-2 list-disc pl-5 space-y-1 text-sm">
                  {exp.bullets.map((b, j) => <li key={j}>{b}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Projects — ProjectCard grid */}
      {tech.projects?.length ? (
        <section className="mb-10">
          <h2 className="font-semibold mb-3">Selected {tech.name} Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tech.projects.map((p, i) => (
              <ProjectCard
                key={i}
                title={p.title}
                desc={p.desc}
                tags={p.tags}
                href={p.href}
                images={p.images} // <-- pass images to the updated ProjectCard
              />
            ))}
          </div>
        </section>
      ) : null}

      {/* Notes — NoteCard grid */}
      {tech.notes?.length ? (
        <section className="mb-10">
          <h2 className="font-semibold mb-3">{tech.name} Notes & Guides</h2>
          <p className="text-sm opacity-80 mb-3">
            Quick references and deep dives I’ve written while building with {tech.name}.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tech.notes.map((n, i) => (
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

      {/* Dev bits */}
      {(tech.install || tech.example) && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {tech.install && (
            <div className="mac-card rounded-xl p-5">
              <h2 className="font-semibold mb-2">Install</h2>
              <pre className="overflow-auto rounded-lg border p-3 text-sm">
                <code>{tech.install}</code>
              </pre>
            </div>
          )}
          {tech.example && (
            <div className="mac-card rounded-xl p-5">
              <h2 className="font-semibold mb-2">{tech.example.title}</h2>
              <pre className="overflow-auto rounded-lg border p-3 text-sm">
                <code>{tech.example.code}</code>
              </pre>
            </div>
          )}
        </section>
      )}

      {/* Footer */}
      <footer className="flex items-center gap-3 mt-10">
        <Link
          href={tech.homepage}
          target="_blank"
          rel="noopener noreferrer"
          className="mac-button px-4 py-2 rounded-lg"
        >
          Official Docs
        </Link>
        <Link href="/" className="underline opacity-80 hover:opacity-100">
          Back to home
        </Link>
      </footer>
    </main>
  );
}
