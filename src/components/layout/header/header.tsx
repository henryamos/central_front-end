"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { SiteNavigation } from "@/components/layout/navigation/site-navigation";
import { cn } from "@/lib/utils";
export function Header() {
  const pathname = usePathname();
  const ref = useRef<HTMLElement>(null);
  const [heroVisible, setHeroVisible] = useState(true);
  const transparent = pathname === "/" && heroVisible;
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
        "site-header sticky top-0 z-(--layer-header) shrink-0 border-b-(length:--control-border-width) transition-colors duration-(--duration-normal) ease-standard",
        transparent
          ? "border-border bg-background sm:border-transparent sm:bg-transparent"
          : "border-border bg-background",
      )}
    >
      <SiteNavigation />
    </header>
  );
}
