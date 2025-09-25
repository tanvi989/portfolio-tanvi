"use client";
import Image from 'next/image'
import Link from 'next/link';
export default function AboutPage() {
  return (
    <main className="pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* ===== Hero ===== */}
        <section className="mac-card rounded-2xl p-8 md:p-12 mb-10 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-gradient-to-tr from-[var(--accent)]/30 via-transparent to-[var(--accent)]/20" />
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr,320px] gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Hi, I’m <span className="text-gradient">Tanvi Paradkar</span> 👋
              </h1>
              <p className="text-[var(--text-secondary)] text-lg">
                I’m a full-stack engineer who loves crafting smooth, performant UIs and robust cloud backends.
                I focus on DX, accessibility, and shipping delightful product experiences.
              </p>

              <div className="flex flex-wrap gap-3 mt-6">
                <Link href="/projects" className="mac-button px-5 py-3 rounded-lg font-medium">
                  View Projects
                </Link>
                <Link
                  href="/Tanvi_Paradkar_CV.pdf"
                  className="border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--bg-primary)] px-5 py-3 rounded-lg font-medium transition"
                  download
                >
                  Download CV
                </Link>
                <Link
                  href="/contact"
                  className="px-5 py-3 rounded-lg font-medium border border-[var(--border)] hover:border-[var(--accent)]/60"
                >
                  Contact Me
                </Link>
              </div>
            </div>

            {/* Photo + quick stats */}
            <div className="w-full md:justify-self-end">
              <div className="mac-card rounded-2xl p-6 flex flex-col items-center">
                <div className="w-36 h-36 md:w-40 md:h-40 rounded-full overflow-hidden ring-2 ring-[var(--accent)]/40 mb-4">
                  {/* replace with your image */}
         <Image
  src="/tanvi.jpg"
  alt="Tanvi Paradkar portrait"
  width={144}
  height={144}
  className="w-full h-full object-cover"
/>

                </div>
                <div className="grid grid-cols-3 gap-3 text-center w-full">
                  <div className="rounded-lg border border-[var(--border)] p-3">
                    <div className="text-xl font-semibold">5+</div>
                    <div className="text-xs text-[var(--text-secondary)]">Years</div>
                  </div>
                  <div className="rounded-lg border border-[var(--border)] p-3">
                    <div className="text-xl font-semibold">20+</div>
                    <div className="text-xs text-[var(--text-secondary)]">Projects</div>
                  </div>
                  <div className="rounded-lg border border-[var(--border)] p-3">
                    <div className="text-xl font-semibold">∞</div>
                    <div className="text-xs text-[var(--text-secondary)]">Coffee ☕</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-5">
                  <Link href="mailto:you@example.com" className="hover:opacity-80" aria-label="Email">
                    <i className="fas fa-envelope text-xl text-[var(--accent)]" />
                  </Link>
                  <Link href="https://www.linkedin.com/in/your-handle" target="_blank" className="hover:opacity-80" aria-label="LinkedIn">
                    <i className="fab fa-linkedin text-xl text-[var(--accent)]" />
                  </Link>
                  <Link href="https://github.com/your-handle" target="_blank" className="hover:opacity-80" aria-label="GitHub">
                    <i className="fab fa-github text-xl text-[var(--accent)]" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Bio ===== */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 mac-card rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-semibold mb-3">About me</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              I’m Tanvi Paradkar — a builder at heart. I work across the stack with React/Next.js,
              TypeScript, Node.js, and AWS. I care about clean architecture, accessible interfaces,
              and small details that make software feel joyful. Recently, I’ve been focused on
              performance profiling, DX tooling, and end-to-end testing to keep teams moving fast
              without breaking things.
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed mt-4">
              When I’m not coding, you’ll catch me exploring coffee spots, sketching UI ideas, or
              reading about product strategy. I’m happiest when I’m shipping and learning.
            </p>
          </div>

          <div className="mac-card rounded-2xl p-6 md:p-8">
            <h3 className="text-xl font-semibold mb-3">Quick stack</h3>
            <ul className="grid grid-cols-2 gap-2 text-sm text-[var(--text-secondary)]">
              <li className="flex items-center gap-2"><i className="fab fa-react text-[var(--accent)]" /> React / Next.js</li>
              <li className="flex items-center gap-2"><i className="fab fa-js text-[var(--accent)]" /> TypeScript / JS</li>
              <li className="flex items-center gap-2"><i className="fab fa-node text-[var(--accent)]" /> Node.js / Express</li>
              <li className="flex items-center gap-2"><i className="fas fa-database text-[var(--accent)]" /> Postgres / MongoDB</li>
              <li className="flex items-center gap-2"><i className="fab fa-aws text-[var(--accent)]" /> AWS / Serverless</li>
              <li className="flex items-center gap-2"><i className="fas fa-vial text-[var(--accent)]" /> Jest / Playwright</li>
            </ul>
          </div>
        </section>

        {/* ===== Timeline ===== */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">Experience & education</h2>
          <div className="space-y-4">
            {[
              {
                title: "Senior Full-Stack Engineer",
                org: "Acme Corp",
                time: "2024 — Present",
                desc: "Led migration to Next.js App Router, introduced E2E tests, and improved Core Web Vitals (LCP ↓35%).",
              },
              {
                title: "Full-Stack Engineer",
                org: "Product Studio",
                time: "2022 — 2024",
                desc: "Built multi-tenant SaaS (RBAC, billing, dashboards). Shipped CI/CD with preview envs.",
              },
              {
                title: "Software Engineer",
                org: "Startup X",
                time: "2020 — 2022",
                desc: "React frontends + Node APIs; introduced design system and storybook for consistency.",
              },
              {
                title: "B.E. Computer Engineering",
                org: "Your University",
                time: "2016 — 2020",
                desc: "Graduated with honors. Led coding club, mentored juniors.",
              },
            ].map((item) => (
              <div key={item.title} className="mac-card rounded-xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold">{item.title}</div>
                    <div className="text-sm text-[var(--text-secondary)]">{item.org}</div>
                  </div>
                  <div className="text-sm text-[var(--text-secondary)] whitespace-nowrap">{item.time}</div>
                </div>
                <p className="text-sm text-[var(--text-secondary)] mt-3">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== Values ===== */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: "fas fa-heart", title: "Empathy", text: "Great products start with listening — to users and teammates." },
              { icon: "fas fa-bolt", title: "Bias to ship", text: "Iterate quickly, measure, and improve continuously." },
              { icon: "fas fa-universal-access", title: "Accessibility", text: "Inclusive experiences by default — every user matters." },
            ].map((v) => (
              <div key={v.title} className="mac-card rounded-xl p-6">
                <i className={`${v.icon} text-[var(--accent)] text-xl`} />
                <h4 className="font-semibold mt-3">{v.title}</h4>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{v.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== Fun facts / Now ===== */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="mac-card rounded-2xl p-6 md:p-8">
            <h3 className="text-xl font-semibold mb-3">Fun facts</h3>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li className="flex items-start gap-2"><i className="fas fa-check mt-1 text-[var(--accent)]" /> Dark mode enthusiast.</li>
              <li className="flex items-start gap-2"><i className="fas fa-check mt-1 text-[var(--accent)]" /> Can’t resist refactoring tiny papercuts.</li>
              <li className="flex items-start gap-2"><i className="fas fa-check mt-1 text-[var(--accent)]" /> Weekend UI sketcher & coffee hunter.</li>
            </ul>
          </div>
          <div className="mac-card rounded-2xl p-6 md:p-8">
            <h3 className="text-xl font-semibold mb-3">Now</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Building with Next.js App Router, experimenting with server actions, and polishing a small design system.
            </p>
            <Link href="/projects" className="inline-flex items-center gap-2 text-[var(--accent)] mt-3">
              See what I’m shipping <i className="fas fa-arrow-right" />
            </Link>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="mt-14">
          <div className="mac-card rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl md:text-2xl font-semibold">Let’s build something</h3>
              <p className="text-[var(--text-secondary)]">I’m open to freelance and full-time opportunities.</p>
            </div>
            <div className="flex gap-3">
              <Link href="/contact" className="mac-button px-5 py-3 rounded-lg font-medium">
                Contact Me
              </Link>
              <Link
                href="/projects"
                className="border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--bg-primary)] px-5 py-3 rounded-lg font-medium transition"
              >
                View Projects
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
