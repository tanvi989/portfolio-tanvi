"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import ProjectCard from "../components/ProjectCard";

type Project = {
  title: string;
  desc: string;
  tags: string[];
  href: string;
  images: string[]; // 4–5 images per project
  featured?: boolean;
  date?: string; // YYYY-MM-DD for sorting
};

// Tip: replace these image paths with your actual assets.
const ALL_PROJECTS: Project[] = [
  {
    title: "E-Commerce Platform",
    desc: "A full-featured online shopping experience with cart, checkout, and order management.",
    tags: ["React", "Node.js", "MongoDB", "Stripe"],
    href: "/projects/ecommerce",
    featured: true,
    date: "2025-04-10",
    images: [
      "/images/ecommerce/1.jpg",
      "/images/ecommerce/2.jpg",
      "/images/ecommerce/3.jpg",
      "/images/ecommerce/4.jpg",
      "/images/ecommerce/5.jpg",
    ],
  },
  {
    title: "Task Management App",
    desc: "Kanban-style boards, real-time collaboration, and role-based access control.",
    tags: ["TypeScript", "React", "Firebase"],
    href: "/projects/task-manager",
    featured: true,
    date: "2024-11-20",
    images: [
      "/images/task-manager/1.jpg",
      "/images/task-manager/2.jpg",
      "/images/task-manager/3.jpg",
      "/images/task-manager/4.jpg",
    ],
  },
  {
    title: "Weather Dashboard",
    desc: "Real-time weather with radar maps, alerts, and location-based forecasts.",
    tags: ["JavaScript", "API", "CSS"],
    href: "/projects/weather",
    date: "2024-07-02",
    images: [
      "/images/weather/1.jpg",
      "/images/weather/2.jpg",
      "/images/weather/3.jpg",
      "/images/weather/4.jpg",
    ],
  },
  {
    title: "SaaS Analytics",
    desc: "Multi-tenant analytics with ingestion pipeline, dashboards, and RBAC.",
    tags: ["Next.js", "PostgreSQL", "Prisma", "Docker"],
    href: "/projects/saas-analytics",
    featured: true,
    date: "2025-02-14",
    images: [
      "/images/saas-analytics/1.jpg",
      "/images/saas-analytics/2.jpg",
      "/images/saas-analytics/3.jpg",
      "/images/saas-analytics/4.jpg",
      "/images/saas-analytics/5.jpg",
    ],
  },
  {
    title: "Chat Support Widget",
    desc: "Embeddable customer support chat with bots, handoff, and transcripts.",
    tags: ["React", "WebSocket", "Node.js", "Redis"],
    href: "/projects/chat-widget",
    date: "2024-09-18",
    images: [
      "/images/chat-widget/1.jpg",
      "/images/chat-widget/2.jpg",
      "/images/chat-widget/3.jpg",
      "/images/chat-widget/4.jpg",
    ],
  },
  {
    title: "IoT Fleet Monitor",
    desc: "Telemetry ingestion, device health, and geofencing alerts at scale.",
    tags: ["AWS", "Lambda", "DynamoDB", "TypeScript"],
    href: "/projects/iot-fleet",
    date: "2025-03-01",
    images: [
      "/images/iot-fleet/1.jpg",
      "/images/iot-fleet/2.jpg",
      "/images/iot-fleet/3.jpg",
      "/images/iot-fleet/4.jpg",
    ],
  },
  {
    title: "Portfolio v3",
    desc: "This site: performant animations, GSAP sprinkles, and accessible UI.",
    tags: ["Next.js", "Tailwind", "GSAP"],
    href: "/projects/portfolio-v3",
    date: "2025-05-25",
    images: [
      "/images/portfolio-v3/1.jpg",
      "/images/portfolio-v3/2.jpg",
      "/images/portfolio-v3/3.jpg",
      "/images/portfolio-v3/4.jpg",
      "/images/portfolio-v3/5.jpg",
    ],
  },
  {
    title: "Food Delivery Clone",
    desc: "Search, cart, payments, delivery tracking with live order status.",
    tags: ["React Native", "Expo", "Stripe", "Firebase"],
    href: "/projects/food-delivery",
    date: "2024-12-05",
    images: [
      "/images/food-delivery/1.jpg",
      "/images/food-delivery/2.jpg",
      "/images/food-delivery/3.jpg",
      "/images/food-delivery/4.jpg",
    ],
  },
  {
    title: "Blog Engine",
    desc: "MDX content, image optimization, and instant search.",
    tags: ["Next.js", "MDX", "Algolia"],
    href: "/projects/blog-engine",
    date: "2024-08-10",
    images: [
      "/images/blog-engine/1.jpg",
      "/images/blog-engine/2.jpg",
      "/images/blog-engine/3.jpg",
      "/images/blog-engine/4.jpg",
    ],
  },
  {
    title: "Video Processing Pipeline",
    desc: "Serverless video ingest, thumbnailing, and HLS packaging.",
    tags: ["AWS", "S3", "Lambda", "FFmpeg"],
    href: "/projects/video-pipeline",
    date: "2025-01-07",
    images: [
      "/images/video-pipeline/1.jpg",
      "/images/video-pipeline/2.jpg",
      "/images/video-pipeline/3.jpg",
      "/images/video-pipeline/4.jpg",
    ],
  },
];

