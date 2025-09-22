"use client";

import { useState } from "react";

export default function FloatingActions() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Action buttons (slide out when open) */}
      {open && (
        <div className="flex flex-col gap-3 mb-2 animate-in fade-in slide-in-from-bottom-1">
          <a
            href="https://wa.me/919999999999" // replace with your WhatsApp number
            target="_blank"
            className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500 shadow-lg hover:scale-110 transition"
            aria-label="WhatsApp"
          >
            <i className="fab fa-whatsapp text-white text-2xl" />
          </a>
          <a
            href="tel:+919999999999" // replace with your number
            className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 shadow-lg hover:scale-110 transition"
            aria-label="Call"
          >
            <i className="fas fa-phone text-white text-xl" />
          </a>
          <a
            href="mailto:you@example.com"
            className="flex items-center justify-center w-12 h-12 rounded-full bg-rose-500 shadow-lg hover:scale-110 transition"
            aria-label="Email"
          >
            <i className="fas fa-envelope text-white text-xl" />
          </a>
        <button
  onClick={() => {
    // open the widget via a global custom event
    window.dispatchEvent(new Event("open-chatbot"));
  }}
  className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500 shadow-lg hover:scale-110 transition"
  aria-label="Chatbot"
>
  <i className="fas fa-robot text-white text-xl" />
</button>
        </div>
      )}

      {/* Main toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-[var(--accent)] shadow-xl hover:scale-110 transition"
        aria-label="Toggle quick actions"
      >
        {open ? (
          <i className="fas fa-times text-white text-2xl" />
        ) : (
          <i className="fas fa-comments text-white text-2xl" />
        )}
      </button>
    </div>
  );
}
