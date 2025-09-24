// components/Popup.tsx
"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

type PopupProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  // optional: where to portal (defaults to document.body)
  portalTarget?: HTMLElement | null;
};

export default function Popup({
  open,
  onClose,
  title = "Dialog",
  children,
  portalTarget,
}: PopupProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Basic focus management: move focus into dialog when opened
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    return () => prev?.focus();
  }, [open]);

  // click outside to close
  const handleOverlayClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const content = !open ? null : (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      aria-hidden={false}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="w-full max-w-md rounded-xl bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-2xl outline-none"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200/70 dark:border-neutral-800/70">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <i className="fas fa-xmark text-xl" />
          </button>
        </div>

        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  );

  if (typeof window === "undefined") return null;
  return createPortal(content, portalTarget ?? document.body);
}
