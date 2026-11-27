import Link from "next/link";
import Image from "next/image";
import type { ComponentProps } from "react";
/** Complete local church wordmark; its lettering is already part of the SVG. */
export function SiteIdentity({
  onNavigate,
}: {
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
        className="block w-(--brand-header-mobile-width) max-w-full shrink-0 sm:w-(--brand-header-width)"
      >
        <Image
          src="/icons/CCC%20SDA%20logo.svg"
          alt=""
          width={938}
          height={173}
          unoptimized
          className="brand-logo-default block h-auto w-full"
        />
        <Image
          src="/icons/ccc-sda-logo-white.svg"
          alt=""
          width={938}
          height={173}
          unoptimized
          className="brand-logo-inverse h-auto w-full"
        />
      </span>
    </Link>
  );
}
