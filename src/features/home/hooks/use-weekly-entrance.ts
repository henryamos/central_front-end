import { useEffect, useRef, useState } from "react";

function milliseconds(value: string) {
  const time = value.trim();
  return parseFloat(time) * (time.endsWith("ms") ? 1 : 1000);
}

/** Rotate programme pairs only while visible and undisturbed; manual reading takes priority. */
export function useWeeklyEntrance({
  automatic,
  reducedMotion,
  fullSchedule,
  page,
  services,
  onAdvance,
}: {
  automatic: boolean;
  reducedMotion: boolean;
  fullSchedule: boolean;
  page: number;
  services: readonly unknown[];
  onAdvance: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const animations = useRef<Animation[]>([]);
  const [inView, setInView] = useState(false);
  const [interacting, setInteracting] = useState(false);
  useEffect(() => {
    const panel = ref.current;
    if (!panel || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.1 },
    );
    observer.observe(panel.querySelector("[data-weekly-programme]") ?? panel);
    let hovering = false;
    const settle = () =>
      animations.current.forEach((animation) => animation.cancel());
    const programme = panel.querySelector("[data-weekly-programme]");
    const enter = () => {
      hovering = true;
      setInteracting(true);
    };
    const leave = () => {
      hovering = false;
      setInteracting(panel.contains(document.activeElement));
    };
    const focus = () => {
      setInteracting(true);
      settle();
    };
    const blur = (event: FocusEvent) =>
      setInteracting(
        hovering ||
          (event.relatedTarget instanceof Node &&
            panel.contains(event.relatedTarget)),
      );
    programme?.addEventListener("pointerenter", enter);
    programme?.addEventListener("pointerleave", leave);
    panel.addEventListener("focusin", focus);
    panel.addEventListener("focusout", blur);
    return () => {
      observer.disconnect();
      programme?.removeEventListener("pointerenter", enter);
      programme?.removeEventListener("pointerleave", leave);
      panel.removeEventListener("focusin", focus);
      panel.removeEventListener("focusout", blur);
    };
  }, []);
  useEffect(() => {
    const panel = ref.current;
    if (!panel || !automatic || !inView || interacting) return;
    const delay = milliseconds(
      getComputedStyle(panel).getPropertyValue("--duration-weekly-reading"),
    );
    const timer = window.setTimeout(onAdvance, delay);
    return () => window.clearTimeout(timer);
  }, [automatic, inView, interacting, page, onAdvance]);
  useEffect(() => {
    const panel = ref.current;
    if (!panel || !panel.animate || !inView || reducedMotion || fullSchedule)
      return;
    const styles = getComputedStyle(panel);
    const duration = milliseconds(
      styles.getPropertyValue("--duration-weekly-enter"),
    );
    const start = styles.getPropertyValue("--weekly-roll-start").trim();
    const perspective = styles
      .getPropertyValue("--weekly-flip-perspective")
      .trim();
    const angle = styles.getPropertyValue("--weekly-flip-angle").trim();
    const easing = styles.getPropertyValue("--ease-weekly-flip").trim();
    animations.current = Array.from(
      panel.querySelectorAll<HTMLElement>(
        '[data-weekly-reveal][aria-hidden="false"]',
      ),
    ).flatMap((item) =>
      Array.from(item.querySelectorAll<HTMLElement>("[data-weekly-roll]")).map(
        (content) =>
          content.animate(
            [
              {
                transform: `perspective(${perspective}) translateY(${start}) rotateX(${angle})`,
                opacity: 0,
              },
              {
                transform: `perspective(${perspective}) translateY(0) rotateX(0deg)`,
                opacity: 1,
              },
            ],
            {
              duration,
              delay: 0,
              easing,
              fill: "backwards",
            },
          ),
      ),
    );
    return () => {
      animations.current.forEach((animation) => animation.cancel());
      animations.current = [];
    };
  }, [inView, reducedMotion, fullSchedule, page, services]);
  return ref;
}
