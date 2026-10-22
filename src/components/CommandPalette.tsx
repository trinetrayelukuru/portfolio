"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS, PROFILE } from "../lib/constants";
import { cycleFx, getFxSnapshot } from "../lib/fx";

interface Command {
  id: string;
  label: string;
  hint: string;
  group: "Navigate" | "Connect" | "Actions";
  run: () => void;
}

function scrollToSection(href: string) {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function openExternal(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

/**
 * Command palette (Ctrl/Cmd+K): quick navigation, links, and actions.
 * Opened globally via the `open-command-palette` window event too.
 */
export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const commands = useMemo<Command[]>(
    () => [
      ...NAV_LINKS.map((link) => ({
        id: `nav-${link.href}`,
        label: link.label,
        hint: link.href,
        group: "Navigate" as const,
        run: () => scrollToSection(link.href),
      })),
      {
        id: "nav-home",
        label: "Home",
        hint: "#home",
        group: "Navigate",
        run: () => scrollToSection("#home"),
      },
      {
        id: "ext-github",
        label: "GitHub profile",
        hint: "@trinetrayelukuru",
        group: "Connect",
        run: () => openExternal(PROFILE.github),
      },
      {
        id: "ext-linkedin",
        label: "LinkedIn profile",
        hint: "yelkuru-trinetra",
        group: "Connect",
        run: () => openExternal(PROFILE.linkedin),
      },
      {
        id: "ext-email",
        label: "Send email",
        hint: PROFILE.email,
        group: "Connect",
        run: () => {
          window.location.href = `mailto:${PROFILE.email}`;
        },
      },
      {
        id: "act-fx",
        label: "Cycle visual effects (FX)",
        hint: `now: ${getFxSnapshot()}`,
        group: "Actions",
        run: () => cycleFx(),
      },
      {
        id: "act-top",
        label: "Scroll to top",
        hint: "#home",
        group: "Actions",
        run: () => window.scrollTo({ top: 0, behavior: "smooth" }),
      },
    ],
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (c) => c.label.toLowerCase().includes(q) || c.hint.toLowerCase().includes(q)
    );
  }, [commands, query]);

  const execute = useCallback((cmd: Command) => {
    setOpen(false);
    setQuery("");
    // let the overlay close before navigating
    setTimeout(() => cmd.run(), 50);
  }, []);

  // Global open/close shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-command-palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-command-palette", onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  // Keep the selected item in view
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const item = list.children[selected] as HTMLElement | undefined;
    item?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => (s + 1) % Math.max(filtered.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => (s - 1 + filtered.length) % Math.max(filtered.length, 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const cmd = filtered[selected];
      if (cmd) execute(cmd);
    }
  };

  let lastGroup = "";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] px-4"
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-[#030507]/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-lg rounded-xl overflow-hidden bg-[#0B1110]/95 border border-[#00FF66]/30 shadow-[0_0_60px_-12px_rgba(0,255,102,0.35)]"
            onKeyDown={onKeyDown}
          >
            {/* header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
              <span className="font-mono text-[#00FF66] text-sm">&gt;_</span>
              <input
                ref={inputRef}
                value={query}
                 onChange={(e) => {
                   setQuery(e.target.value);
                   setSelected(0);
                 }}
                placeholder="Type a command or search…"
                className="flex-1 bg-transparent text-sm text-[#F5F7F7] placeholder:text-dim outline-none font-mono"
                aria-label="Command search"
              />
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded border border-white/15 text-[10px] font-mono text-[#A7B0B0]">
                ESC
              </kbd>
            </div>

            {/* results */}
            <div ref={listRef} className="max-h-[50vh] overflow-y-auto py-2">
              {filtered.length === 0 && (
                <div className="px-4 py-6 text-center text-sm font-mono text-[#A7B0B0]">
                  NO MATCHES // try &quot;skills&quot;, &quot;github&quot;, &quot;fx&quot;
                </div>
              )}
              {filtered.map((cmd, i) => {
                const showGroup = cmd.group !== lastGroup;
                lastGroup = cmd.group;
                return (
                  <div key={cmd.id}>
                    {showGroup && (
                      <div className="px-4 pt-3 pb-1 text-[10px] font-mono uppercase tracking-[0.2em] text-[#00E5FF]/70">
                        {cmd.group}
                      </div>
                    )}
                    <button
                      onMouseEnter={() => setSelected(i)}
                      onClick={() => execute(cmd)}
                      className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors ${
                        i === selected ? "bg-[#00FF66]/10 text-[#F5F7F7]" : "text-[#A7B0B0]"
                      }`}
                    >
                      <span className="flex items-center gap-2.5 text-sm">
                        <span
                          className={`font-mono text-xs ${
                            i === selected ? "text-[#00FF66]" : "text-dim"
                          }`}
                        >
                          {i === selected ? "▸" : "·"}
                        </span>
                        {cmd.label}
                      </span>
                      <span className="font-mono text-[10px] text-dim">{cmd.hint}</span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* footer */}
            <div className="px-4 py-2.5 border-t border-white/10 flex items-center gap-4 text-[10px] font-mono text-dim">
              <span>↑↓ NAVIGATE</span>
              <span>↵ SELECT</span>
              <span>ESC CLOSE</span>
              <span className="ml-auto text-[#00FF66]/70">CMD/CTRL + K</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
