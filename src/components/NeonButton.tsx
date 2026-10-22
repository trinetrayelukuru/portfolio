"use client";
export default function NeonButton({ href, children, primary = true }: { href?: string; children: React.ReactNode; primary?: boolean }) {
  const cls = primary
    ? "px-6 py-3 rounded-md font-mono text-sm bg-[#00FF66]/10 border border-[#00FF66]/60 text-[#00FF66] hover:bg-[#00FF66]/20 hover:shadow-[0_0_20px_rgba(0,255,102,0.3)] transition-all"
    : "px-6 py-3 rounded-md font-mono text-sm bg-[#00E5FF]/10 border border-[#00E5FF]/60 text-[#00E5FF] hover:bg-[#00E5FF]/20 hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all";
  return href ? <a href={href} className={cls}>{children}</a> : <button className={cls}>{children}</button>;
}
