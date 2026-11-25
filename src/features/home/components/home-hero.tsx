"use client";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Container } from "@/components/layout/container/container";
import { Button } from "@/components/ui/button/button";
import { cn } from "@/lib/utils";
import { useCarouselEnvironment } from "../hooks/use-carousel-environment";
type Slide = { src: string; alt: string; position: string };
/** One native CSS timeline controls progress and rotation. Only photos crossfade. */
export function HomeHero({
  slides,
  children,
}: {
  slides: readonly [Slide, ...Slide[]];
  children: ReactNode;
}) {
  const [active, setActive] = useState(0),
    [previous, setPrevious] = useState<{
      slide: Slide;
      transform: string;
    } | null>(null),
    [loaded, setLoaded] = useState<string | null>(null),
    [failed, setFailed] = useState<string | null>(null);
  const [playing, setPlaying] = useState(true),
    [hovered, setHovered] = useState(false);
  const { reducedMotion, visible } = useCarouselEnvironment();
  const rotating = playing && !reducedMotion,
    slide = slides[active],
    ready = loaded === slide.src;
  const animationState =
    rotating && !hovered && visible
      ? "[animation-play-state:running]"
      : "[animation-play-state:paused]";
  const imageRef = useRef<HTMLImageElement>(null);
  const goTo = (index: number) => {
    if (index === active) return;
    if (ready && imageRef.current)
      setPrevious({
        slide,
        transform: getComputedStyle(imageRef.current).transform,
      });
    setActive(index);
  };
  return (
    <section
      className="-mt-(--header-row-size)"
      style={
        {
          "--hero-motion-state": rotating && visible ? "running" : "paused",
        } as CSSProperties
      }
      aria-labelledby="home-title"
      aria-roledescription="carousel"
      onFocusCapture={(event) => {
        if (
          event.target instanceof Element &&
          !event.target.closest("[data-rotation-control]")
        )
          setPlaying(false);
      }}
    >
      <div className="relative isolate overflow-hidden bg-primary text-background">
        <div
          data-header-overlay
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 bottom-(--home-invitation-overlap)"
        />
        {previous && (
          <Image
            src={previous.slide.src}
            alt=""
            fill
            sizes="100vw"
            aria-hidden="true"
            className="object-cover"
            style={{
              objectPosition: previous.slide.position,
              transform: previous.transform,
            }}
          />
        )}
        <div
          role="group"
          aria-roledescription="slide"
          aria-busy={!ready && failed !== slide.src}
          aria-label={"Photo " + (active + 1) + " of " + slides.length}
          className="absolute inset-0"
        >
          <Image
            key={slide.src}
            ref={imageRef}
            src={slide.src}
            alt={slide.alt}
            fill
            sizes="100vw"
            preload={active === 0}
            onLoad={(event) => {
              const image = event.currentTarget;
              requestAnimationFrame(() =>
                requestAnimationFrame(() => {
                  if (image.isConnected) {
                    setLoaded(slide.src);
                    setFailed(null);
                  }
                }),
              );
            }}
            onError={() => setFailed(slide.src)}
            className={cn(
              "object-cover transition-opacity duration-(--duration-normal) ease-standard",
              ready || (!previous && active === 0 && failed !== slide.src)
                ? "opacity-100"
                : "opacity-0",
              ready && "animate-carousel-zoom motion-reduce:animate-none",
              active % 2 === 0
                ? "[animation-direction:normal]"
                : "[animation-direction:reverse]",
              animationState,
            )}
            style={{ objectPosition: slide.position }}
          />
        </div>
        <div
          data-hero-shade
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-overlay"
        />
        <Container className="relative flex min-h-(--home-hero-min) flex-col gap-8 pt-[calc(var(--header-row-size)+var(--spacing-12))] pb-[calc(var(--home-invitation-overlap)+var(--spacing-4))] md:pt-[calc(var(--header-row-size)+var(--spacing-16))]">
          <div className="grid flex-1 content-center justify-items-start py-8">
            {children}
          </div>
          <div
            data-hero-controls
            className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-2 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:gap-0"
          >
            <Button
              aria-label="Previous photograph"
              onClick={() => goTo((active + slides.length - 1) % slides.length)}
              className="size-12 border-transparent bg-transparent p-0 text-background not-disabled:hover:bg-primary focus-visible:inset-ring-background sm:hidden"
            >
              <ChevronLeft aria-hidden="true" className="size-6" />
            </Button>
            <div
              aria-hidden="true"
              className="relative col-start-2 mx-auto grid size-12 place-items-center sm:hidden"
            >
              <svg viewBox="0 0 48 48" className="absolute inset-0 size-12">
                <circle
                  cx="24"
                  cy="24"
                  r="21"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="opacity-60"
                />
                <circle
                  key={slide.src}
                  cx="24"
                  cy="24"
                  r="21"
                  pathLength="1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="1"
                  strokeDashoffset="1"
                  strokeLinecap="round"
                  className={cn(
                    "origin-center -rotate-90 motion-reduce:animate-none",
                    ready && "animate-carousel-progress",
                    animationState,
                  )}
                  onAnimationEnd={(event) => {
                    if (
                      event.animationName === "carousel-progress" &&
                      rotating &&
                      ready
                    )
                      goTo((active + 1) % slides.length);
                  }}
                />
              </svg>
              <span className="text-sm font-semibold tabular-nums">
                {active + 1} / {slides.length}
              </span>
            </div>
            <Button
              aria-label="Next photograph"
              onClick={() => goTo((active + 1) % slides.length)}
              className="col-start-3 size-12 border-transparent bg-transparent p-0 text-background not-disabled:hover:bg-primary focus-visible:inset-ring-background sm:hidden"
            >
              <ChevronRight aria-hidden="true" className="size-6" />
            </Button>
            <div
              className="mx-auto hidden max-w-full flex-wrap justify-center sm:col-start-2 sm:flex"
              role="group"
              aria-label="Choose a photograph"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              {slides.map((item, index) => (
                <Button
                  key={item.src}
                  aria-label={
                    "Show photograph " + (index + 1) + " of " + slides.length
                  }
                  aria-current={index === active ? "true" : undefined}
                  onClick={() => goTo(index)}
                  className="size-12 shrink-0 border-transparent bg-transparent p-0 text-background not-disabled:hover:bg-transparent focus-visible:inset-ring-background not-disabled:active:bg-transparent"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="size-6"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r={index === active ? 4 : 3}
                      fill="currentColor"
                    />
                    {index === active && (
                      <>
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="opacity-60"
                        />
                        <circle
                          key={slide.src}
                          cx="12"
                          cy="12"
                          r="10"
                          pathLength="1"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeDasharray="1"
                          strokeDashoffset="1"
                          strokeLinecap="round"
                          className={cn(
                            "origin-center -rotate-90 motion-reduce:animate-none",
                            ready && "animate-carousel-progress",
                            animationState,
                          )}
                          onAnimationEnd={(event) => {
                            if (
                              event.animationName === "carousel-progress" &&
                              rotating &&
                              ready
                            )
                              goTo((active + 1) % slides.length);
                          }}
                        />
                      </>
                    )}
                  </svg>
                </Button>
              ))}
            </div>
            <Button
              data-rotation-control
              type="button"
              disabled={reducedMotion}
              aria-label={
                reducedMotion
                  ? "Slideshow paused"
                  : rotating
                    ? "Pause slideshow"
                    : "Resume slideshow"
              }
              title={
                reducedMotion
                  ? "Slideshow paused for reduced motion"
                  : rotating
                    ? "Pause slideshow"
                    : "Resume slideshow"
              }
              className="col-start-4 row-start-1 size-12 justify-self-end border-transparent bg-transparent p-0 text-background not-disabled:hover:bg-primary focus-visible:inset-ring-background sm:col-start-3"
              onClick={() => setPlaying((value) => !value)}
            >
              {rotating ? (
                <Pause aria-hidden="true" className="size-4" />
              ) : (
                <Play aria-hidden="true" className="size-4" />
              )}
            </Button>
          </div>
        </Container>
      </div>

      <span
        className="sr-only"
        aria-live={rotating ? "off" : "polite"}
        aria-atomic="true"
      >
        Photo {active + 1} of {slides.length}
      </span>
      <span className="sr-only" role="status">
        {failed === slide.src
          ? "This photograph could not load. The welcome links are still available."
          : ""}
      </span>
    </section>
  );
}
