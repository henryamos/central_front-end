import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/utils";
export type ContainerProps = ComponentPropsWithRef<"div">;
/** Owns page gutters. Use sibling containers, never nested page containers. */
export function Container({ className, ...props }: ContainerProps) {
  return <div {...props} className={cn("site-container", className)} />;
}
