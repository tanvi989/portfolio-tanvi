// NoteCard.tsx
"use client";

import { useEffect, useRef, useState, useCallback, useId } from "react";
import gsap from "gsap";

export type NoteCardProps = {
  title: string;
  desc?: string;
  gradient: string;
  tags?: string[];
  pdfUrl?: string;
  /** If provided, clicking Preview will call this instead of using internal modal */
  onPreview?: () => void;
  /** Disable rendering the internal modal (use parent modal instead). Default: true */
  useInternalModal?: boolean;
};

const DEFAULT_PDF =
  "https://www.sathyabama.ac.in/sites/default/files/course-material/2020-10/UNIT4.pdf";

export default function NoteCard({
  title,
  desc,
  gradient,
  tags = [],
  pdfUrl,
  onPreview,
  useInternalModal = true,
}: NoteCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const iframeId = useId();
  const effectiveUrl = (pdfUrl?.trim() || DEFAULT_PDF).trim();

  // hover / tilt animation
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const enter = () => gsap.to(el, { scale: 1.02, duration: 0.2, ease: "power2.out" });
    const leave = () =>
      gsap.to(el, { scale: 1, rotateX: 0, rotateY: 0, duration: 0.3, ease: "power2.out" });
    
    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rx = -((y / rect.height) - 0.5) * 10;
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

  // internal modal keyboard close
  useEffect(() => {
    if (!useInternalModal || !open) return;
    
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, useInternalModal]);

  // open internal modal only if we're using it
  const onOpenInternal = useCallback(() => {
    if (!useInternalModal) return;
    setOpen(true);
    setIsLoading(true);
    setFailed(false);
  }, [useInternalModal]);

  // click handler for the Preview button
  const handlePreviewClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // prevent outer wrapper click
    if (onPreview) {
      onPreview();
    } else {
      onOpenInternal();
    }
  };

  // prevent bubbling when clicking actions so parent wrapper doesn't trigger
  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  // fallback timeout
  useEffect(() => {
    if (!useInternalModal || !open) return;
    
    const timeoutId = window.setTimeout(() => {
      setIsLoading(false);
      setFailed(true);
    }, 5000);
    
    return () => window.clearTimeout(timeoutId);
  }, [open, useInternalModal]);

  const handleIframeLoad = useCallback(() => {
    setIsLoading(false);
    setFailed(false);
  }, []);

  const handleIframeError = useCallback(() => {
    setIsLoading(false);
    setFailed(true);
  }, []);

  const retry = useCallback(() => {
    setIsLoading(true);
    setFailed(false);
    const iframe = document.getElementById(iframeId) as HTMLIFrameElement | null;
    if (iframe) {
      const u = new URL(effectiveUrl, window.location.href);
      u.hash = "toolbar=0&navpanes=0&view=FitH&ts=" + Date.now();
      iframe.src = u.toString();
    }
  }, [iframeId, effectiveUrl]);

  const closeModal = useCallback(() => setOpen(false), []);

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
          <div className={`h-32 md:h-48 bg-gradient-to-r ${gradient} rounded-lg mb-4 flex items-center justify-center`}>
            <span className="text-white/90 text-sm md:text-base font-medium">PDF Notes</span>
          </div>

          <h3 className="text-xl font-bold mb-2">{title}</h3>
          {desc && <p className="text-[var(--text-secondary)] mb-4 text-sm">{desc}</p>}

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag) => (
                <span key={tag} className="text-xs bg-[var(--accent)] bg-opacity-20 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {!pdfUrl?.trim() && (
            <p className="text-xs text-[var(--text-secondary)] mb-2">Using a placeholder PDF for now.</p>
          )}

          <div className="flex flex-wrap gap-3" onClick={stopPropagation}>
            <button 
              onClick={handlePreviewClick} 
              className="text-[var(--accent)] hover:opacity-80 flex items-center transition-opacity"
              type="button"
            >
              Preview Notes <i className="fas fa-eye ml-2" />
            </button>

            <a
              href={effectiveUrl}
              download
              onClick={stopPropagation}
              className="text-[var(--accent)] hover:opacity-80 flex items-center transition-opacity"
              rel="noopener noreferrer"
            >
              Download <i className="fas fa-download ml-2" />
            </a>

            <a
              href={effectiveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={stopPropagation}
              className="text-[var(--accent)] hover:opacity-80 flex items-center transition-opacity"
            >
              Open in New Tab <i className="fas fa-arrow-up-right-from-square ml-2" />
            </a>
          </div>
        </div>
      </article>

      {/* Internal modal only if enabled */}
      {useInternalModal && open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-[2px]"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-label={`${title} preview`}
        >
          <div
            className="relative w-[95vw] h-[85vh] bg-[var(--surface)] rounded-xl overflow-hidden shadow-xl"
            onClick={stopPropagation}
          >
            <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-between px-4 bg-[var(--surface-2)] border-b border-white/10 z-10">
              <span className="text-sm md:text-base font-medium truncate">{title}</span>
              <div className="flex items-center gap-3 flex-shrink-0">
                <a 
                  href={effectiveUrl} 
                  download 
                  className="text-[var(--accent)] hover:opacity-80 text-sm transition-opacity" 
                  rel="noopener noreferrer"
                >
                  Download
                </a>
                <a 
                  href={effectiveUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[var(--accent)] hover:opacity-80 text-sm transition-opacity"
                >
                  Open New Tab
                </a>
                <button 
                  onClick={closeModal} 
                  className="hover:opacity-80 text-sm transition-opacity"
                  type="button"
                  aria-label="Close preview"
                >
                  Close ✕
                </button>
              </div>
            </div>

            <div className="pt-12 w-full h-full relative">
              {isLoading && !failed && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="animate-pulse text-xs text-[var(--text-secondary)]">Loading preview…</div>
                </div>
              )}

              {failed && (
                <div className="absolute inset-0 flex items-center justify-center px-6 text-center z-20">
                  <div className="space-y-3">
                    <p className="text-sm text-[var(--text-secondary)]">
                      The host may block embedding this PDF. Use <span className="font-medium">Open New Tab</span> or try again.
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      <button 
                        onClick={retry} 
                        className="px-3 py-1 rounded bg-[var(--accent)]/20 hover:bg-[var(--accent)]/30 text-sm transition-colors"
                        type="button"
                      >
                        Retry Preview
                      </button>
                      <a 
                        href={effectiveUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="px-3 py-1 rounded border border-white/10 text-sm hover:bg-white/5 transition-colors"
                      >
                        Open New Tab
                      </a>
                    </div>
                  </div>
                </div>
              )}

              <iframe
                id={iframeId}
                title={`${title} preview`}
                src={`${effectiveUrl}#toolbar=0&navpanes=0&view=FitH`}
                className="w-full h-full"
                loading="lazy"
                referrerPolicy="no-referrer"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}