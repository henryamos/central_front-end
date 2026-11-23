import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/utils";
export type SectionProps = ComponentPropsWithRef<"section">;
/** Owns vertical spacing; compose a Container when page gutters are needed. */
export function Section({ className, ...props }: SectionProps) {
  return <section {...props} className={cn("section", className)} />;
}
