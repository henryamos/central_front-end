"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/utils";
import { isCurrentSection } from "./navigation";
export function NavigationLink({
  className,
  href,
  ...props
}: Omit<ComponentPropsWithRef<typeof Link>, "href"> & {
  href: string;
}) {
  const pathname = usePathname();
  const current = isCurrentSection(pathname, href);
  return (
    <Link
      {...props}
      href={href}
      aria-current={pathname === href ? "page" : undefined}
      data-active={current || undefined}
      className={cn(
        "flex min-h-(--touch-target) min-w-(--touch-target) items-center rounded-md px-3 py-3 text-base leading-ui font-medium text-foreground no-underline hover:bg-surface-muted focus-visible:inset-ring-(length:--focus-width) focus-visible:inset-ring-primary focus-visible:outline-hidden data-[active=true]:bg-surface-muted data-[active=true]:font-semibold data-[active=true]:text-primary",
        className,
      )}
    />
  );
}
