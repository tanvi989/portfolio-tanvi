"use client";
import { useEffect, useState } from "react";

export default function RealCoffeeCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // tweak these to position the cup relative to the pointer
  const OFFSET_X = 20;
  const OFFSET_Y = -8;

  return (
    <div
      className="pointer-events-none fixed z-[9999]"
      style={{ left: pos.x + OFFSET_X, top: pos.y + OFFSET_Y }}
      aria-hidden
    >
      <svg
        width="54"
        height="54"
        viewBox="0 0 108 108"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ------ defs (gradients + filters) ------ */}
        <defs>
          {/* porcelain gloss */}
          <radialGradient id="cupGloss" cx="35%" cy="25%" r="75%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="35%" stopColor="#ffffff" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#e8ecf3" stopOpacity="1" />
          </radialGradient>

          {/* rim shadow */}
          <linearGradient id="rimShade" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#cfd6e2" />
            <stop offset="100%" stopColor="#e9edf4" />
          </linearGradient>

          {/* saucer gloss */}
          <radialGradient id="saucerGloss" cx="50%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#e8ecf3" />
          </radialGradient>

          {/* coffee surface: rich brown + vignette */}
          <radialGradient id="coffeeTop" cx="45%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#5a2e12" />
            <stop offset="60%" stopColor="#3a1f0e" />
            <stop offset="100%" stopColor="#2a160a" />
          </radialGradient>

          {/* coffee specular highlight */}
          <radialGradient id="coffeeHighlight" cx="32%" cy="24%" r="25%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>

          {/* shadow under saucer */}
          <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
            <feOffset dy="2" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.35" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* steam blur */}
          <filter id="steamBlur" x="-200%" y="-200%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="2.2" />
          </filter>
        </defs>

        {/* ------ subtle ground shadow (below saucer) ------ */}
        <ellipse
          cx="54"
          cy="88"
          rx="26"
          ry="6.5"
          fill="rgba(0,0,0,0.18)"
          filter="url(#softShadow)"
        />

        {/* ------ saucer ------ */}
        <g transform="translate(0,4)">
          <ellipse cx="54" cy="78" rx="34" ry="10" fill="url(#saucerGloss)" />
          {/* inner cut / well */}
          <ellipse cx="54" cy="78" rx="20" ry="6" fill="#dfe6f1" opacity="0.7" />
        </g>

        {/* ------ cup body ------ */}
        <g>
          {/* outer body */}
          <path
            d="M22 38 h52 v20 c0 14-12 26-26 26h-0c-14 0-26-12-26-26V38z"
            fill="url(#cupGloss)"
          />
          {/* rim */}
          <rect x="22" y="34" width="52" height="8" rx="4" fill="url(#rimShade)" />
          {/* inner rim ellipse to add depth */}
          <ellipse cx="48" cy="42" rx="24" ry="5.4" fill="#cfd6e2" opacity="0.65" />
        </g>

        {/* ------ handle (with inner shadow) ------ */}
        <g>
          <path
            d="M74 46c9 0 17 7.2 17 16s-8 16-17 16l-4-3c6 0 11-5 11-11s-5-11-11-11l4-7z"
            fill="url(#cupGloss)"
            stroke="#d7deea"
            strokeWidth="2"
          />
        </g>

        {/* ------ coffee surface ------ */}
        <g>
          {/* liquid */}
          <ellipse cx="48" cy="44" rx="22" ry="5.2" fill="url(#coffeeTop)" />
          {/* highlight */}
          <ellipse cx="42" cy="41.8" rx="9" ry="2.2" fill="url(#coffeeHighlight)" />
          {/* slight rim darkening */}
          <ellipse cx="48" cy="44" rx="22" ry="5.2" fill="#000" opacity="0.06" />
        </g>

        {/* ------ steam (animated, blurred, subtle) ------ */}
        <g filter="url(#steamBlur)" opacity="0.85">
          <path
            d="M36 20 C38 16, 34 14, 36 10 C38 6, 34 4, 36 0"
            stroke="#ffffff"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
            className="coffee-steam-1"
          />
          <path
            d="M44 18 C46 14, 42 12, 44 8 C46 5, 42 3, 44 0"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            className="coffee-steam-2"
          />
          <path
            d="M52 22 C54 18, 50 16, 52 12 C54 8, 50 6, 52 2"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            className="coffee-steam-3"
          />
        </g>

        {/* gentle bob to feel alive */}
        <animateTransform
          attributeName="transform"
          type="translate"
          dur="2.2s"
          values="0 0; 0 -0.6; 0 0"
          repeatCount="indefinite"
        />
      </svg>
    </div>
  );
}
