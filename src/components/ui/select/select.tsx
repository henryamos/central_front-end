"use client";

import {
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ComponentProps,
  type ComponentPropsWithRef,
} from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { fieldClasses } from "@/components/ui/input/field-classes";

export type SelectOption = { value: string; label: string; disabled?: boolean };
export type SelectProps = Omit<
  ComponentPropsWithRef<typeof SelectPrimitive.Trigger>,
  "children" | "defaultValue" | "value" | "onChange"
> &
  Pick<
    ComponentProps<typeof SelectPrimitive.Root>,
    | "name"
    | "required"
    | "disabled"
    | "value"
    | "defaultValue"
    | "onValueChange"
    | "autoComplete"
  > & {
    options: readonly SelectOption[];
    placeholder?: string;
  };

/** Custom single-select. A headless primitive owns keyboard, typeahead and form behaviour. */
export function Select({
  ref,
  name,
  required,
  disabled,
  value,
  defaultValue,
  onValueChange,
  autoComplete,
  options,
  placeholder = "Choose an option",
  className,
  ...props
}: SelectProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [portalContainer, setPortalContainer] = useState<
    HTMLElement | undefined
  >(undefined);
  useImperativeHandle(ref, () => triggerRef.current!);
  // A popup inside a native modal must share that modal's top layer/inert boundary.
  useEffect(() => {
    setPortalContainer(triggerRef.current?.closest("dialog") ?? undefined);
  }, []);
  return (
    <SelectPrimitive.Root
      name={name}
      required={required}
      disabled={disabled}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      autoComplete={autoComplete}
    >
      <SelectPrimitive.Trigger
        {...props}
        ref={triggerRef}
        className={cn(
          fieldClasses,
          "flex items-center justify-between gap-3 text-left data-placeholder:text-muted-foreground [&>span:first-child]:min-w-0 [&>span:first-child]:wrap-anywhere",
          className,
        )}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon asChild>
          <ChevronDown
            aria-hidden="true"
            className="size-4 shrink-0 text-muted-foreground"
          />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal container={portalContainer}>
        <SelectPrimitive.Content
          position="popper"
          align="start"
          collisionPadding={16}
          className="z-(--layer-popover) my-1 max-h-[min(var(--select-menu-max),var(--radix-select-content-available-height))] w-(--radix-select-trigger-width) overflow-hidden rounded-sm border-(length:--control-border-width) border-border-control bg-background text-foreground"
        >
          <SelectPrimitive.ScrollUpButton className="flex min-h-(--touch-target) items-center justify-center bg-background">
            <ChevronUp aria-hidden="true" className="size-4" />
          </SelectPrimitive.ScrollUpButton>
          <SelectPrimitive.Viewport className="p-1">
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                textValue={option.label}
                className="forced-colors:data-highlighted:outline-auto relative flex min-h-(--touch-target) cursor-pointer items-center gap-3 rounded-sm py-3 pr-12 pl-3 text-base leading-ui outline-hidden data-disabled:cursor-not-allowed data-disabled:text-muted-foreground data-highlighted:bg-primary data-highlighted:text-primary-foreground data-[state=checked]:font-semibold"
              >
                <SelectPrimitive.ItemText>
                  {option.label}
                </SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator className="absolute right-3 flex size-6 items-center justify-center">
                  <Check aria-hidden="true" className="size-4" />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
          <SelectPrimitive.ScrollDownButton className="flex min-h-(--touch-target) items-center justify-center bg-background">
            <ChevronDown aria-hidden="true" className="size-4" />
          </SelectPrimitive.ScrollDownButton>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
