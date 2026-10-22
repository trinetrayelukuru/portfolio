"use client";

import { cn } from "../lib/utils";

interface TechMarqueeProps {
  items: string[];
  reverse?: boolean;
}

/** Infinite horizontal marquee of tech chips with fade-out edges. */
export default function TechMarquee({ items, reverse = false }: TechMarqueeProps) {
  const row = [...items, ...items]; // duplicated for seamless loop
  return (
    <div className="relative overflow-hidden mask-fade-x py-1" aria-hidden="true">
      <div
        className={cn(
          "flex w-max gap-3 fx-anim",
          reverse ? "animate-marquee-fast" : "animate-marquee"
        )}
        style={reverse ? { animationDirection: "reverse" } : undefined}
      >
        {row.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="shrink-0 px-3 py-1.5 rounded-md font-mono text-xs text-[#A7B0B0] bg-white/[0.04] border border-white/10 hover:border-[#00FF66]/40 hover:text-[#F5F7F7] transition-colors"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
