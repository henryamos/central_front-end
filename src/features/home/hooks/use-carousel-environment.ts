"use client";
import { useSyncExternalStore } from "react";
function subscribeMotion(callback: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
function readMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function subscribeVisibility(callback: () => void) {
  document.addEventListener("visibilitychange", callback);
  return () => document.removeEventListener("visibilitychange", callback);
}
function readVisibility() {
  return document.visibilityState === "visible";
}
function serverSnapshot() {
  return true;
}
/** Server rendering stays motion-free; native browser preferences drive rotation after hydration. */
export function useCarouselEnvironment() {
  return {
    reducedMotion: useSyncExternalStore(
      subscribeMotion,
      readMotion,
      serverSnapshot,
    ),
    visible: useSyncExternalStore(
      subscribeVisibility,
      readVisibility,
      serverSnapshot,
    ),
  };
}
