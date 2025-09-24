'use client';

import Image from 'next/image';
import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Service = {
  id: string;
  title: string;
  bullets: string[];
  cta: string;
  // big background color behind the image card (matches your mockups)
  bg: string; // any valid CSS color
  // optional accent for the card's bottom stripe / shadow glow
  accent?: string;
  img: string; // public/ path
};

const SERVICES: Service[] = [
  {
    id: 'web',
    title: 'WEBSITE DEVELOPMENT',
    bullets: [
      'Custom Website Design — tailored to your brand.',
      'E-commerce Solutions — secure, scalable, sales-ready.',
      'Responsive Design — seamless across all devices.',
    ],
    cta: 'Start Your Project',
    bg: '#D9A38E', // peach
    accent: '#B76500',
    img: '/services/web.png',
  },
  {
    id: 'app',
    title: 'APP DEVELOPMENT',
    bullets: [
      'iOS & Android — custom native apps.',
      'UI/UX Design — beautiful & user-friendly.',
      'Cross-Platform — reach more devices.',
    ],
    cta: 'Learn More About Our Apps',
    bg: '#CFF3B5', // mint
    accent: '#8D5CF6',
    img: '/services/app.png',
  },
  {
    id: 'video',
    title: 'VIDEO EDITING',
    bullets: [
      'Promotional Videos — showcase your offer.',
      'Corporate Videos — internal & external comms.',
      'Social Media Content — IG, FB, YouTube.',
    ],
    cta: 'Transform Your Videos',
    bg: '#DCC0EF', // lavender
    accent: '#53C2D1',
    img: '/services/video.png',
  },
  {
    id: 'logo',
    title: 'LOGO DESIGNING',
    bullets: [
      'Custom Logos — unique & memorable.',
      'Brand Identity — cohesive visual systems.',
      'Multiple Concepts & Revisions.',
    ],
    cta: 'Get Your Custom Logo',
    bg: '#A9D9EC', // light blue
    accent: '#F5EFA4',
    img: '/services/logo.png',
  },
  {
    id: 'smm',
    title: 'SOCIAL MEDIA MANAGEMENT',
    bullets: [
      'Content Creation — posts, stories, videos.',
      'Community Management — engagement & support.',
      'Strategy Development — tailored to your brand.',
    ],
    cta: 'Boost Your Social Media',
    bg: '#F6F28F', // light yellow
    accent: '#D1C1C1',
    img: '/services/smm.png',
  },
  {
    id: 'shoots',
    title: 'PROFESSIONAL SHOOTS',
    bullets: [
      'Studio Photography — perfect lighting.',
      'Lifestyle Photography — real-life scenarios.',
      'High-Resolution Images — print & digital.',
    ],
    cta: 'Book Your Product Shoot',
    bg: '#F1A3A0', // coral
    accent: '#FFE79A',
    img: '/services/shoots.png',
  },
];

