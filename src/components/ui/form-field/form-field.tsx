import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
export type FormControlProps = {
  id: string;
  required: boolean;
  "aria-describedby"?: string;
  "aria-invalid"?: true;
};
export type FormFieldProps = {
  id: string;
  label: string;
  description?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: (props: FormControlProps) => ReactNode;
};
/** Explicit IDs and a render prop avoid hidden context, cloning, and ref composition. */
export function FormField({
  id,
  label,
  description,
  error,
  required = false,
  className,
  children,
}: FormFieldProps) {
  const hasError = Boolean(error?.trim()),
    hasDescription = Boolean(description?.trim());
  const describedBy =
    [hasDescription && id + "-description", hasError && id + "-error"]
      .filter(Boolean)
      .join(" ") || undefined;
  return (
    <div className={cn("grid min-w-0 content-start gap-2", className)}>
      <label htmlFor={id} className="text-base leading-ui font-medium">
        {label}
        {required && (
          <span
            aria-hidden="true"
            className="font-normal text-muted-foreground"
          >
            {" "}
            (required)
          </span>
        )}
      </label>
      {children({
        id,
        required,
        "aria-describedby": describedBy,
        "aria-invalid": hasError ? true : undefined,
      })}
      {hasDescription && (
        <p
          id={id + "-description"}
          className="m-0 text-sm leading-ui wrap-anywhere text-muted-foreground"
        >
          {description}
        </p>
      )}
      {hasError && (
        <p
          id={id + "-error"}
          role="alert"
          className="m-0 text-sm leading-ui wrap-anywhere text-danger"
        >
          Error: {error}
        </p>
      )}
    </div>
  );
}
