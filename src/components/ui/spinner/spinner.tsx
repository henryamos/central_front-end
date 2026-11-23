import type { ComponentPropsWithRef } from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function Spinner({
  label = "Loading",
  decorative = false,
  className,
  ...props
}: Omit<ComponentPropsWithRef<"span">, "children"> & {
  label?: string;
  decorative?: boolean;
}) {
  return (
    <span
      {...props}
      role={decorative ? undefined : "status"}
      aria-hidden={decorative || undefined}
      className={cn("inline-flex items-center gap-2 text-base", className)}
    >
      <LoaderCircle
        aria-hidden="true"
        className="size-6 shrink-0 animate-spin motion-reduce:animate-none"
      />
      {!decorative && <span>{label}</span>}
    </span>
  );
}
