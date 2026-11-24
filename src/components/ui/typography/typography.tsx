import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/utils";
const headingSizes = {
  display: "text-display",
  title: "text-title",
  section: "text-2xl md:text-3xl",
  subsection: "text-xl md:text-2xl",
  small: "text-lg",
};
type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingProps = ComponentPropsWithRef<"h1"> & {
  level: HeadingLevel;
  size?: keyof typeof headingSizes;
  weight?: "semibold" | "bold" | "extrabold" | "black";
};
export function Heading({
  level,
  size,
  weight,
  className,
  ...props
}: HeadingProps) {
  const Tag = ("h" + level) as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  const visualSize =
    size ??
    (level === 1
      ? "title"
      : level === 2
        ? "section"
        : level === 3
          ? "subsection"
          : "small");
  return (
    <Tag
      {...props}
      className={cn(
        "m-0 leading-heading font-semibold tracking-tight",
        {
          semibold: "font-semibold",
          bold: "font-bold",
          extrabold: "font-extrabold",
          black: "font-black",
        }[weight ?? (level === 1 ? "bold" : "semibold")],
        headingSizes[visualSize],
        className,
      )}
    />
  );
}
const textSizes = {
  body: "text-base",
  lead: "text-lg",
  small: "text-sm",
  caption: "text-xs",
};
export type TextProps = ComponentPropsWithRef<"p"> & {
  size?: keyof typeof textSizes;
  tone?: "default" | "muted";
};
export function Text({
  size = "body",
  tone = "default",
  className,
  ...props
}: TextProps) {
  return (
    <p
      {...props}
      className={cn(
        "m-0 font-normal",
        textSizes[size],
        tone === "muted" && "text-muted-foreground",
        className,
      )}
    />
  );
}
