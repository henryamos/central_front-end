import Link from "next/link";
import Image from "next/image";
import type { ComponentProps } from "react";
/** Official Adventist signature paired with the local church name. */
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
      className="inline-flex min-h-(--touch-target) max-w-full min-w-0 items-center gap-3 rounded-sm text-foreground no-underline focus-visible:inset-ring-(length:--focus-width) focus-visible:inset-ring-primary focus-visible:outline-hidden sm:gap-4"
    >
      <span
        aria-hidden="true"
        className={
          compact
            ? "block w-16 shrink-0 sm:w-(--brand-header-width)"
            : "block w-(--brand-header-width) shrink-0"
        }
      >
        <Image
          src="/icons/adventist-en-tm-centered--denim.png"
          alt=""
          width={1852}
          height={1140}
          sizes="(min-width: 640px) 96px, 64px"
          className="brand-logo-default block h-auto w-full"
        />
        <Image
          src="/icons/adventist-en-centered--white.png"
          alt=""
          width={1852}
          height={1140}
          sizes="(min-width: 640px) 96px, 64px"
          className="brand-logo-inverse h-auto w-full"
        />
      </span>
      <span className="min-w-0 border-l border-current pl-3 text-base leading-ui font-bold sm:pl-4">
        Cape Coast
        <br />
        Central SDA
      </span>
    </Link>
  );
}
