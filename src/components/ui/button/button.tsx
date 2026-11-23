import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner/spinner";
const baseClasses =
  "inline-flex min-h-(--touch-target) min-w-(--touch-target) max-w-full items-center justify-center rounded-sm border-(length:--control-border-width) border-transparent px-4 py-3 text-center font-sans text-base font-semibold leading-ui whitespace-normal cursor-pointer transition-(--transition-control) duration-(--duration-fast) ease-standard focus-visible:outline-hidden focus-visible:inset-ring-(length:--focus-width)";
const variantClasses = {
  primary:
    "bg-primary text-primary-foreground focus-visible:inset-ring-primary-foreground enabled:hover:bg-primary-hover enabled:active:bg-primary-active",
  secondary:
    "focus-visible:inset-ring-primary border-primary bg-background text-primary enabled:hover:bg-surface-muted enabled:active:border-primary-active enabled:active:text-primary-active",
};
export type ButtonProps = ComponentPropsWithRef<"button"> & {
  variant?: "primary" | "secondary";
  loading?: boolean;
  loadingLabel?: string;
};
export function Button({
  variant = "primary",
  loading = false,
  loadingLabel,
  disabled = false,
  type = "button",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading ? true : props["aria-busy"]}
      className={cn(
        baseClasses,
        variantClasses[variant],
        loading
          ? "cursor-wait"
          : disabled &&
              "cursor-not-allowed border-border-control bg-surface-muted text-muted-foreground",
        className,
      )}
    >
      <span className="grid min-w-0 wrap-anywhere">
        <span
          aria-hidden={loading || undefined}
          className={cn("col-start-1 row-start-1", loading && "invisible")}
        >
          {children}
        </span>
        {(loading || Boolean(loadingLabel)) && (
          <span
            aria-hidden={!loading || undefined}
            className={cn(
              "col-start-1 row-start-1 flex items-center justify-center gap-2",
              !loading && "invisible",
            )}
          >
            {loading ? (
              <Spinner decorative />
            ) : (
              <span className="size-6 shrink-0" />
            )}
            <span className="min-w-0">{loadingLabel ?? "Loading..."}</span>
          </span>
        )}
      </span>
    </button>
  );
}
