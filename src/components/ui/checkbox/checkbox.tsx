import type { ComponentPropsWithRef, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export type CheckboxProps = Omit<
  ComponentPropsWithRef<"input">,
  "type" | "children" | "size"
> & { label: ReactNode };

/** The label owns the 48px target; the native checkbox preserves keyboard/form behaviour. */
export function Checkbox({
  label,
  className,
  disabled,
  ...props
}: CheckboxProps) {
  return (
    <label
      className={cn(
        "flex min-h-(--touch-target) min-w-(--touch-target) items-start gap-3 py-3 text-base leading-ui",
        disabled
          ? "cursor-not-allowed text-muted-foreground"
          : "cursor-pointer",
      )}
    >
      <span className="relative size-6 shrink-0">
        <input
          {...props}
          disabled={disabled}
          type="checkbox"
          className={cn(
            "peer m-0 block size-6 cursor-pointer appearance-none rounded-sm border-(length:--control-border-width) border-border-control bg-background checked:border-primary checked:bg-primary focus-visible:inset-ring-(length:--focus-width) focus-visible:inset-ring-primary focus-visible:outline-hidden checked:focus-visible:inset-ring-primary-foreground disabled:cursor-not-allowed disabled:border-border-control disabled:bg-surface-muted aria-invalid:border-danger forced-colors:appearance-auto",
            className,
          )}
        />
        <Check
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 m-auto hidden size-4 text-primary-foreground peer-checked:block peer-disabled:text-muted-foreground forced-colors:hidden"
        />
      </span>
      <span className="min-w-0">{label}</span>
    </label>
  );
}
