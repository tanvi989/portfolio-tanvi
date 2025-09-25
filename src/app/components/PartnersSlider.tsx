"use client";

import { useRef } from "react";

type Partner = {
  name: string;
  logo: string; // path or URL to logo
  href?: string;
};

const partners: Partner[] = [
  { name: "Coexivity", logo: "https://coexivity.com/images/Logo.png", href: "https://google.com" },
  { name: "Vidyavault", logo: "https://vidyavault.in/wp-content/uploads/2025/02/cropped-cropped-vidyavault-site-icon-1.png", href: "https://aws.amazon.com" },
  { name: "Microsoft", logo: "https://www.logodesignworks.com/wp-content/uploads/2022/04/terapixel-software-logo-design-mw-mul-pqfz-.jpg", href: "https://microsoft.com" },
  { name: "Stripe", logo: "https://cdn.freebiesupply.com/logos/thumbs/1x/riofruits-logo.png", href: "https://stripe.com" },
  { name: "Firebase", logo: "https://images-platform.99static.com//sgzID3QK8tFq0onPirUvDlcXCkk=/105x99:729x722/fit-in/500x500/99designs-contests-attachments/110/110955/attachment_110955726", href: "https://firebase.google.com" },
  { name: "Vercel", logo: "https://images.seeklogo.com/logo-png/51/1/curtiss-logo-png_seeklogo-510882.png", href: "https://vercel.com" },
];

export default function PartnersSlider() {
  const sliderRef = useRef<HTMLDivElement>(null);


  return (
    <section className="mt-24 relative">
      <h2 className="text-2xl font-bold mb-8 text-center">Our Partners</h2>

      <div className="relative">
       
        {/* Scrollable row */}
        <div
          ref={sliderRef}
          className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar px-10"
        >
          {partners.map((p) => (
            <div
              key={p.name}
              className="min-w-[140px] md:min-w-[180px] flex-shrink-0 flex items-center justify-center bg-white rounded-lg shadow "
            >
              {p.href ? (
                <a href={p.href} target="_blank" rel="noopener noreferrer">
                  <img
                    src={p.logo}
                    alt={p.name}
                    className="h-12 w-auto object-contain grayscale hover:grayscale-0 transition"
                  />
                </a>
              ) : (
                <img
                  src={p.logo}
                  alt={p.name}
                  className="h-12 w-auto object-contain grayscale hover:grayscale-0 transition"
                />
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
