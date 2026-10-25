"use client";

import { useEffect, useRef } from "react";
import { useFxLevel } from "../lib/fx";
import GridScan from "./GridScan";

/**
 * Cursor-reactive ambient background.
 *
 * Everything decorative lives in ONE fixed, pointer-events-none layer behind
 * the content (`z-0` here; page content sits in a `relative z-10` wrapper).
 * The classic field stays CSS-only; FULL FX adds an isolated GridScan canvas
 * without changing page content or causing per-frame React renders:
 *
 *  • two soft radial gradients are moved with `translate3d` to follow the
 *    pointer, each with a different CSS transition so they trail the cursor;
 *  • two larger ambient gradients drift independently, so the field stays
 *    alive when the pointer is still;
 *  • a slowly drifting grid uses a composited transform animation;
 *  • a static gradient field keeps the page attractive when the cursor is still.
 *
 * Pointer coordinates are written to CSS custom properties at most once per
 * animation frame, and the listener is passive. Under `prefers-reduced-motion`
 * (or a coarse pointer, i.e. touch) the listener is never attached and CSS
 * renders a composed static background. The FX levels dim/disable the moving
 * layers without ever affecting page content.
 */
export default function CursorReactiveBg() {
  const rootRef = useRef<HTMLDivElement>(null);
  const level = useFxLevel();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");
    let frame = 0;
    let x = 0;
    let y = 0;
    let previousX = 0;
    let previousY = 0;
    let intensity = 0.72;
    let attached = false;

    const apply = () => {
      frame = 0;
      root.style.setProperty("--pointer-x", `${x}px`);
      root.style.setProperty("--pointer-y", `${y}px`);
      root.style.setProperty("--glow-intensity", intensity.toFixed(2));
    };

    const onPointerMove = (event: PointerEvent) => {
      const distance = Math.hypot(event.clientX - previousX, event.clientY - previousY);
      intensity = Math.min(1, 0.68 + distance / 260);
      previousX = event.clientX;
      previousY = event.clientY;
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const detach = () => {
      if (!attached) return;
      window.removeEventListener("pointermove", onPointerMove);
      attached = false;
    };

    const attach = () => {
      if (attached) return;
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      attached = true;
    };

    const sync = () => {
      detach();
      if (level === "off" || reduceMotion.matches || coarsePointer.matches) {
        if (frame) {
          cancelAnimationFrame(frame);
          frame = 0;
        }
        root.removeAttribute("data-pointer-active");
        return;
      }
      // Start centred so the static composition is balanced before any move.
      x = window.innerWidth / 2;
      y = window.innerHeight * 0.42;
      previousX = x;
      previousY = y;
      intensity = 0.72;
      apply();
      root.setAttribute("data-pointer-active", "");
      attach();
    };

    sync();
    reduceMotion.addEventListener("change", sync);
    coarsePointer.addEventListener("change", sync);

    return () => {
      detach();
      reduceMotion.removeEventListener("change", sync);
      coarsePointer.removeEventListener("change", sync);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [level]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      data-fx-bg={level}
      className="fx-bg pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {level === "full" && (
        <div className="fx-gridscan-layer fx-full-only absolute inset-0">
          <div className="fx-gridscan-fallback absolute inset-0" aria-hidden="true" />
          <GridScan
            linesColor="#11B910"
            scanColor="#8EE700"
            cells={8}
            depth={4.4}
            depthFade={0.3}
            parallax={1.1}
            shading={0.78}
            reflection={0.59}
            scanDirection="forward"
            scanDuration={2.4}
            scanDelay={1.6}
            clickEffect="ping"
            lineThickness={1.2}
            scanWidth={2.7}
            trail={0.72}
            glow={1.5}
            className="absolute inset-0 z-[1]"
          />
        </div>
      )}

      {/* Static base field — painted once */}
      <div className="fx-classic-background fx-bg-base absolute inset-0" />

      {/* Slowly drifting grid (transform-only animation) */}
      <div className="fx-classic-background fx-bg-grid fx-anim absolute -inset-16" />

      {/* Independent ambient fields keep the atmosphere alive at rest. */}
      <div className="fx-classic-background fx-bg-ambient fx-bg-ambient--green fx-anim absolute left-0 top-0" />
      <div className="fx-classic-background fx-bg-ambient fx-bg-ambient--cyan fx-anim absolute left-0 top-0" />

      {/* Cursor-following light fields */}
      <div className="fx-classic-background fx-bg-glow fx-bg-glow--green fx-optional absolute left-0 top-0" />
      <div className="fx-classic-background fx-bg-glow fx-bg-glow--cyan fx-optional absolute left-0 top-0" />

      {/* Very faint static scanline texture */}
      <div className="fx-classic-background fx-bg-scanlines fx-optional absolute inset-0" />
    </div>
  );
}
