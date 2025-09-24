// components/Navbar.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Popup from "./Popup";

// --- your existing types & constants ---
type Theme = "black" | "white" | "blue" | "purple" | "green" | "orange" | "pink";
const THEMES: Theme[] = ["black", "white", "blue", "purple", "green", "orange", "pink"];

type CountryKey = "USA" | "UK" | "India" | "Australia" | "Germany";
const COUNTRY_META: Record<CountryKey, { label: string; tz: string }> = {
  USA: { label: "🇺🇸 USA", tz: "America/New_York" },
  UK: { label: "🇬🇧 UK", tz: "Europe/London" },
  India: { label: "🇮🇳 India", tz: "Asia/Kolkata" },
  Australia: { label: "🇦🇺 Australia", tz: "Australia/Sydney" },
  Germany: { label: "🇩🇪 Germany", tz: "Europe/Berlin" },
};
const COUNTRY_ORDER: CountryKey[] = ["USA", "UK", "India", "Australia", "Germany"];

function detectCountryKey(tz?: string): CountryKey | null {
  if (!tz) return null;
  if (tz === "Asia/Kolkata") return "India";
  if (tz === "Europe/London") return "UK";
  if (tz === "Europe/Berlin") return "Germany";
  if (tz.startsWith("Australia/")) return "Australia";
  if (
    tz === "America/New_York" || tz === "America/Detroit" || tz === "America/Indiana/Indianapolis" ||
    tz === "America/Chicago" || tz === "America/Denver" || tz === "America/Phoenix" ||
    tz === "America/Los_Angeles" || tz === "America/Anchorage" || tz === "Pacific/Honolulu"
  ) return "USA";
  if (tz === "Europe/Dublin" || tz === "Europe/Lisbon") return "UK";
  if (
    tz === "Europe/Paris" || tz === "Europe/Amsterdam" || tz === "Europe/Prague" ||
    tz === "Europe/Stockholm" || tz === "Europe/Rome" || tz === "Europe/Madrid"
  ) return "Germany";
  return null;
}

export default function Navbar() {
  const [theme, setTheme] = useState<Theme>("black");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [country, setCountry] = useState<CountryKey>("USA");
  const [time, setTime] = useState("");
  const [loginOpen, setLoginOpen] = useState(false); // NEW: popup

  // hydrate + autodetect country once
  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedTheme = (localStorage.getItem("theme") as Theme | null) ?? "black";
    setTheme(savedTheme);

    const savedCountry = localStorage.getItem("countryKey") as CountryKey | null;
    if (savedCountry) {
      setCountry(savedCountry);
    } else {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const detected = detectCountryKey(tz);
      setCountry(detected ?? "USA");
      localStorage.setItem("countryKey", detected ?? "USA");
    }
  }, []);

  // apply theme to <body> and persist
  useEffect(() => {
    if (typeof document === "undefined") return;
    const body = document.body;
    body.classList.remove("theme-white","theme-blue","theme-purple","theme-green","theme-orange","theme-pink");
    if (theme !== "black") body.classList.add(`theme-${theme}`);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // persist country
  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("countryKey", country);
  }, [country]);

  // live time in selected country's timezone
  const countryTZ = useMemo(() => COUNTRY_META[country].tz, [country]);
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const formatted = new Intl.DateTimeFormat(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: countryTZ,
      }).format(now);
      setTime(formatted);
    };
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, [countryTZ]);

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
            {/* Time */}
            {time && (
              <div className="text-sm font-mono hidden lg:block" aria-label={`Local time in ${country}`}>
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
                <span>{COUNTRY_META[country].label}</span>
                <i className="fas fa-chevron-down text-xs" />
              </button>

              <div className={`country-options ${countryOpen ? "show" : ""}`} role="listbox">
                {COUNTRY_ORDER.map(key => {
                  const selected = country === key;
                  const { label } = COUNTRY_META[key];
                  const [flag, ...rest] = label.split(" ");
                  return (
                    <div
                      key={key}
                      className={`country-option ${selected ? "active" : ""}`}
                      role="option"
                      aria-selected={selected}
                      onClick={() => { setCountry(key); setCountryOpen(false); }}
                    >
                      <span>{flag}</span>
                      <span>{rest.join(" ")}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Theme dots (desktop) */}
            <div className="hidden md:flex space-x-2" role="radiogroup" aria-label="Theme">
              {THEMES.map(ThemeDot)}
            </div>

            {/* Login icon button */}
            <button
              onClick={() => setLoginOpen(true)}
              className="ml-1 p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="Open login"
            >
              <i className="fas fa-user-circle text-xl text-lg" />
            </button>

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

      {/* Existing Mobile Menu & overlay (unchanged) */}
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
        <button className="mobile-menu-close" onClick={() => setMobileOpen(false)} aria-label="Close menu">
          <i className="fas fa-times" />
        </button>

        {["about","projects","skills","contact"].map(p => (
          <Link key={p} href={`/${p}`} className="mobile-menu-item" onClick={() => setMobileOpen(false)}>
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

      {/* LOGIN POPUP */}
      <Popup open={loginOpen} onClose={() => setLoginOpen(false)} title="Sign in">
        <div className="space-y-3">
          <button
            className="w-full flex items-center justify-center gap-3 px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            aria-label="Continue with Google"
            onClick={() => alert("TODO: hook up Google auth")}
          >
            <i className="fab fa-google" />
            <span>Continue with Google</span>
          </button>

          <button
            className="w-full flex items-center justify-center gap-3 px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            aria-label="Continue with GitHub"
            onClick={() => alert("TODO: hook up GitHub auth")}
          >
            <i className="fab fa-github" />
            <span>Continue with GitHub</span>
          </button>

          <button
            className="w-full flex items-center justify-center gap-3 px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            aria-label="Continue with Email"
            onClick={() => alert("TODO: open email form")}
          >
            <i className="fas fa-envelope" />
            <span>Continue with Email</span>
          </button>

          <div className="text-xs text-neutral-500 dark:text-neutral-400 pt-2">
            By continuing, you agree to our <a href="/terms" className="underline">Terms</a> and <a href="/privacy" className="underline">Privacy Policy</a>.
          </div>
        </div>
      </Popup>
    </>
  );
}