const ALL_TAGS = Array.from(new Set(ALL_PROJECTS.flatMap((p) => p.tags))).sort();

type Tab = "Featured" | "All";
type SortBy = "Newest" | "Oldest" | "A–Z" | "Z–A";

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Featured");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("Newest");
  const [visibleCount, setVisibleCount] = useState(9);

  const filtered = useMemo(() => {
    let list =
      activeTab === "Featured"
        ? ALL_PROJECTS.filter((p) => p.featured)
        : ALL_PROJECTS.slice();

    // tag filter
    if (activeTags.length) {
      list = list.filter((p) => activeTags.every((t) => p.tags.includes(t)));
    }

    // search
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.desc.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // sort
    list = list.sort((a, b) => {
      const ad = a.date ? new Date(a.date).getTime() : 0;
      const bd = b.date ? new Date(b.date).getTime() : 0;
      switch (sortBy) {
        case "Newest":
          return bd - ad;
        case "Oldest":
          return ad - bd;
        case "A–Z":
          return a.title.localeCompare(b.title);
        case "Z–A":
          return b.title.localeCompare(a.title);
      }
    });

    return list;
  }, [activeTab, activeTags, query, sortBy]);

  const visible = filtered.slice(0, visibleCount);
  const canLoadMore = visibleCount < filtered.length;

  const toggleTag = (tag: string) => {
    setVisibleCount(9);
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const resetFilters = () => {
    setActiveTags([]);
    setQuery("");
    setSortBy("Newest");
    setVisibleCount(9);
  };

  return (
    <main className="pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* ===== Hero / Top banner ===== */}
        <section className="mac-card rounded-2xl p-8 md:p-12 mb-10 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-gradient-to-tr from-[var(--accent)]/30 via-transparent to-[var(--accent)]/20" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Projects</h1>
              <p className="text-[var(--text-secondary)]">
                A hand-picked set of builds spanning frontend, backend, and cloud — with a focus on
                performance, DX, and delightful UX.
              </p>
            </div>
            <Link href="/contact" className="mac-button px-6 py-3 rounded-lg font-medium whitespace-nowrap">
              Start a project
            </Link>
          </div>
        </section>

        {/* ===== Controls: Tabs / Search / Sort ===== */}
        <section className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Tabs */}
            <div className="inline-flex p-1 rounded-lg border border-[var(--border)]">
              {(["Featured", "All"] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setActiveTab(t);
                    setVisibleCount(9);
                  }}
                  className={`px-4 py-2 rounded-md transition ${
                    activeTab === t
                      ? "bg-[var(--accent)] text-[var(--bg-primary)]"
                      : "text-[var(--text-secondary)] hover:bg-[var(--border)]/40"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Search + Sort */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <div className="relative">
                <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
                <input
                  className="pl-9 pr-3 py-2 rounded-lg border bg-transparent border-[var(--border)] focus:outline-none focus:border-[var(--accent)] w-72"
                  placeholder="Search projects…"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setVisibleCount(9);
                  }}
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="px-3 py-2 rounded-lg border bg-transparent border-[var(--border)] focus:outline-none focus:border-[var(--accent)]"
              >
                <option>Newest</option>
                <option>Oldest</option>
                <option>A–Z</option>
                <option>Z–A</option>
              </select>
            </div>
          </div>
        </section>

        {/* ===== Tag filters ===== */}
        <section className="mb-8">
          <div className="flex flex-wrap gap-2">
            {ALL_TAGS.map((tag) => {
              const active = activeTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`text-xs px-3 py-1 rounded border transition ${
                    active
                      ? "border-[var(--accent)] text-[var(--accent)]"
                      : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]/60"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
            {activeTags.length > 0 || query ? (
              <button
                onClick={resetFilters}
                className="text-xs px-3 py-1 rounded border border-[var(--border)] hover:border-[var(--accent)]/60"
                title="Clear filters"
              >
                Clear filters
              </button>
            ) : null}
          </div>
        </section>

        {/* ===== Projects grid ===== */}
        <section>
          {visible.length === 0 ? (
            <div className="text-[var(--text-secondary)]">No projects match your filters.</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {visible.map((p) => (
                  <div key={p.title} className="project-card-anim">
                    <ProjectCard {...p} />
                  </div>
                ))}
              </div>

              {canLoadMore && (
                <div className="flex justify-center mt-10">
                  <button
                    className="mac-button px-6 py-3 rounded-lg font-medium"
                    onClick={() => setVisibleCount((c) => c + 9)}
                  >
                    Load more
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* ===== CTA ===== */}
        <section className="mt-16">
          <div className="mac-card rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl md:text-2xl font-semibold">Have something in mind?</h3>
              <p className="text-[var(--text-secondary)]">
                I can help design, build, and ship it — frontend to cloud.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/contact" className="mac-button px-5 py-3 rounded-lg font-medium">
                Get in touch
              </Link>
              <Link
                href="/skills"
                className="border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--bg-primary)] px-5 py-3 rounded-lg font-medium transition"
              >
                View skills
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
