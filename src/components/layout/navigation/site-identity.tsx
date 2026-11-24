import Link from "next/link";
import type { ComponentProps } from "react";
/** Text wordmark until the official church logo is supplied. */
export function SiteIdentity({
  compact = false,
  onNavigate,
}: {
  compact?: boolean;
  onNavigate?: ComponentProps<typeof Link>["onNavigate"];
}) {
  return (
    <Link
      href="/"
      onNavigate={onNavigate}
      aria-label="Cape Coast Central SDA home"
      className="inline-flex min-h-(--touch-target) max-w-full min-w-0 flex-wrap content-center items-baseline gap-x-2 rounded-sm text-foreground no-underline focus-visible:inset-ring-(length:--focus-width) focus-visible:inset-ring-primary focus-visible:outline-hidden"
    >
      {compact && (
        <span className="text-xl leading-heading font-bold tracking-tight sm:hidden">
          CCC SDA
        </span>
      )}
      <span
        className={
          compact
            ? "hidden text-xl leading-heading font-bold tracking-tight sm:inline"
            : "text-xl leading-heading font-bold tracking-tight"
        }
      >
        Cape Coast Central
      </span>
      <span
        className={
          compact
            ? "hidden text-sm leading-ui font-medium text-muted-foreground sm:inline"
            : "text-sm leading-ui font-medium text-muted-foreground"
        }
      >
        SDA
      </span>
    </Link>
  );
}
