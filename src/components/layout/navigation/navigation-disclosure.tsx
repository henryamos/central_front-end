import type { RefObject } from "react";
import Link from "next/link";
import { ChevronDown, ArrowUpRight } from "lucide-react";
import { NavigationLink } from "./navigation-link";
import { cn } from "@/lib/utils";
export type DisclosureItem = {
  label: string;
  href: string;
  description: string;
};
export function closeNavigationDetails(root: HTMLElement | null) {
  root?.querySelectorAll("details").forEach((item) => {
    item.open = false;
  });
}
function positionPanel(details: HTMLDetailsElement) {
  const panel = details.querySelector<HTMLElement>("[data-navigation-panel]");
  if (!panel) return;
  const gutter = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue(
      "--page-gutter",
    ),
  );
  const width = document.documentElement.clientWidth;
  panel.style.maxWidth = Math.max(0, width - gutter * 2) + "px";
  panel.style.setProperty("--menu-shift", "0px");
  const rect = panel.getBoundingClientRect();
  const left = Math.min(
    Math.max(rect.left, gutter),
    width - gutter - rect.width,
  );
  panel.style.setProperty("--menu-shift", left - rect.left + "px");
}
export function repositionNavigation(root: HTMLElement | null) {
  root
    ?.querySelectorAll<HTMLDetailsElement>(
      "details[open][data-navigation-disclosure]",
    )
    .forEach(positionPanel);
}
export function NavigationDisclosure({
  label,
  items,
  onNavigate,
  allLink,
  active = false,
  align = "right",
  rootRef,
}: {
  label: string;
  items: readonly DisclosureItem[];
  onNavigate: () => void;
  allLink?: { href: string; label: string };
  active?: boolean;
  align?: "left" | "right";
  rootRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <li className="relative">
      <details
        data-navigation-disclosure
        className="group"
        onToggle={(event) => {
          const details = event.currentTarget;
          if (details.open) {
            rootRef.current
              ?.querySelectorAll("details[open]")
              .forEach((item) => {
                if (item !== details) (item as HTMLDetailsElement).open = false;
              });
            requestAnimationFrame(() => positionPanel(details));
          }
        }}
      >
        <summary
          data-active={active || undefined}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              const details = event.currentTarget
                .parentElement as HTMLDetailsElement;
              details.open = true;
              details.querySelector("a")?.focus();
            }
          }}
          className="flex min-h-(--touch-target) cursor-pointer list-none items-center gap-2 rounded-md px-3 py-3 text-base leading-ui font-medium hover:bg-surface-muted focus-visible:inset-ring-(length:--focus-width) focus-visible:inset-ring-primary focus-visible:outline-hidden data-[active=true]:bg-surface-muted data-[active=true]:text-primary [&::-webkit-details-marker]:hidden"
        >
          {label}
          <ChevronDown
            aria-hidden="true"
            className="size-4 shrink-0 transition-transform duration-(--duration-fast) ease-standard group-open:rotate-180"
          />
        </summary>
        <div
          data-navigation-panel
          className={cn(
            "absolute top-full z-(--layer-popover) mt-3 max-h-[calc(100vh-var(--header-row-size)-var(--spacing-6))] w-(--navigation-menu-max) translate-x-(--menu-shift) overflow-y-auto overscroll-contain rounded-md bg-background p-4 text-foreground shadow-menu [--menu-shift:0px] supports-[height:100dvh]:max-h-[calc(100dvh-var(--header-row-size)-var(--spacing-6))]",
            align === "left" ? "left-0" : "right-0",
          )}
        >
          <p className="m-0 px-4 pt-2 pb-3 text-sm font-semibold text-muted-foreground">
            Explore {label.toLowerCase()}
          </p>
          <ul className="m-0 grid grid-cols-2 gap-2 p-0">
            {items.map((item) => (
              <li key={item.href}>
                <NavigationLink
                  href={item.href}
                  aria-label={item.label}
                  onNavigate={onNavigate}
                  className="flex-col items-start gap-1 p-4"
                >
                  <span className="font-semibold">{item.label}</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    {item.description}
                  </span>
                </NavigationLink>
              </li>
            ))}
          </ul>
          {allLink && (
            <Link
              href={allLink.href}
              onNavigate={onNavigate}
              className="mt-3 flex min-h-(--touch-target) items-center justify-between gap-3 rounded-sm border-t-(length:--control-border-width) border-border px-4 pt-3 text-base font-semibold focus-visible:inset-ring-(length:--focus-width) focus-visible:inset-ring-primary focus-visible:outline-hidden"
            >
              {allLink.label}
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          )}
        </div>
      </details>
    </li>
  );
}
