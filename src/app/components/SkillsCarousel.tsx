"use client";

import { useEffect, useMemo, useState } from "react";

type Skill = { name: string; icon: string; color?: string };

export default function SkillsCarousel({
  title,
  skills,
  perPage = 6,
  autoPlayMs = 4000,
}: {
  title: string;
  skills: Skill[];
  perPage?: number;
  autoPlayMs?: number;
}) {
  const pages = useMemo(() => {
    const chunks: Skill[][] = [];
    for (let i = 0; i < skills.length; i += perPage) {
      chunks.push(skills.slice(i, i + perPage));
    }
    return chunks;
  }, [skills, perPage]);

  const [page, setPage] = useState(0);

  // autoplay (pause on hover)
  useEffect(() => {
    let timer: any;
    const start = () => {
      if (autoPlayMs <= 0 || pages.length <= 1) return;
      timer = setInterval(() => setPage((p) => (p + 1) % pages.length), autoPlayMs);
    };
    start();
    return () => clearInterval(timer);
  }, [pages.length, autoPlayMs]);

  // keyboard arrows
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setPage((p) => (p + 1) % pages.length);
      if (e.key === "ArrowLeft") setPage((p) => (p - 1 + pages.length) % pages.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pages.length]);

  // simple swipe
  useEffect(() => {
    let startX = 0;
    let isDown = false;
    const area = document.getElementById(`skills-${title.replace(/\s+/g, "-")}`);
    if (!area) return;

    const down = (e: TouchEvent | MouseEvent) => {
      isDown = true;
      startX = "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    };
    const move = (e: TouchEvent | MouseEvent) => {
      if (!isDown) return;
      const x = "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const dx = x - startX;
      if (Math.abs(dx) > 60) {
        setPage((p) => (dx < 0 ? (p + 1) % pages.length : (p - 1 + pages.length) % pages.length));
        isDown = false;
      }
    };
    const up = () => (isDown = false);

    area.addEventListener("mousedown", down);
    area.addEventListener("mousemove", move);
    area.addEventListener("mouseup", up);
    area.addEventListener("mouseleave", up);
    area.addEventListener("touchstart", down, { passive: true });
    area.addEventListener("touchmove", move, { passive: true });
    area.addEventListener("touchend", up);

    return () => {
      area.removeEventListener("mousedown", down);
      area.removeEventListener("mousemove", move);
      area.removeEventListener("mouseup", up);
      area.removeEventListener("mouseleave", up);
      area.removeEventListener("touchstart", down);
      area.removeEventListener("touchmove", move);
      area.removeEventListener("touchend", up);
    };
  }, [title, pages.length]);

  if (!skills.length) return null;

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg md:text-xl font-semibold">{title}</h3>
 
        <div className="flex items-center space-x-2">
          <button
            aria-label="Previous"
            className="mac-button px-3 py-1 rounded-lg"
            onClick={() => setPage((p) => (p - 1 + pages.length) % pages.length)}
          >
            ‹
          </button>
          <button
            aria-label="Next"
            className="mac-button px-3 py-1 rounded-lg"
            onClick={() => setPage((p) => (p + 1) % pages.length)}
          >
            ›
          </button>
        </div>
      </div>

      <div id={`skills-${title.replace(/\s+/g, "-")}`} className="relative select-none">
        {/* viewport keeps the 2×3 layout */}
        <div className="overflow-hidden rounded-2xl">
          <div
            className="whitespace-nowrap transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${page * 100}%)` }}
          >
            {pages.map((chunk, i) => (
              <div key={i} className="inline-block align-top w-full">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                  {chunk.map((s, idx) => (
                    <div
                      key={`${s.name}-${idx}`}
                      className="tech-icon mac-card p-4 md:p-6 rounded-xl flex flex-col items-center justify-center"
                    >
                      <i className={`${s.icon} text-3xl md:text-4xl mb-2 ${s.color ?? ""}`}></i>
                      <span className="text-sm md:text-base">{s.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* dots */}
        <div className="flex justify-center mt-4 space-x-2">
          {pages.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 w-2 rounded-full transition ${
                i === page ? "bg-[var(--accent)] scale-110" : "bg-[var(--border)]"
              }`}
              onClick={() => setPage(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
