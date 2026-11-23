import type { ComponentPropsWithRef, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

/** Independent native disclosure; compose siblings for an accordion. */
export function Accordion({
  summary,
  children,
  className,
  ...props
}: Omit<ComponentPropsWithRef<"details">, "children"> & {
  summary: ReactNode;
  children: ReactNode;
}) {
  return (
    <details
      {...props}
      className={cn(
        "group min-w-0 rounded-sm border-b-(length:--control-border-width) border-border open:border-transparent open:bg-surface-muted",
        className,
      )}
    >
      <summary className="flex min-h-(--touch-target) cursor-pointer list-none items-center justify-between gap-4 rounded-sm px-4 py-3 text-base font-semibold group-open:text-primary hover:bg-surface-muted focus-visible:inset-ring-(length:--focus-width) focus-visible:inset-ring-primary focus-visible:outline-hidden [&::-webkit-details-marker]:hidden">
        <span className="min-w-0">{summary}</span>
        <ChevronDown
          aria-hidden="true"
          className="size-4 shrink-0 text-muted-foreground transition-transform duration-(--duration-fast) ease-standard group-open:rotate-180 group-open:text-primary"
        />
      </summary>
      <div className="px-4 pb-4 text-base text-muted-foreground">
        {children}
      </div>
    </details>
  );
}
