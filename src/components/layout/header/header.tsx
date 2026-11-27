"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { SiteNavigation } from "@/components/layout/navigation/site-navigation";
import { cn } from "@/lib/utils";
function subscribeScroll(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}
function readScrolled() {
  return window.scrollY > 0;
}
function serverScrolled() {
  return false;
}
export function Header() {
  const pathname = usePathname();
  const ref = useRef<HTMLElement>(null);
  const [heroVisible, setHeroVisible] = useState(true);
  const scrolled = useSyncExternalStore(
    subscribeScroll,
    readScrolled,
    serverScrolled,
  );
  const transparent = pathname === "/" && heroVisible && !scrolled;
  useEffect(() => {
    const hero = document.querySelector("[data-header-overlay]");
    const header = ref.current;
    if (!hero || !header) return;
    let intersection: IntersectionObserver | undefined;
    const resize = new ResizeObserver(() => {
      intersection?.disconnect();
      intersection = new IntersectionObserver(
        ([entry]) => setHeroVisible(entry.isIntersecting),
        {
          rootMargin:
            "-" +
            Math.ceil(header.getBoundingClientRect().height) +
            "px 0px 0px",
          threshold: 0,
        },
      );
      intersection.observe(hero);
    });
    resize.observe(header);
    return () => {
      resize.disconnect();
      intersection?.disconnect();
    };
  }, [pathname]);
  return (
    <header
      ref={ref}
      data-transparent={transparent}
      className={cn(
        "site-header sticky top-0 z-(--layer-header) shrink-0 border-b-(length:--control-border-width)",
        transparent
          ? "border-border bg-background sm:border-transparent sm:bg-transparent"
          : "border-border bg-background",
      )}
    >
      <SiteNavigation />
    </header>
  );
}
