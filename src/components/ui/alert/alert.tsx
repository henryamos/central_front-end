import type { ComponentPropsWithRef } from "react";
import { CircleAlert, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export function Alert({
  tone = "info",
  title,
  className,
  children,
  ...props
}: ComponentPropsWithRef<"div"> & { tone?: "info" | "error"; title?: string }) {
  const Icon = tone === "error" ? CircleAlert : Info;
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      {...props}
      className={cn(
        "flex items-start gap-3 rounded-sm bg-surface-muted p-4 text-base text-foreground",
        className,
      )}
    >
      <Icon
        aria-hidden="true"
        className={cn(
          "size-6 shrink-0",
          tone === "error" ? "text-danger" : "text-primary",
        )}
      />
      <div className="grid min-w-0 gap-1">
        {title && <p className="m-0 leading-ui font-semibold">{title}</p>}
        <div>{children}</div>
      </div>
    </div>
  );
}
