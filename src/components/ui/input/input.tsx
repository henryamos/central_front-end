import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/utils";
import { fieldClasses } from "./field-classes";
export type InputProps = Omit<ComponentPropsWithRef<"input">, "type"> & {
  type?: "text" | "email" | "password" | "tel" | "url" | "search";
};
/** Text-like native input. Labels and validation wiring are owned by FormField. */
export function Input({ type = "text", className, ...props }: InputProps) {
  return (
    <input {...props} type={type} className={cn(fieldClasses, className)} />
  );
}
