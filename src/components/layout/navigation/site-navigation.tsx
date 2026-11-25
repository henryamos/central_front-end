"use client";
import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { CalendarDays, HandHeart, Menu } from "lucide-react";
import { Container } from "@/components/layout/container/container";
import { Button } from "@/components/ui/button/button";
import { ButtonLink } from "@/components/ui/button/button-link";
import { Accordion } from "@/components/ui/accordion/accordion";
import { Dialog } from "@/components/ui/dialog/dialog";
import { SiteIdentity } from "./site-identity";
import { NavigationLink } from "./navigation-link";
import {
  NavigationDisclosure,
  closeNavigationDetails,
  repositionNavigation,
} from "./navigation-disclosure";
import {
  primaryNavigation,
  resourceNavigation,
  resourceDescriptions,
  ministryNavigation,
  givingNavigation,
  homeNavigation,
  guestNavigation,
  visitNavigation,
} from "./navigation";
const resources = resourceNavigation.map((item) => ({
  ...item,
  description: resourceDescriptions[item.href],
}));
export function SiteNavigation() {
  const pathname = usePathname(),
    [menu, setMenu] = useState({ pathname, open: false });
  const open = menu.pathname === pathname && menu.open;
  const rootRef = useRef<HTMLDivElement>(null),
    rowRef = useRef<HTMLDivElement>(null),
    triggerRef = useRef<HTMLButtonElement>(null),
    panelId = useId();
  const close = () => {
    setMenu({ pathname, open: false });
    closeNavigationDetails(rootRef.current);
  };
  useEffect(() => {
    let desktop = triggerRef.current?.getClientRects().length === 0;
    const outside = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !rootRef.current?.contains(event.target)
      ) {
        closeNavigationDetails(rootRef.current);
        setMenu((previous) =>
          previous.open ? { ...previous, open: false } : previous,
        );
      }
    };
    const resize = () => {
      if (rowRef.current)
        document.documentElement.style.setProperty(
          "--header-row-size",
          Math.ceil(rowRef.current.getBoundingClientRect().height) + "px",
        );
      const nextDesktop = triggerRef.current?.getClientRects().length === 0;
      if (nextDesktop !== desktop) {
        closeNavigationDetails(rootRef.current);
        desktop = nextDesktop;
        setMenu((previous) =>
          previous.open ? { ...previous, open: false } : previous,
        );
      }
      if (nextDesktop)
        setMenu((previous) =>
          previous.open ? { ...previous, open: false } : previous,
        );
      repositionNavigation(rootRef.current);
    };
    const observer = new ResizeObserver(resize);
    if (rowRef.current) observer.observe(rowRef.current);
    if (triggerRef.current) observer.observe(triggerRef.current);
    document.addEventListener("pointerdown", outside);
    window.addEventListener("resize", resize);
    return () => {
      document.removeEventListener("pointerdown", outside);
      window.removeEventListener("resize", resize);
      observer.disconnect();
      document.documentElement.style.removeProperty("--header-row-size");
    };
  }, []);
  return (
    <div
      ref={rootRef}
      onKeyDown={(event) => {
        if (event.key !== "Escape") return;
        if (open) {
          event.preventDefault();
          close();
          return;
        }
        const disclosure = Array.from(
          rootRef.current?.querySelectorAll<HTMLDetailsElement>(
            "details[open]",
          ) ?? [],
        ).find((item) => item.getClientRects().length > 0);
        if (disclosure) {
          event.preventDefault();
          disclosure.open = false;
          disclosure.querySelector("summary")?.focus();
        }
      }}
    >
      <Container
        ref={rowRef}
        data-header-row
        className="flex min-h-(--header-height) flex-wrap items-center justify-between gap-x-3 gap-y-2 py-3 sm:py-4 xl:gap-x-6"
      >
        <SiteIdentity compact onNavigate={close} />
        <nav
          aria-label="Primary navigation"
          className="hidden min-w-0 flex-1 flex-wrap items-center justify-center xl:flex"
        >
          <ul className="m-0 flex min-w-0 flex-wrap items-center justify-center gap-1 p-0">
            {primaryNavigation.map((item) =>
              item.href === "/ministries" ? (
                <NavigationDisclosure
                  key={item.href}
                  label="Ministries"
                  items={ministryNavigation}
                  onNavigate={close}
                  allLink={{ href: "/ministries", label: "All ministries" }}
                  align="left"
                  active={pathname.startsWith("/ministries")}
                  rootRef={rootRef}
                />
              ) : (
                <li key={item.href}>
                  <NavigationLink href={item.href} onNavigate={close}>
                    {item.label}
                  </NavigationLink>
                </li>
              ),
            )}
            <NavigationDisclosure
              label="Resources"
              items={resources}
              onNavigate={close}
              rootRef={rootRef}
            />
          </ul>
        </nav>
        <div className="flex shrink-0 items-center gap-2 xl:gap-3">
          <ButtonLink
            href={givingNavigation.href}
            variant="primary"
            className="hidden sm:inline-flex"
            onNavigate={close}
          >
            <HandHeart aria-hidden="true" className="size-4" />
            {givingNavigation.label}
          </ButtonLink>
          <Button
            ref={triggerRef}
            variant="secondary"
            className="size-12 shrink-0 border-transparent bg-transparent p-0 sm:w-auto sm:px-4 xl:hidden"
            aria-label="Open navigation"
            aria-expanded={open}
            aria-controls={panelId}
            aria-haspopup="dialog"
            onClick={() => {
              if (open) close();
              else setMenu({ pathname, open: true });
            }}
          >
            <span className="flex items-center gap-2">
              <Menu aria-hidden="true" className="size-6" />
              <span className="hidden sm:inline">Menu</span>
            </span>
          </Button>
        </div>
      </Container>
      <Dialog
        id={panelId}
        open={open}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) close();
        }}
        title="Menu"
        closeLabel="Close navigation"
        returnFocusRef={triggerRef}
        variant="fullscreen"
        className="xl:hidden"
      >
        <div className="py-3">
          <nav aria-label="Primary navigation" className="grid gap-4">
            <div className="grid grid-cols-2 items-center gap-3 sm:flex sm:flex-wrap">
              <ButtonLink
                href={visitNavigation.href}
                onNavigate={close}
                className="px-3 sm:px-4"
              >
                <CalendarDays aria-hidden="true" className="size-4" />
                {visitNavigation.label}
              </ButtonLink>
              <ButtonLink
                href={givingNavigation.href}
                onNavigate={close}
                className="px-3 sm:px-4"
              >
                <HandHeart aria-hidden="true" className="size-4 shrink-0" />
                {givingNavigation.label}
              </ButtonLink>
              <div className="col-span-2 sm:contents">
                <NavigationLink href={guestNavigation.href} onNavigate={close}>
                  {guestNavigation.label}
                </NavigationLink>
              </div>
            </div>
            <ul className="m-0 grid gap-1 p-0">
              {[
                homeNavigation,
                ...primaryNavigation.filter(
                  (item) =>
                    item.href !== "/ministries" && item.href !== "/visit",
                ),
              ].map((item) => (
                <li key={item.href}>
                  <NavigationLink href={item.href} onNavigate={close}>
                    {item.label}
                  </NavigationLink>
                </li>
              ))}
            </ul>
            <Accordion summary="Ministries">
              <div className="grid gap-1 sm:grid-cols-2">
                {ministryNavigation.map((item) => (
                  <NavigationLink
                    key={item.href}
                    href={item.href}
                    onNavigate={close}
                  >
                    {item.label}
                  </NavigationLink>
                ))}
              </div>
              <NavigationLink href="/ministries" onNavigate={close}>
                All ministries
              </NavigationLink>
            </Accordion>
            <Accordion summary="Resources">
              <div className="grid gap-1 sm:grid-cols-2">
                {resourceNavigation.map((item) => (
                  <NavigationLink
                    key={item.href}
                    href={item.href}
                    onNavigate={close}
                  >
                    {item.label}
                  </NavigationLink>
                ))}
              </div>
            </Accordion>
          </nav>
        </div>
      </Dialog>
    </div>
  );
}
