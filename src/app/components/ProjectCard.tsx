"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";

type ProjectCardProps = {
  title: string;
  desc: string;
  tags: string[];
  href: string;
  images: string[]; // 4–5 images per project
};

export default function ProjectCard({ title, desc, tags, href, images }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  // --- hover tilt + scale (same behavior as before) ---
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const enter = () => gsap.to(el, { scale: 1.02, duration: 0.2, ease: "power2.out" });
    const leave = () =>
      gsap.to(el, { scale: 1.0, rotateX: 0, rotateY: 0, duration: 0.3, ease: "power2.out" });

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rx = -((y / rect.height) - 0.5) * 10; // max 10deg
      const ry = ((x / rect.width) - 0.5) * 10;
      gsap.to(el, { rotateX: rx, rotateY: ry, transformPerspective: 800, duration: 0.2 });
    };

    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);
    el.addEventListener("mousemove", onMouseMove);
    return () => {
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
      el.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  // Lightbox helpers
  const openAt = useCallback((i: number) => {
    setIdx(i);
    setOpen(true);
  }, []);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const hasImages = images && images.length > 0;

  return (
    <article
      ref={cardRef}
      className="mac-card mac-window rounded-xl overflow-hidden card-3d will-change-transform"
    >
      <div className="mac-window-controls">
        <div className="mac-control mac-close"></div>
        <div className="mac-control mac-minimize"></div>
        <div className="mac-control mac-maximize"></div>
      </div>

      <div className="p-6 pt-12">
        {/* Image gallery (replaces gradient block) */}
        {hasImages && (
          <div className="mb-4">
            {/* Cover image */}
            <button
              type="button"
              onClick={() => openAt(0)}
              className="block w-full aspect-[16/10] overflow-hidden rounded-lg"
              aria-label={`Open gallery for ${title}`}
            >
              <img
                src={images[0]}
                alt={`${title} preview`}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                loading="lazy"
              />
            </button>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-1 mt-2">
                {images.slice(1, 5).map((src, i) => {
                  const absoluteIndex = i + 1;
                  const isLastThumbAndHasMore = images.length > 5 && i === 3;
                  return (
                    <button
                      type="button"
                      key={src}
                      onClick={() => openAt(absoluteIndex)}
                      className="relative aspect-[4/3] overflow-hidden rounded"
                      aria-label={`View image ${absoluteIndex + 1} of ${title}`}
                    >
                      <img
                        src={src}
                        alt={`${title} thumbnail ${absoluteIndex + 1}`}
                        className={`w-full h-full object-cover ${isLastThumbAndHasMore ? "brightness-75" : ""}`}
                        loading="lazy"
                      />
                      {isLastThumbAndHasMore && (
                        <span className="absolute inset-0 flex items-center justify-center text-white font-medium">
                          +{images.length - 5}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Text content */}
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-[var(--text-secondary)] mb-4 text-sm">{desc}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((t) => (
            <span
              key={t}
              className="text-xs bg-[var(--accent)] bg-opacity-20 px-2 py-1 rounded"
            >
              {t}
            </span>
          ))}
        </div>

        <a href={href} className="text-[var(--accent)] hover:opacity-80 flex items-center">
          View Project <i className="fas fa-arrow-right ml-2"></i>
        </a>
      </div>

      {/* Lightbox */}
      {open && (
        <Lightbox
          images={images}
          index={idx}
          onClose={() => setOpen(false)}
          onIndexChange={setIdx}
          title={title}
        />
      )}
    </article>
  );
}

/* ---------- Lightbox component ---------- */

function Lightbox({
  images,
  index,
  onClose,
  onIndexChange,
  title,
}: {
  images: string[];
  index: number;
  onClose: () => void;
  onIndexChange: (i: number) => void;
  title: string;
}) {
  const prev = useCallback(
    () => onIndexChange((index - 1 + images.length) % images.length),
    [index, images.length, onIndexChange]
  );
  const next = useCallback(
    () => onIndexChange((index + 1) % images.length),
    [index, images.length, onIndexChange]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, onClose, prev]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} image viewer`}
      className="fixed inset-0 z-[1000] bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="relative max-w-6xl w-full px-4" onClick={(e) => e.stopPropagation()}>
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-2 text-white/80 hover:text-white text-2xl"
          aria-label="Close lightbox"
        >
          ✕
        </button>

        {/* Main image */}
        <img
          src={images[index]}
          alt={`${title} image ${index + 1}`}
          className="w-full max-h-[80vh] object-contain select-none"
          draggable={false}
        />

        {/* Controls */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white"
              aria-label="Previous image"
            >
              ←
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white"
              aria-label="Next image"
            >
              →
            </button>

            <div className="mt-3 flex items-center justify-center gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => onIndexChange(i)}
                  className={`w-2.5 h-2.5 rounded-full ${i === index ? "bg-white" : "bg-white/40"}`}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
