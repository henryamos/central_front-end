import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/utils";
import { fieldClasses } from "@/components/ui/input/field-classes";

export function Textarea({
  className,
  rows = 4,
  ...props
}: ComponentPropsWithRef<"textarea">) {
  return (
    <textarea
      {...props}
      rows={rows}
      className={cn(fieldClasses, "resize-y", className)}
    />
  );
}
