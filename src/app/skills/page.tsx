"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import SkillsCarousel from "../components/SkillsCarousel";

type Skill = {
  name: string;
  icon: string; // Font Awesome class
  color?: string; // Tailwind color class
  level?: "Expert" | "Advanced" | "Intermediate" | "Beginner";
  category: "Frontend" | "Backend" | "Cloud & DevOps" | "Mobile" | "Data & Tools" | "Testing";
};

const TOP_SKILLS: Skill[] = [
  { name: "React", icon: "fab fa-react", color: "text-blue-400", level: "Expert", category: "Frontend" },
  { name: "TypeScript", icon: "fab fa-js", color: "text-blue-500", level: "Advanced", category: "Frontend" },
  { name: "Next.js", icon: "fab fa-react", color: "text-slate-300", level: "Advanced", category: "Frontend" },
  { name: "Node.js", icon: "fab fa-node", color: "text-green-500", level: "Advanced", category: "Backend" },
  { name: "Python", icon: "fab fa-python", color: "text-blue-300", level: "Advanced", category: "Backend" },
  { name: "AWS", icon: "fab fa-aws", color: "text-orange-400", level: "Advanced", category: "Cloud & DevOps" },
];

const ALL_SKILLS: Skill[] = [
  ...TOP_SKILLS,
  { name: "JavaScript", icon: "fab fa-js", color: "text-yellow-400", level: "Expert", category: "Frontend" },
  { name: "Tailwind CSS", icon: "fab fa-css3-alt", color: "text-cyan-400", level: "Advanced", category: "Frontend" },
  { name: "Redux", icon: "fas fa-sync-alt", color: "text-purple-400", level: "Advanced", category: "Frontend" },
  { name: "HTML5", icon: "fab fa-html5", color: "text-orange-500", level: "Expert", category: "Frontend" },
  { name: "CSS3", icon: "fab fa-css3-alt", color: "text-blue-500", level: "Advanced", category: "Frontend" },

  { name: "Express", icon: "fas fa-server", color: "text-emerald-400", level: "Advanced", category: "Backend" },
  { name: "GraphQL", icon: "fas fa-project-diagram", color: "text-pink-400", level: "Intermediate", category: "Backend" },
  { name: "PostgreSQL", icon: "fas fa-database", color: "text-sky-400", level: "Advanced", category: "Backend" },
  { name: "MongoDB", icon: "fas fa-leaf", color: "text-green-400", level: "Advanced", category: "Backend" },
  { name: "REST APIs", icon: "fas fa-plug", color: "text-indigo-400", level: "Expert", category: "Backend" },

  { name: "Docker", icon: "fab fa-docker", color: "text-sky-500", level: "Advanced", category: "Cloud & DevOps" },
  { name: "CI/CD (GitHub Actions)", icon: "fas fa-code-branch", color: "text-zinc-300", level: "Advanced", category: "Cloud & DevOps" },
  { name: "Vercel", icon: "fas fa-rocket", color: "text-fuchsia-400", level: "Advanced", category: "Cloud & DevOps" },

  { name: "React Native", icon: "fab fa-react", color: "text-indigo-300", level: "Intermediate", category: "Mobile" },

  { name: "Firebase", icon: "fas fa-fire", color: "text-amber-500", level: "Intermediate", category: "Data & Tools" },
  { name: "Redis", icon: "fas fa-bolt", color: "text-red-400", level: "Intermediate", category: "Data & Tools" },
  { name: "Jest", icon: "fas fa-vial", color: "text-rose-400", level: "Advanced", category: "Testing" },
  { name: "Playwright", icon: "fas fa-robot", color: "text-lime-400", level: "Intermediate", category: "Testing" },
  { name: "Git", icon: "fab fa-git-alt", color: "text-orange-500", level: "Expert", category: "Data & Tools" },
];

const CATEGORIES: Array<Skill["category"] | "All"> = [
  "All",
  "Frontend",
  "Backend",
  "Cloud & DevOps",
  "Mobile",
  "Data & Tools",
  "Testing",
];

// Small helper to create clean URLs like "react-native", "node-js", etc.
const slugify = (s: string) =>
  encodeURIComponent(
    s
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/\+/g, "plus")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  );

export default function SkillsPage() {
  const [activeCat, setActiveCat] = useState<typeof CATEGORIES[number]>("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL_SKILLS.filter((s) => {
      const inCat = activeCat === "All" || s.category === activeCat;
      const inQuery =
        !q || s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q);
      return inCat && inQuery;
    });
  }, [activeCat, query]);

  return (
    <main className="pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* ===== Top Banner ===== */}
        <section className="relative overflow-hidden mac-card rounded-2xl p-8 md:p-12 mb-12">
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-gradient-to-tr from-[var(--accent)]/30 via-transparent to-[var(--accent)]/20" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Skills & Tech <span className="text-gradient">I use daily</span>
              </h1>
              <p className="text-[var(--text-secondary)]">
                From design-friendly frontends to scalable cloud backends, here are the tools I’m
                most productive with — and the broader stack I reach for in real projects.
              </p>
            </div>
            <Link
              href="/projects"
              className="mac-button px-6 py-3 rounded-lg font-medium whitespace-nowrap"
            >
              Explore Projects
            </Link>
          </div>
        </section>

        {/* ===== Top Skills slider (6 visible) ===== */}
        <section className="mb-12">
          <SkillsCarousel title="Top skills" skills={TOP_SKILLS} perPage={6} autoPlayMs={3500} />
        </section>

        {/* ===== Controls for All skills ===== */}
        <section className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <h2 className="text-2xl md:text-3xl font-semibold">All skills</h2>
            <div className="flex flex-col md:flex-row gap-3 md:items-center">
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setActiveCat(c)}
                    className={`px-3 py-1 rounded-lg border transition ${
                      activeCat === c
                        ? "border-[var(--accent)] text-[var(--accent)]"
                        : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]/60"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <div className="relative">
                <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
                <input
                  className="pl-9 pr-3 py-2 rounded-lg border bg-transparent border-[var(--border)] focus:outline-none focus:border-[var(--accent)]"
                  placeholder="Search skills…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ===== All skills grid (mac-cards, badges) ===== */}
        <section>
          {filtered.length === 0 ? (
            <div className="text-[var(--text-secondary)]">No skills match your filter.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {filtered.map((s, i) => {
                const href = `/skills/${slugify(s.name)}`; // redirect target
                return (
                  <Link
                    key={`${s.name}-${i}`}
                    href={href}
                    className="tech-icon mac-card p-4 md:p-6 rounded-xl flex flex-col items-center justify-center text-center hover:shadow-lg hover:-translate-y-0.5 transition"
                    aria-label={`View details for ${s.name}`}
                  >
                    <i className={`${s.icon} text-3xl md:text-4xl mb-2 ${s.color ?? ""}`} />
                    <span className="font-medium">{s.name}</span>
                    <div className="mt-2 text-xs text-[var(--text-secondary)]">{s.category}</div>
                    {s.level && (
                      <span className="mt-3 inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md border border-[var(--border)]">
                        <i className="fas fa-star" />
                        {s.level}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* ===== CTA ===== */}
        <section className="mt-14">
          <div className="mac-card rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl md:text-2xl font-semibold">Want the full stack story?</h3>
              <p className="text-[var(--text-secondary)]">
                Check selected projects where these skills solved real problems with measurable impact.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/projects" className="mac-button px-5 py-3 rounded-lg font-medium">
                View Projects
              </Link>
              <Link
                href="/contact"
                className="border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--bg-primary)] px-5 py-3 rounded-lg font-medium transition"
              >
                Contact Me
                </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
