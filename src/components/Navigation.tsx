"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { NAV_LINKS } from "../lib/constants";
import FxToggle from "./FxToggle";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: highlight the section currently in view
  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href);
    const sections = ids
      .map((id) => document.querySelector(id))
      .filter((el): el is Element => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5] }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const openPalette = () => {
    setOpen(false);
    window.dispatchEvent(new CustomEvent("open-command-palette"));
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl bg-[#0B1110]/60 border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-base font-semibold tracking-tight text-white flex items-center gap-2"
          aria-label="Home"
        >
          <span className="inline-flex items-center gap-1 text-sm font-bold tracking-tight">
            <span className="inline-block w-6 h-6 rounded bg-[#00FF66] text-[#030507] leading-none text-xs flex items-center justify-center font-mono">
              T
            </span>
            <span className="font-mono text-xs text-[#00E5FF] ml-0.5">N</span>
          </span>
          <span className="text-xs font-mono uppercase tracking-widest text-[#A7B0B0]">
            Trinetra
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`relative text-sm transition-colors py-1 ${
                active === link.href ? "text-[#00FF66]" : "text-white/70 hover:text-white"
              }`}
            >
              {link.label}
              {active === link.href && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute -bottom-0.5 left-0 right-0 h-px bg-[#00FF66] shadow-[0_0_8px_#00FF66]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </a>
          ))}

          <button
            onClick={openPalette}
            aria-label="Open command palette"
            title="Command palette (Ctrl/⌘ + K)"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-white/15 text-[#A7B0B0] hover:border-[#00E5FF]/50 hover:text-[#00E5FF] font-mono text-[10px] tracking-wider transition-colors"
          >
            <span>⌘K</span>
            <span className="hidden lg:inline">SEARCH</span>
          </button>

          <FxToggle />

          <a
            href="https://github.com/trinetrayelukuru"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium px-3.5 py-1.5 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-colors"
          >
            GitHub
          </a>
        </div>

        {/* Mobile toggle */}
        <div className="flex md:hidden items-center gap-2">
          <FxToggle />
          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-white/20 text-white"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span className="sr-only">Menu</span>
            <span
              className={`block w-5 h-0.5 bg-white transition-transform duration-300 ${
                open ? "translate-y-[3px] rotate-45" : ""
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-white transition-transform duration-300 ${
                open ? "-translate-y-[3px] -rotate-45" : "mt-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden backdrop-blur-xl bg-[#0B1110]/70 border-b border-white/10"
        >
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-4 flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`text-base py-1 ${
                  active === link.href ? "text-[#00FF66]" : "text-white/80 hover:text-white"
                }`}
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={openPalette}
              className="text-left text-base text-[#00E5FF] py-1"
            >
              ⌘K — Command palette
            </button>
            <a
              href="https://github.com/trinetrayelukuru"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="text-base font-medium px-3.5 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-colors w-fit"
            >
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/yelkuru-trinetra-11b75124b" target="_blank" rel="noopener noreferrer" className="text-sm font-medium px-3.5 py-1.5 rounded-lg border border-[#00E5FF]/30 text-[#00E5FF] hover:bg-[#00E5FF]/10 transition-colors w-fit">LinkedIn</a>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
