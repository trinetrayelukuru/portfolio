"use client";

import { useSyncExternalStore } from "react";

export type FxLevel = "full" | "subtle" | "off";

const STORAGE_KEY = "trinetra:fx-level";
const FX_ORDER: FxLevel[] = ["full", "subtle", "off"];

let current: FxLevel = "full";
let initialized = false;
const listeners = new Set<() => void>();

function apply(level: FxLevel) {
  if (typeof document !== "undefined") {
    document.documentElement.dataset.fx = level;
  }
}

function read(): FxLevel {
  if (typeof window === "undefined") return "full";
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === "full" || raw === "subtle" || raw === "off") return raw;
  } catch {
    /* storage unavailable */
  }
  return "full";
}

function init() {
  if (typeof window === "undefined") return;
  if (!initialized) {
    initialized = true;
    current = read();
  }
  // Re-apply on every init call (i.e. on each subscribe): React's dev Strict
  // Mode remount resets <html> to its JSX attributes, clearing the value the
  // pre-hydration script set. Idempotent in production.
  apply(current);
}

function emit() {
  listeners.forEach((l) => l());
}

export function subscribeFx(listener: () => void): () => void {
  init();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getFxSnapshot(): FxLevel {
  init();
  return current;
}

export function getServerFxSnapshot(): FxLevel {
  return "full";
}

export function setFx(level: FxLevel) {
  init();
  current = level;
  apply(level);
  try {
    window.localStorage.setItem(STORAGE_KEY, level);
  } catch {
    /* storage unavailable */
  }
  emit();
}

export function cycleFx() {
  const idx = FX_ORDER.indexOf(getFxSnapshot());
  setFx(FX_ORDER[(idx + 1) % FX_ORDER.length]);
}

export function useFxLevel(): FxLevel {
  return useSyncExternalStore(subscribeFx, getFxSnapshot, getServerFxSnapshot);
}
