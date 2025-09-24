"use client";

import { useEffect, useRef, useState, useCallback, useId } from "react";
import gsap from "gsap";

export type NoteCardProps = {
  title: string;
  desc?: string;
  gradient: string; // e.g. "from-purple-600 to-blue-500"
  tags?: string[];
  pdfUrl?: string; // optional, falls back to DEFAULT_PDF
};

const DEFAULT_PDF =
  "https://www.sathyabama.ac.in/sites/default/files/course-material/2020-10/UNIT4.pdf";

export default function NoteCard({
  title,
  desc,
  gradient,
  tags = [],
  pdfUrl,
}: NoteCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // fullscreen preview state
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  // unique id for the viewer
  const viewerId = useId();

  // final PDF url
  const effectiveUrl = (pdfUrl?.trim() || DEFAULT_PDF).trim();

  // ===== hover / tilt animation =====
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const enter = () =>
      gsap.to(el, { scale: 1.02, duration: 0.2, ease: "power2.out" });
    const leave = () =>
      gsap.to(el, {
        scale: 1,
        rotateX: 0,
        rotateY: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rx = -((y / rect.height) - 0.5) * 10;
      const ry = ((x / rect.width) - 0.5) * 10;
      gsap.to(el, {
        rotateX: rx,
        rotateY: ry,
        transformPerspective: 800,
        duration: 0.2,
      });
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

  // ===== keyboard + body scroll lock for fullscreen =====
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    if (open) {
      document.addEventListener("keydown", onKey);
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("keydown", onKey);
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  // ===== open fullscreen =====
  const onOpen = useCallback(() => {
    setOpen(true);
    setIsLoading(true);
    setFailed(false);
  }, []);

  // fallback timeout if viewer never loads
  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => {
      setIsLoading(false);
      setFailed(true);
    }, 5000);
    return () => window.clearTimeout(id);
  }, [open]);

  const handleViewerLoad = () => {
    setIsLoading(false);
    setFailed(false);
  };

  const retry = () => {
    setIsLoading(true);
    setFailed(false);
    const el = document.getElementById(viewerId) as HTMLObjectElement | null;
    if (el) {
      const u = new URL(effectiveUrl, window.location.href);
      // add trivial cache-buster; embed params often ignored by servers but harmless
      u.hash = "view=FitH&ts=" + Date.now();
      // for <object>, we set data; for <embed>, we set src
      if (el.tagName === "OBJECT") {
        (el as HTMLObjectElement).data = u.toString();
      }
    }
  };

  return (
    <>
      <article
        ref={cardRef}
        className="mac-card mac-window rounded-xl overflow-hidden card-3d will-change-transform"
        style={{ padding: "10px" }}
      >
        <div className="mac-window-controls">
          <div className="mac-control mac-close"></div>
          <div className="mac-control mac-minimize"></div>
          <div className="mac-control mac-maximize"></div>
        </div>

        <div className="p-6 pt-12">
          <div
            className={`h-32 md:h-48 bg-gradient-to-r ${gradient} rounded-lg mb-4 flex items-center justify-center`}
          >
            <span className="text-white/90 text-sm md:text-base font-medium">
              PDF Notes
            </span>
          </div>

        <h3 className="text-xl font-bold mb-2">{title}</h3>
          {desc && (
            <p className="text-[var(--text-secondary)] mb-4 text-sm">{desc}</p>
          )}

          {!!tags?.length && (
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
          )}

          {!pdfUrl?.trim() && (
            <p className="text-xs text-[var(--text-secondary)] mb-2">
              Using a placeholder PDF for now.
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              onClick={onOpen}
              className="text-[var(--accent)] hover:opacity-80 flex items-center"
            >
              Preview Notes <i className="fas fa-eye ml-2" />
            </button>

            <a
              href={effectiveUrl}
              download
              className="text-[var(--accent)] hover:opacity-80 flex items-center"
              rel="noopener noreferrer"
            >
              Download <i className="fas fa-download ml-2" />
            </a>

            <a
              href={effectiveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] hover:opacity-80 flex items-center"
            >
              Open in New Tab{" "}
              <i className="fas fa-arrow-up-right-from-square ml-2" />
            </a>
          </div>
        </div>
      </article>

      {/* ===== Fullscreen Preview ===== */}
      {open && (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-black/90"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} preview fullscreen`}
          onClick={() => setOpen(false)} // backdrop click closes
        >
          {/* Top bar */}
          <div
            className="h-12 shrink-0 flex items-center justify-between px-4
                       bg-black/40 backdrop-blur border-b border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="min-w-0">
              <span className="text-white text-sm md:text-base font-medium truncate">
                {title}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={effectiveUrl}
                download
                className="text-white/90 hover:text-white text-xs md:text-sm"
                rel="noopener noreferrer"
              >
                Download
              </a>
              <a
                href={effectiveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/90 hover:text-white text-xs md:text-sm"
              >
                Open New Tab
              </a>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md bg-white text-black px-3 py-1 text-xs md:text-sm hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>

          {/* Viewer area */}
          <div
            className="relative flex-1 p-3 md:p-6"
            onClick={(e) => e.stopPropagation()} // don't close when clicking viewer
          >
            {/* Loading / Error states */}
            {isLoading && !failed && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-pulse text-xs text-white/70">
                  Loading preview…
                </div>
              </div>
            )}

            {failed && (
              <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
                <div className="space-y-3 text-white/80">
                  <p className="text-sm">
                    The host may block embedding this PDF. Use{" "}
                    <span className="font-medium text-white">Open New Tab</span>{" "}
                    or try again.
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={retry}
                      className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-sm text-white"
                    >
                      Retry Preview
                    </button>
                    <a
                      href={effectiveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 rounded border border-white/20 text-sm text-white hover:bg-white/10"
                    >
                      Open New Tab
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* PDF surface */}
            <div className="w-full h-full rounded-lg overflow-hidden bg-white shadow-2xl">
              {/* Prefer <object>; if it fails, show fallback content */}
              <object
                id={viewerId}
                data={`${effectiveUrl}#view=FitH`}
                type="application/pdf"
                className="w-full h-full"
                onLoad={handleViewerLoad}
              >
                {/* <embed> does not support onLoad in React typings; don't attach it */}
                <embed
                  src={`${effectiveUrl}#view=FitH`}
                  type="application/pdf"
                  className="w-full h-full"
                />
                <div className="w-full h-full flex items-center justify-center p-6 text-center text-sm text-gray-700">
                  Couldn&apos;t render inline preview. Please use{" "}
                  <a
                    className="underline ml-1"
                    href={effectiveUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open New Tab
                  </a>
                  .
                </div>
              </object>
            </div>
          </div>

          {/* Bottom help bar */}
          <div className="h-10 px-4 flex items-center justify-between text-xs text-white/70 bg-black/40 border-t border-white/10">
            <div>Tip: Press Esc or click outside to close.</div>
          </div>
        </div>
      )}
    </>
  );
}
