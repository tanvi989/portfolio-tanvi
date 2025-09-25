"use client";

import Link from "next/link";

type DockItem =
  | { icon: string; label: string; href: string; download?: boolean } // internal file/route
  | { icon: string; label: string; href: string; external: true; target?: "_blank" | "_self"; rel?: string };

export default function Dock() {
  const items: DockItem[] = [
    // Home (internal route)
    { icon: "fa-home", label: "Home", href: "/" },

    // CV (serving /public/cv.pdf). Put your PDF in /public/cv.pdf
    { icon: "fa-file-alt", label: "CV (PDF)", href: "/cv.pdf", download: true },

    // LinkedIn (external)
    {
      icon: " fab fa-linkedin",
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/your-handle",
      external: true,
      target: "_blank",
      rel: "noopener noreferrer",
    },

    // Chat — pick one:
    // a) internal contact page:
    { icon: "fa-comments", label: "Chat", href: "/contact" },
    // b) OR WhatsApp deep link (replace number), uncomment if you prefer:
    // { icon: "fa-comments", label: "WhatsApp", href: "https://wa.me/15551234567", external: true },

    // Call (tel:)
    {
      icon: "fa-phone",
      label: "Call",
      href: "tel:+91 9969953445",
      external: true,
    },

    // GitHub (external)
    {
      icon: "fab fa-github",
      label: "GitHub",
      href: "https://github.com/tanvi989",
      external: true,
      target: "_blank",
      rel: "noopener noreferrer",
    },

    // Email (mailto:)
    {
      icon: "fa-envelope",
      label: "Email",
      href: "mailto:paradkartanvii@gmail.com",
      external: true,
    },

    // Settings (keep if you like; point anywhere)
    // { icon: "fa-cog", label: "Settings", href: "/settings" },
  ];

  return (
    <div className="mac-dock">
      {items.map((item) => {
        const content = (
          <>
            <i className={`fas ${item.icon}`} aria-hidden="true" />
            <span className="sr-only">{item.label}</span>
         
          </>
        );

        // Internal routes/files (start with "/") use <Link>
        const isInternal = !("external" in item) && item.href.startsWith("/");

        return (
          <div key={item.label} className="dock-item" role="button">
            {isInternal ? (
              <Link href={item.href} aria-label={item.label} download={"download" in item ? item.download : undefined}>
                {content}
              </Link>
            ) : (
              <a
                href={item.href}
                aria-label={item.label}
                target={"external" in item ? item.target : undefined}
                rel={"external" in item ? item.rel : undefined}
              >
                {content}
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}
