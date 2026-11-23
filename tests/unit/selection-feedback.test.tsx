// @vitest-environment jsdom
import "../setup";
import { createRef } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { it, expect, vi } from "vitest";
import { Checkbox } from "@/components/ui/checkbox/checkbox";
import { Select } from "@/components/ui/select/select";
import { Textarea } from "@/components/ui/textarea/textarea";
import { Alert } from "@/components/ui/alert/alert";
import { Spinner } from "@/components/ui/spinner/spinner";
import { FormField } from "@/components/ui/form-field/form-field";
it("checkbox labels toggle native checked state and preserve refs/form values", () => {
  const ref = createRef<HTMLInputElement>(),
    change = vi.fn();
  render(
    <Checkbox
      ref={ref}
      label="Receive updates"
      name="updates"
      value="yes"
      onChange={change}
    />,
  );
  fireEvent.click(screen.getByText("Receive updates"));
  expect(ref.current).toBeChecked();
  expect(ref.current).toHaveAttribute("name", "updates");
  expect(change).toHaveBeenCalledOnce();
});
it("disabled checkbox cannot change through its label", () => {
  const change = vi.fn();
  render(<Checkbox label="Disabled choice" disabled onChange={change} />);
  fireEvent.click(screen.getByText("Disabled choice"));
  expect(change).not.toHaveBeenCalled();
  expect(screen.getByRole("checkbox")).not.toBeChecked();
});
it("custom select preserves trigger refs, required/error semantics and labels", () => {
  const ref = createRef<HTMLButtonElement>();
  render(
    <FormField id="category" label="Category" required error="Choose one.">
      {(control) => (
        <Select
          {...control}
          ref={ref}
          name="category"
          options={[{ value: "other", label: "Other" }]}
        />
      )}
    </FormField>,
  );
  const select = screen.getByRole("combobox", { name: "Category" });
  expect(select).toBe(ref.current);
  expect(select).toHaveAttribute("aria-required", "true");
  expect(select).toHaveAccessibleDescription("Error: Choose one.");
});
it("textarea preserves native ref, read-only and description wiring", () => {
  const ref = createRef<HTMLTextAreaElement>();
  render(
    <FormField id="message" label="Message" description="Example only.">
      {(control) => (
        <Textarea {...control} ref={ref} readOnly defaultValue="Example" />
      )}
    </FormField>,
  );
  expect(screen.getByRole("textbox", { name: "Message" })).toBe(ref.current);
  expect(ref.current).toHaveAttribute("readonly");
  expect(ref.current).toHaveAccessibleDescription("Example only.");
});
it("feedback uses live semantics and decorative spinners stay silent", () => {
  const view = render(
    <>
      <Alert tone="error">Review the form.</Alert>
      <Spinner label="Fetching records" />
    </>,
  );
  expect(screen.getByRole("alert")).toHaveTextContent("Review the form.");
  expect(screen.getByRole("status")).toHaveTextContent("Fetching records");
  view.rerender(<Spinner decorative />);
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
});
