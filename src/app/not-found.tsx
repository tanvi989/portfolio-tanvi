"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function NotFound() {
  const ghostRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [q, setQ] = useState("");
  const [section, setSection] = useState<"skills" | "projects">("skills");

  useEffect(() => {
    if (!ghostRef.current) return;
    gsap.to(ghostRef.current, {
      y: -10,
      repeat: -1,
      yoyo: true,
      duration: 1.5,
      ease: "power1.inOut",
    });
  }, []);

  const onSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const slug = q.trim().toLowerCase().replace(/\s+/g, "-");
    if (!slug) return;
    router.push(`/${section}/${slug}`);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
      {/* subtle gradient blob */}
      <div className="pointer-events-none absolute -z-10 inset-0">
        <div className="absolute -top-24 -left-24 w-[36rem] h-[36rem] rounded-full blur-3xl opacity-20 bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500" />
        <div className="absolute -bottom-20 -right-20 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-20 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-500" />
      </div>

      <div ref={ghostRef} className="text-[6rem] md:text-[8rem] mb-4 select-none">
        👻
      </div>

      <h1 className="text-3xl md:text-5xl font-bold mb-2">404 – Page Not Found</h1>
      <p className="text-[var(--muted-foreground,#6b7280)] max-w-xl mb-8">
        Looks like you wandered off the map. Try a quick search, jump to a section,
        or reach out directly — I’m happy to help!
      </p>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3 justify-center mb-8">
        <Link href="/" className="mac-button px-5 py-2 rounded-lg">← Back to Home</Link>
        <Link href="/skills/react" className="mac-button px-5 py-2 rounded-lg">Explore Skills</Link>
        <Link href="/projects/analytics-dashboard" className="mac-button px-5 py-2 rounded-lg">View Projects</Link>
      </div>

      {/* Search */}
      <form
        onSubmit={onSearch}
        className="mac-card rounded-xl p-4 w-full max-w-xl mb-8"
        aria-label="Find a page"
      >
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          <div className="flex items-center gap-2">
            <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="where"
                value="skills"
                checked={section === "skills"}
                onChange={() => setSection("skills")}
              />
              <span>Skills</span>
            </label>
            <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="where"
                value="projects"
                checked={section === "projects"}
                onChange={() => setSection("projects")}
              />
              <span>Projects</span>
            </label>
          </div>

          <input
            type="text"
            placeholder={section === "skills" ? "Try: react, nextjs, tailwind…" : "Try: analytics-dashboard…"}
            className="flex-1 rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--accent)]"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search term"
          />
          <button type="submit" className="mac-button px-4 py-2 rounded-lg">Go</button>
        </div>

        {/* quick suggestions */}
        <div className="flex flex-wrap gap-2 mt-3 text-sm">
          {section === "skills" ? (
            <>
              <button type="button" className="underline hover:opacity-80"
                onClick={() => { setQ("react"); router.push("/skills/react"); }}>
                react
              </button>
              <button type="button" className="underline hover:opacity-80"
                onClick={() => { setQ("nextjs"); router.push("/skills/nextjs"); }}>
                nextjs
              </button>
              <button type="button" className="underline hover:opacity-80"
                onClick={() => { setQ("tailwind"); router.push("/skills/tailwind"); }}>
                tailwind
              </button>
            </>
          ) : (
            <>
              <button type="button" className="underline hover:opacity-80"
                onClick={() => { setQ("analytics-dashboard"); router.push("/projects/analytics-dashboard"); }}>
                analytics-dashboard
              </button>
              <button type="button" className="underline hover:opacity-80"
                onClick={() => { setQ("pdp-revamp"); router.push("/projects/pdp-revamp"); }}>
                pdp-revamp
              </button>
              <button type="button" className="underline hover:opacity-80"
                onClick={() => { setQ("component-library"); router.push("/projects/component-library"); }}>
                component-library
              </button>
            </>
          )}
        </div>
      </form>

      {/* Contact CTA */}
      <section className="mac-card rounded-xl p-5 w-full max-w-xl">
        <h2 className="font-semibold mb-3">Can’t find it? Contact me</h2>
        <div className="grid grid-cols-1 gap-3">
          <a
            href="tel:+919969953445"
            className="flex items-center justify-between rounded-lg border px-4 py-3 hover:bg-white/5 transition-colors"
            aria-label="Call me at 9969953445"
          >
            <span className="text-left">
              <span className="block text-sm opacity-70">Call / WhatsApp</span>
              <span className="text-lg font-medium">+91 99699 53445</span>
            </span>
            <i className="fas fa-phone" aria-hidden="true" />
          </a>

          <a
            href="mailto:paradkartanvii@gmail.com?subject=Hello%20from%20your%20404%20page&body=Hi%20Tanvi%2C%20I%20was%20looking%20for%20..."
            className="flex items-center justify-between rounded-lg border px-4 py-3 hover:bg-white/5 transition-colors"
            aria-label="Email me at paradkartanvii@gmail.com"
          >
            <span className="text-left">
              <span className="block text-sm opacity-70">Email</span>
              <span className="text-lg font-medium">paradkartanvii@gmail.com</span>
            </span>
            <i className="fas fa-envelope" aria-hidden="true" />
          </a>
        </div>

        {/* small note */}
        <p className="mt-3 text-xs opacity-70">
          I usually reply quickly. If you include a link or screenshot, I can help faster.
        </p>
      </section>

      {/* Back link */}
      <div className="mt-8">
        <Link href="/" className="underline opacity-80 hover:opacity-100">
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
