"use client";
import { cn } from "../lib/utils";
export default function HUDPanel({ children, className, label }: { children: React.ReactNode; className?: string; label?: string }) {
  return (
    <div className={cn("relative rounded-xl overflow-hidden bg-[#0B1713]/80 border border-[#00FF66]/20 backdrop-blur-sm shadow-[0_0_40px_-10px_rgba(0,255,102,0.15)]", className)}>
      {label && (
        <div className="px-4 pt-3 pb-1 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#A7B0B0]">{label}</span>
        </div>
      )}
      <div className="relative p-5">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00FF66]/40 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00E5FF]/30 to-transparent" />
        <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-[#00FF66]/30 via-transparent to-transparent" />
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-transparent to-[#7C3AED]/30" />
        {children}
      </div>
    </div>
  );
}