export default function ServicesPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    if (!containerRef.current || !rightRef.current) return;

    const ctx = gsap.context(() => {
      // pin the right column while we scroll through all sections
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: () =>
          `+=${(SERVICES.length - 1) * window.innerHeight}`, // total scroll distance
        pin: rightRef.current,
        pinSpacing: false,
      });

      // one trigger per section to switch slide
      SERVICES.forEach((service, i) => {
        ScrollTrigger.create({
          trigger: `#slide-${service.id}`,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => setActive(i),
          onEnterBack: () => setActive(i),
        });
      });

      // fade image layers on change
      // (each image is stacked absolute and we animate opacity)
      gsap.utils.toArray<HTMLElement>('.rs-image').forEach((el, i) => {
        gsap.set(el, { autoAlpha: i === 0 ? 1 : 0 });
        ScrollTrigger.create({
          trigger: `#slide-${SERVICES[i].id}`,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => gsap.to(el, { autoAlpha: 1, duration: 0.4, overwrite: 'auto' }),
          onEnterBack: () => gsap.to(el, { autoAlpha: 1, duration: 0.4, overwrite: 'auto' }),
          onLeave: () => gsap.to(el, { autoAlpha: 0, duration: 0.4, overwrite: 'auto' }),
          onLeaveBack: () => gsap.to(el, { autoAlpha: 0, duration: 0.4, overwrite: 'auto' }),
        });
      });

      // background color tween on the fixed card wrapper
      const bgEl = document.querySelector<HTMLElement>('#rs-bg');
      if (!bgEl) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: () =>
            `+=${(SERVICES.length - 1) * window.innerHeight}`,
          scrub: true,
          snap: {
            snapTo: (value: number) => {
              // snap to nearest slide
              const sectionHeight = 1 / (SERVICES.length - 1);
              return Math.round(value / sectionHeight) * sectionHeight;
            },
            duration: 0.2,
            inertia: false,
          },
        },
      });

      SERVICES.forEach((s, i) => {
        if (i === 0) {
          gsap.set(bgEl, { backgroundColor: s.bg });
        } else {
          tl.to(bgEl, { backgroundColor: s.bg, duration: 1 }, i - 1);
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main className="min-h-screen">
      {/* OUTER SCROLLER */}
      <div ref={containerRef}>
        {/* grid: left scrollable sections, right pinned card */}
        <div className="relative grid grid-cols-1 lg:grid-cols-12">
          {/* LEFT: sections */}
          <div className="lg:col-span-6">
            {SERVICES.map((s) => (
              <section
                id={`slide-${s.id}`}
                key={s.id}
                className="min-h-screen flex items-center px-6 md:px-12"
              >
                <div className="max-w-2xl">
                  <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
                    {s.title}
                  </h2>
                  <ul className="space-y-3 text-neutral-700 text-lg md:text-xl">
                    {s.bullets.map((b, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span>•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <button 
                    className="mt-8 rounded-full border px-5 py-3 text-sm md:text-base hover:shadow-sm transition-shadow"
                    type="button"
                  >
                    {s.cta}
                  </button>
                </div>
              </section>
            ))}
          </div>

          {/* RIGHT: pinned visual */}
          <div className="lg:col-span-6 lg:min-h-screen">
            <div
              ref={rightRef}
              className="lg:sticky lg:top-0 h-[70vh] lg:h-screen flex items-center justify-center"
            >
              {/* rounded colorful block */}
              <div
                id="rs-bg"
                className="relative w-[92%] md:w-[86%] lg:w-[80%] h-[78%] md:h-[70%] rounded-[36px] transition-colors duration-300 shadow-[0_30px_80px_rgba(0,0,0,0.15)]"
              >
                {/* accent stripe (bottom) */}
                <div
                  className="absolute left-6 right-6 bottom-6 h-6 rounded-full opacity-70"
                  style={{ background: SERVICES[active]?.accent ?? 'rgba(0,0,0,0.08)' }}
                />

                {/* image stack */}
                <div className="absolute inset-0 flex items-center justify-center p-6 md:p-10">
                  {SERVICES.map((s, i) => (
                    <div
                      className="rs-image absolute inset-0 flex items-center justify-center"
                      key={s.id}
                      style={{ zIndex: i + 1 }}
                    >
                      <div className="relative w-[92%] h-[70%] md:w-[560px] md:h-[340px] lg:w-[640px] lg:h-[380px] rounded-[22px] overflow-hidden shadow-xl">
                        <Image
                          src={s.img}
                          alt={s.title}
                          fill
                          sizes="(min-width:1024px) 640px, 92vw"
                          className="object-cover"
                          priority={i === 0}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* small slide indicator (optional) */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden lg:flex gap-2">
                {SERVICES.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1 w-8 rounded-full transition-all ${
                      i === active ? 'opacity-100 bg-black' : 'opacity-30 bg-black'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}