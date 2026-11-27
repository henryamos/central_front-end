"use client";

import { useSyncExternalStore } from "react";
import { getHeroGreeting } from "../lib/hero-greeting";

function subscribe(callback: () => void) {
  const interval = window.setInterval(callback, 60_000);
  document.addEventListener("visibilitychange", callback);
  window.addEventListener("focus", callback);
  return () => {
    window.clearInterval(interval);
    document.removeEventListener("visibilitychange", callback);
    window.removeEventListener("focus", callback);
  };
}

function snapshot() {
  return getHeroGreeting(new Date());
}

function serverSnapshot() {
  return "everyday" as const;
}

/** Static builds retain the everyday welcome; the live church date selects activity copy. */
export function useHeroGreeting() {
  return useSyncExternalStore(subscribe, snapshot, serverSnapshot);
}
