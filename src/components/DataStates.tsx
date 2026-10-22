"use client";

/** HUD-style loading skeleton for GitHub-backed panels. */
export function GhSkeleton({ rows = 3, label = "SYNCING WITH GITHUB…" }: { rows?: number; label?: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#0B1713]/50 p-5" role="status" aria-live="polite">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] fx-anim animate-pulse" />
        <span className="font-mono text-[10px] tracking-widest text-[#A7B0B0]">{label}</span>
      </div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="h-3 rounded bg-gradient-to-r from-white/[0.06] via-white/[0.12] to-white/[0.06] fx-anim animate-pulse"
            style={{ width: `${90 - i * 15}%`, animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

/** Error / degraded-state banner with an optional retry action. */
export function GhError({
  message,
  onRetry,
  hint,
}: {
  message: string;
  onRetry?: () => void;
  hint?: string;
}) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-[#F59E0B]/40 bg-[#F59E0B]/[0.06] p-4 flex flex-wrap items-center gap-3"
    >
      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#F59E0B]/15 border border-[#F59E0B]/40 text-[#F59E0B] tracking-widest">
        DEGRADED
      </span>
      <span className="text-sm text-[#A7B0B0] flex-1 min-w-[200px]">
        {message}
        {hint && <span className="block text-xs text-dim mt-0.5">{hint}</span>}
      </span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-3 py-1.5 rounded-md font-mono text-xs border border-[#00E5FF]/40 text-[#00E5FF] hover:bg-[#00E5FF]/10 transition-colors"
        >
          RETRY ↻
        </button>
      )}
    </div>
  );
}
