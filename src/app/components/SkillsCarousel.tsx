"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

type Skill = { 
  name: string; 
  icon: string; 
  color?: string; 
  href?: string; // <-- added for redirection
};

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
  const router = useRouter();

  const pages = useMemo(() => {
    const chunks: Skill[][] = [];
    for (let i = 0; i < skills.length; i += perPage) {
      chunks.push(skills.slice(i, i + perPage));
    }
    return chunks;
  }, [skills, perPage]);

  const [page, setPage] = useState(0);

  const nextPage = useCallback(() => {
    setPage((p) => (p + 1) % pages.length);
  }, [pages.length]);

  const prevPage = useCallback(() => {
    setPage((p) => (p - 1 + pages.length) % pages.length);
  }, [pages.length]);

  const goToPage = useCallback((pageIndex: number) => {
    setPage(pageIndex);
  }, []);

  // Redirect helper
  const slugify = (s: string) =>
    s
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  const isExternal = (url: string) => /^https?:\/\//i.test(url);

  const handleRedirect = useCallback(
    (skill: Skill) => {
      const target = skill.href || `/skills/${slugify(skill.name)}`;

      if (isExternal(target)) {
        // external: open in new tab
        window.open(target, "_blank", "noopener,noreferrer");
      } else {
        // internal: use Next.js navigation
        router.push(target);
      }
    },
    [router]
  );

  // autoplay (pause on hover) - (keeps existing behavior)
  useEffect(() => {
    if (autoPlayMs <= 0 || pages.length <= 1) return;

    const timer = window.setInterval(nextPage, autoPlayMs);
    return () => window.clearInterval(timer);
  }, [pages.length, autoPlayMs, nextPage]);

  // keyboard arrows
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextPage();
      if (e.key === "ArrowLeft") prevPage();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nextPage, prevPage]);

  // simple swipe
  useEffect(() => {
    let startX = 0;
    let isDown = false;
    const areaId = `skills-${title.replace(/\s+/g, "-")}`;
    const area = document.getElementById(areaId);
    if (!area) return;

    const handleStart = (e: TouchEvent | MouseEvent) => {
      isDown = true;
      startX = "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    };

    const handleMove = (e: TouchEvent | MouseEvent) => {
      if (!isDown) return;
      const x = "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const dx = x - startX;
      if (Math.abs(dx) > 60) {
        if (dx < 0) {
          nextPage();
        } else {
          prevPage();
        }
        isDown = false;
      }
    };

    const handleEnd = () => {
      isDown = false;
    };

    // Mouse events
    area.addEventListener("mousedown", handleStart as EventListener);
    area.addEventListener("mousemove", handleMove as EventListener);
    area.addEventListener("mouseup", handleEnd);
    area.addEventListener("mouseleave", handleEnd);

    // Touch events
    area.addEventListener("touchstart", handleStart as EventListener, { passive: true });
    area.addEventListener("touchmove", handleMove as EventListener, { passive: true });
    area.addEventListener("touchend", handleEnd);

    return () => {
      area.removeEventListener("mousedown", handleStart as EventListener);
      area.removeEventListener("mousemove", handleMove as EventListener);
      area.removeEventListener("mouseup", handleEnd);
      area.removeEventListener("mouseleave", handleEnd);
      area.removeEventListener("touchstart", handleStart as EventListener);
      area.removeEventListener("touchmove", handleMove as EventListener);
      area.removeEventListener("touchend", handleEnd);
    };
  }, [title, nextPage, prevPage]);

  if (!skills.length) return null;

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg md:text-xl font-semibold">{title}</h3>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            aria-label="Previous"
            className="mac-button px-3 py-1 rounded-lg transition-opacity hover:opacity-80"
            onClick={prevPage}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next"
            className="mac-button px-3 py-1 rounded-lg transition-opacity hover:opacity-80"
            onClick={nextPage}
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
                  {chunk.map((skill, idx) => (
                    <button
                      key={`${skill.name}-${idx}`}
                      type="button"
                      aria-label={`Open ${skill.name}`}
                      onClick={() => handleRedirect(skill)}
                      className="tech-icon mac-card p-4 md:p-6 rounded-xl flex flex-col items-center justify-center transition-transform hover:scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    >
                      <i className={`${skill.icon} text-3xl md:text-4xl mb-2 ${skill.color ?? ""}`}></i>
                      <span className="text-sm md:text-base text-center">{skill.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* dots */}
        {pages.length > 1 && (
          <div className="flex justify-center mt-4 space-x-2">
            {pages.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2 w-2 rounded-full transition-all ${
                  i === page ? "bg-[var(--accent)] scale-110" : "bg-[var(--border)]"
                }`}
                onClick={() => goToPage(i)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
