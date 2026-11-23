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
      if (!dialog.open) dialog.showModal();
      wasOpen.current = true;
    } else if (wasOpen.current) {
      if (dialog.open) dialog.close();
      returnFocusRef?.current?.focus();
      wasOpen.current = false;
    }
  }, [open, returnFocusRef]);
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
            "a[href],button,input,select,textarea,[tabindex]",
          ),
        ).filter(
          (element) =>
            !element.matches(':disabled,[tabindex="-1"]') &&
            !element.closest("[hidden],[inert]") &&
            element.getClientRects().length > 0,
        );
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
        className,
      )}
    >
      <div className="grid gap-4">
        <div className="flex items-center justify-between gap-4">
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
        <div className="min-w-0">{children}</div>
        {footer && (
          <div className="flex flex-wrap justify-end gap-3 pt-4">{footer}</div>
        )}
      </div>
    </dialog>
  );
}
