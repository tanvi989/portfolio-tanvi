// components/Navbar.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Popup from "./Popup";

// --- types & constants ---
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
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [country, setCountry] = useState<CountryKey>("USA");
  const [time, setTime] = useState("");
  const [loginOpen, setLoginOpen] = useState(false);

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

  const openMobileMenu = () => {
    setMobileOpen(true);
    setMobileMoreOpen(false);
  };

  return (
    <>
      {/* Top Nav */}
      <nav className="fixed inset-x-0 top-0 z-50 py-3 px-4 sm:px-6 backdrop-blur-lg ">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          {/* Left: Brand (no-wrap) */}
          <Link href="/" className="text-base sm:text-lg font-semibold whitespace-nowrap flex-shrink-0">
            Tanvi Paradkar
          </Link>

          {/* Middle: desktop links only */}
          <div className="hidden md:flex items-center space-x-6 min-w-0">
            <Link href="/about" className="hover:text-[var(--accent)] transition">About me</Link>
            <Link href="/projects" className="hover:text-[var(--accent)] transition">Projects</Link>
            <Link href="/skills" className="hover:text-[var(--accent)] transition">Skills</Link>
            <Link href="/contact" className="hover:text-[var(--accent)] transition">Contact</Link>
            <Link href="/blog" className="hover:text-[var(--accent)] transition">Blog</Link>

            <div className="relative">
              <button
                className="hover:text-[var(--accent)] transition inline-flex items-center gap-2"
                onClick={() => setMoreOpen(v => !v)}
                aria-haspopup="menu"
                aria-expanded={moreOpen}
              >
                More
                <i className={`fas fa-chevron-${moreOpen ? "up" : "down"} text-xs`} />
              </button>

             <div
  className={`absolute right-0 mt-2 min-w-[10rem] max-h-[75vh] overflow-auto rounded-lg
              backdrop-blur-xl bg-white/60 dark:bg-neutral-900/50
              ring-1 ring-white/15 dark:ring-black/40 shadow-xl
              ${moreOpen ? "block" : "hidden"}`}
  role="menu"
>

                {[
                  { href: "/travel", label: "Travel" },
                  { href: "/software", label: "Software" },
                  { href: "/education", label: "Education" },
                  { href: "/healthcare", label: "Healthcare" },
                ].map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    role="menuitem"
                    onClick={() => setMoreOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right: controls (no-wrap, no wrap) */}
          <div className="flex items-center gap-2 sm:gap-3 whitespace-nowrap flex-shrink-0">
            {time && (
              <div className="hidden lg:block text-sm font-mono" aria-label={`Local time in ${country}`}>
                {time}
              </div>
            )}

            {/* Country Selector */}
            <div className="relative">
              <button
                className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
                onClick={() => setCountryOpen(v => !v)}
                aria-expanded={countryOpen}
                aria-haspopup="listbox"
              >
                <span className="truncate max-w-[7.5rem] sm:max-w-none">{COUNTRY_META[country].label}</span>
                <i className="fas fa-chevron-down text-xs" />
              </button>

             <div
  className={`absolute right-0 mt-2 w-40 max-h-[60vh] overflow-auto rounded-md
              backdrop-blur-xl bg-white/60 dark:bg-neutral-900/50
              ring-1 ring-white/15 dark:ring-black/40 shadow-xl
              ${countryOpen ? "block" : "hidden"}`}
  role="listbox"
>

                {COUNTRY_ORDER.map(key => {
                  const selected = country === key;
                  const { label } = COUNTRY_META[key];
                  const [flag, ...rest] = label.split(" ");
                  return (
                    <div
                      key={key}
                      className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 ${selected ? "font-medium" : ""}`}
                      role="option"
                      aria-selected={selected}
                      onClick={() => { setCountry(key); setCountryOpen(false); }}
                    >
                      <span>{flag}</span>
                      <span className="truncate">{rest.join(" ")}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Theme dots (desktop) */}
            <div className="hidden md:flex space-x-2" role="radiogroup" aria-label="Theme">
              {THEMES.map(ThemeDot)}
            </div>

            {/* Login icon */}
            <button
              onClick={() => setLoginOpen(true)}
              className="p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="Open login"
            >
              <i className="fas fa-user-circle text-xl" />
            </button>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={openMobileMenu}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
            >
              <i className="fas fa-bars text-xl" />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE: Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden={!mobileOpen}
      />

      {/* MOBILE: Slide-over panel */}
 <div
  className={`fixed inset-y-0 right-0 z-50 w-[84%] max-w-sm
              bg-white/55 dark:bg-neutral-900/40 backdrop-blur-xl
              ring-1 ring-white/15 dark:ring-black/40 shadow-2xl
              transform transition-transform ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
  role="dialog"
  aria-modal="true"
  aria-label="Navigation menu"
>
  {/* Optional: subtle theme-colored wash at the top (uses --accent-rgb if you have it) */}
  <div
    className="pointer-events-none absolute inset-0"
    style={{
      background:
        "linear-gradient(180deg, rgba(var(--accent-rgb, 99 102 241) / 0.16) 0%, rgba(var(--accent-rgb, 99 102 241) / 0.00) 30%)",
    }}
  />

        <button
          className="absolute top-3 right-3 p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <i className="fas fa-times text-xl" />
        </button>

        <div className="pt-[calc(env(safe-area-inset-top,0)+56px)] pb-[calc(env(safe-area-inset-bottom,0)+16px)] px-4">
          {["about","projects","skills","contact","blog"].map(p => (
            <Link
              key={p}
              href={`/${p}`}
              className="block py-3 text-lg"
              onClick={() => setMobileOpen(false)}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </Link>
          ))}

          {/* Mobile "More" */}
          <div className="pt-2">
            <button
              className="w-full flex items-center justify-between py-3 text-lg"
              onClick={() => setMobileMoreOpen(v => !v)}
              aria-expanded={mobileMoreOpen}
              aria-controls="mobile-more-panel"
            >
              <span>More</span>
              <i className={`fas fa-chevron-${mobileMoreOpen ? "up" : "down"} text-sm`} />
            </button>
            <div id="mobile-more-panel" className={`${mobileMoreOpen ? "mt-1 space-y-1" : "hidden"}`}>
              {[
                { href: "/travel", label: "Travel" },
                { href: "/software", label: "Software" },
                { href: "/education", label: "Education" },
                { href: "/healthcare", label: "Healthcare" },
              ].map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block pl-4 pr-2 py-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Theme picker (mobile) */}
          <div className="mt-4">
            <h3 className="text-center mb-2">Select Theme</h3>
            <div className="flex flex-wrap items-center justify-center gap-2" role="radiogroup" aria-label="Theme">
              {THEMES.map(ThemeDot)}
            </div>
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
            By continuing, you agree to our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.
          </div>
        </div>
      </Popup>

      {/* spacer under fixed nav */}
      <div className="h-[64px]" />
    </>
  );
}
