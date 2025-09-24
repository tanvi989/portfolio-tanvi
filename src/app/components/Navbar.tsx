"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Theme = "black" | "white" | "blue" | "purple" | "green" | "orange" | "pink";
const THEMES: Theme[] = ["black", "white", "blue", "purple", "green", "orange", "pink"];

export default function Navbar() {
  const [theme, setTheme] = useState<Theme>("black");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [country, setCountry] = useState("🇺🇸 USA");
  const [time, setTime] = useState(""); // Added missing time state

  // hydrate theme
  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("theme")) as Theme | null;
    const t = saved ?? "black";
    setTheme(t);
  }, []);

  // apply theme to <body> and persist
  useEffect(() => {
    const body = document.body;
    body.classList.remove("theme-white","theme-blue","theme-purple","theme-green","theme-orange","theme-pink");
    if (theme !== "black") body.classList.add(`theme-${theme}`);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // live time
  useEffect(() => {
    const update = () => {
      const d = new Date();
      const h = d.getHours().toString().padStart(2,"0");
      const m = d.getMinutes().toString().padStart(2,"0");
      setTime(`${h}:${m}`);
    };
    update();
    const t = setInterval(update, 60_000);
    return () => clearInterval(t);
  }, []);

  const ThemeDot = (t: Theme) => (
    <button
      key={t}
      type="button"
      className={`theme-selector dot-${t} ${theme === t ? "active" : ""}`}
      onClick={() => { setTheme(t); setMobileOpen(false); }}
      role="radio"
      aria-checked={theme === t}
      aria-label={`Switch to ${t} theme`}
      title={`${t[0].toUpperCase() + t.slice(1)} theme`}
    />
  );

  return (
    <>
      {/* Top Nav */}
      <nav className="fixed w-full py-4 px-6 z-50 backdrop-blur-lg bg-opacity-20" style={{ top: 0 }}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-semibold">Tanvi Paradkar</Link>

          <div className="hidden md:flex space-x-6">
            <Link href="/about" className="hover:text-[var(--accent)] transition">About me</Link>
            <Link href="/projects" className="hover:text-[var(--accent)] transition">Projects</Link>
            <Link href="/skills" className="hover:text-[var(--accent)] transition">Skills</Link>
            <Link href="/contact" className="hover:text-[var(--accent)] transition">Contact</Link>
          </div>

          <div className="flex items-center space-x-3">
            {/* Time Display (if needed) */}
            {time && (
              <div className="text-sm font-mono hidden lg:block">
                {time}
              </div>
            )}

            {/* Country Selector */}
            <div className="country-selector relative">
              <button 
                className="country-dropdown" 
                onClick={() => setCountryOpen(v => !v)}
                aria-expanded={countryOpen}
                aria-haspopup="listbox"
              >
                <span>{country}</span>
                <i className="fas fa-chevron-down text-xs" />
              </button>

              <div className={`country-options ${countryOpen ? "show" : ""}`} role="listbox">
                {["🇺🇸 USA","🇬🇧 UK","🇮🇳 India","🇦🇺 Australia","🇩🇪 Germany"].map(c => (
                  <div
                    key={c}
                    className="country-option"
                    role="option"
                    aria-selected={country === c}
                    onClick={() => { setCountry(c); setCountryOpen(false); }}
                  >
                    <span>{c.split(" ")[0]}</span>
                    <span>{c.split(" ").slice(1).join(" ")}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Theme dots (desktop) */}
            <div className="hidden md:flex space-x-2" role="radiogroup" aria-label="Theme">
              {THEMES.map(ThemeDot)}
            </div>

            {/* Mobile menu button */}
            <button 
              className="md:hidden" 
              onClick={() => setMobileOpen(true)} 
              aria-label="Open menu"
              aria-expanded={mobileOpen}
            >
              <i className="fas fa-bars text-xl" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div 
        className={`mobile-menu-overlay ${mobileOpen ? "active" : ""}`} 
        onClick={() => setMobileOpen(false)}
        aria-hidden={!mobileOpen}
      />
      <div 
        className={`mobile-menu ${mobileOpen ? "active" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <button
          className="mobile-menu-close"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <i className="fas fa-times" />
        </button>

        {["about","projects","skills","contact"].map(p => (
          <Link 
            key={p} 
            href={`/${p}`} 
            className="mobile-menu-item" 
            onClick={() => setMobileOpen(false)}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </Link>
        ))}

        <div className="mt-4">
          <h3 className="text-center mb-2">Select Theme</h3>
          <div className="mobile-theme-selector" role="radiogroup" aria-label="Theme">
            {THEMES.map(ThemeDot)}
          </div>
        </div>
      </div>
    </>
  );
}