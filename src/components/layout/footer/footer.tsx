import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/container/container";
import { footerNavigation } from "@/components/layout/navigation/navigation";

const footerLink =
  "inline-flex min-h-(--touch-target) min-w-(--touch-target) max-w-full items-center rounded-sm py-3 text-base leading-ui text-primary no-underline underline-offset-(--spacing-1) hover:underline focus-visible:outline-focus";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background text-primary">
      <Container className="grid gap-12 py-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16 lg:py-16">
        <div className="flex min-w-0 flex-col items-start">
          <Link
            href="/"
            aria-label="Cape Coast Central SDA home"
            className="inline-flex max-w-full flex-col items-start gap-6 rounded-sm text-xl leading-ui font-semibold text-primary no-underline focus-visible:outline-focus"
          >
            <Image
              src="/icons/CCC%20SDA%20logo.svg"
              alt="Cape Coast Central Seventh-day Adventist Church"
              width={938}
              height={173}
              unoptimized
              className="h-auto w-(--brand-footer-width) max-w-full"
            />
          </Link>
        </div>
        <nav
          aria-label="Footer navigation"
          className="grid min-w-0 grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3"
        >
          {footerNavigation.map((group) => (
            <div key={group.label} className="min-w-0">
              <h2 className="m-0 mb-4 border-b border-border pb-4 text-base leading-ui font-bold">
                {group.label}
              </h2>
              <ul className="m-0 list-none p-0">
                {group.links
                  .filter(
                    ({ href }) => href !== "/visit" && href !== "/contact",
                  )
                  .map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className={footerLink}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </nav>
      </Container>
      <div className="bg-primary text-primary-foreground">
        <Container className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 py-4">
          <p className="m-0 text-sm">
            &copy; {new Date().getUTCFullYear()} Cape Coast Central SDA
          </p>
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            <Link
              href="/contact"
              className="inline-flex min-h-(--touch-target) min-w-(--touch-target) items-center gap-2 rounded-sm py-3 text-base leading-ui text-primary-foreground no-underline hover:underline focus-visible:outline-focus-inverse"
            >
              Information desk
              <ArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
            </Link>
            <Link
              href="/guest"
              className="inline-flex min-h-(--touch-target) min-w-(--touch-target) items-center gap-2 rounded-sm py-3 text-base leading-ui text-primary-foreground no-underline hover:underline focus-visible:outline-focus-inverse"
            >
              Guest check-in
              <ArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
