"use client";

import {
  useEffect,
  useId,
  useRef,
  type ComponentPropsWithoutRef,
  type RefObject,
  type ReactNode,
} from "react";
import { Button } from "@/components/ui/button/button";
import { Heading } from "@/components/ui/typography/typography";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export type DialogProps = Omit<
  ComponentPropsWithoutRef<"dialog">,
  "open" | "onClose" | "onCancel" | "title" | "aria-labelledby" | "tabIndex"
> & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  closeLabel?: string;
  description?: string;
  footer?: ReactNode;
  returnFocusRef?: RefObject<HTMLElement | null>;
  variant?: "default" | "fullscreen";
};

/** One controlled modal implementation; the browser owns focus containment and restoration. */
export function Dialog({
  open,
  onOpenChange,
  title,
  closeLabel = "Close dialog",
  returnFocusRef,
  description,
  footer,
  children,
  className,
  variant = "default",
  onKeyDown,
  ...props
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const wasOpen = useRef(false);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open) {
      if (!dialog.open) {
        const { scrollX, scrollY } = window;
        dialog.showModal();
        window.scrollTo(scrollX, scrollY);
      }
      wasOpen.current = true;
    } else if (wasOpen.current) {
      if (dialog.open) dialog.close();
      returnFocusRef?.current?.focus({ preventScroll: true });
      wasOpen.current = false;
    }
  }, [open, returnFocusRef]);
  useEffect(() => {
    if (!open || variant !== "fullscreen") return;
    const bodyOverflow = document.body.style.overflow;
    const rootOverflow = document.documentElement.style.overflow;
    const { scrollX, scrollY } = window;
    const bodyPosition = document.body.style.position;
    const bodyTop = document.body.style.top;
    const bodyWidth = document.body.style.width;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = bodyOverflow;
      document.body.style.position = bodyPosition;
      document.body.style.top = bodyTop;
      document.body.style.width = bodyWidth;
      document.documentElement.style.overflow = rootOverflow;
      window.scrollTo(scrollX, scrollY);
    };
  }, [open, variant]);
  return (
    <dialog
      {...props}
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={
        props["aria-describedby"] ??
        (description ? titleId + "-description" : undefined)
      }
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || event.key !== "Tab") return;
        const controls = Array.from(
          event.currentTarget.querySelectorAll<HTMLElement>(
            "a[href],button,input,select,textarea,summary,[tabindex]",
          ),
        ).filter((element) => {
          const closedDisclosure = element.closest("details:not([open])");
          return (
            !element.matches(':disabled,[tabindex="-1"]') &&
            !element.closest("[hidden],[inert]") &&
            element.getClientRects().length > 0 &&
            (!closedDisclosure ||
              closedDisclosure.querySelector(":scope > summary") === element)
          );
        });
        const first = controls[0],
          last = controls.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
      onCancel={(event) => {
        event.preventDefault();
        onOpenChange(false);
      }}
      onClose={() => {
        if (open) onOpenChange(false);
      }}
      className={cn(
        "m-auto max-h-[calc(100%-var(--page-gutter)*2)] w-[calc(100%-var(--page-gutter)*2)] max-w-(--dialog-max) overflow-y-auto rounded-sm border-0 bg-background p-6 text-foreground backdrop:bg-overlay",
        variant === "fullscreen" &&
          "fixed inset-0 m-0 h-screen max-h-none w-full max-w-none overflow-hidden rounded-none p-4 supports-[height:100dvh]:h-dvh motion-safe:animate-navigation-enter md:p-6",
        className,
      )}
    >
      <div
        className={
          variant === "fullscreen"
            ? "flex h-full min-h-0 flex-col gap-4"
            : "grid gap-4"
        }
      >
        <div className="flex shrink-0 items-center justify-between gap-4">
          <Heading
            level={2}
            size="subsection"
            weight="bold"
            id={titleId}
            className="min-w-0"
          >
            {title}
          </Heading>
          <Button
            variant="secondary"
            aria-label={closeLabel}
            loadingLabel=""
            className="size-12 shrink-0 border-transparent bg-transparent p-0 text-muted-foreground enabled:hover:bg-surface-muted"
            onClick={() => onOpenChange(false)}
          >
            <X aria-hidden="true" className="size-6" />
          </Button>
        </div>
        {description && (
          <p
            id={titleId + "-description"}
            className="m-0 text-sm text-muted-foreground"
          >
            {description}
          </p>
        )}
        <div
          className={
            variant === "fullscreen"
              ? "min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain"
              : "min-w-0"
          }
        >
          {children}
        </div>
        {footer && (
          <div className="flex flex-wrap justify-end gap-3 pt-4">{footer}</div>
        )}
      </div>
    </dialog>
  );
}
