import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner/spinner";
import { buttonStyles } from "./button.styles";
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
        buttonStyles(variant),
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
