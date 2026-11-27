"use client";
import { useEffect, useState } from "react";
import { BrandLoading } from "./brand-loading";
export function SiteArrival() {
  const [phase, setPhase] = useState("loading");
  useEffect(() => {
    let exitTimer: ReturnType<typeof setTimeout>;
    const started = performance.now();
    const finish = () => {
      exitTimer = setTimeout(
        () => setPhase("leaving"),
        Math.max(0, 900 - (performance.now() - started)),
      );
    };
    const fallback = setTimeout(finish, 4000);
    const ready = () => {
      clearTimeout(fallback);
      finish();
    };
    if (document.readyState === "complete") ready();
    else window.addEventListener("load", ready, { once: true });
    return () => {
      clearTimeout(fallback);
      clearTimeout(exitTimer);
      window.removeEventListener("load", ready);
    };
  }, []);
  useEffect(() => {
    if (phase !== "leaving") return;
    const timer = setTimeout(() => setPhase("complete"), 250);
    return () => clearTimeout(timer);
  }, [phase]);
  return phase === "complete" ? null : (
    <>
      <BrandLoading leaving={phase === "leaving"} />
      <noscript>
        <style>{".brand-loading{display:none!important}"}</style>
      </noscript>
    </>
  );
}
