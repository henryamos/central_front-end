import { cn } from "@/lib/utils";
const baseClasses =
  "inline-flex min-h-(--touch-target) min-w-(--touch-target) max-w-full items-center justify-center rounded-sm border-(length:--control-border-width) border-transparent px-4 py-3 text-center font-sans text-base font-semibold leading-ui whitespace-normal cursor-pointer transition-(--transition-control) duration-(--duration-fast) ease-standard focus-visible:outline-hidden focus-visible:inset-ring-(length:--focus-width)";
const variantClasses = {
  primary:
    "bg-primary text-primary-foreground focus-visible:inset-ring-primary-foreground not-disabled:hover:bg-primary-hover not-disabled:active:bg-primary-active",
  secondary:
    "focus-visible:inset-ring-primary border-primary bg-background text-primary not-disabled:hover:bg-surface-muted not-disabled:active:border-primary-active not-disabled:active:text-primary-active",
};

export function buttonStyles(variant: "primary" | "secondary" = "primary") {
  return cn(baseClasses, variantClasses[variant]);
}
