import Link from "next/link";
import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/utils";
import { buttonStyles } from "./button.styles";
/** Navigation with shared action styling; never nest a button inside an anchor. */
export function ButtonLink({
  variant = "primary",
  className,
  ...props
}: ComponentPropsWithRef<typeof Link> & {
  variant?: "primary" | "secondary";
}) {
  return (
    <Link
      {...props}
      className={cn(buttonStyles(variant), "gap-2 no-underline", className)}
    />
  );
}
