// @vitest-environment jsdom
import "../setup";
import { createRef, type FormEvent } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { Container } from "@/components/layout/container/container";
import { Section } from "@/components/layout/section/section";
import { Heading, Text } from "@/components/ui/typography/typography";
import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";
import { FormField } from "@/components/ui/form-field/form-field";
it("composes semantic section/layout elements and forwards native refs", () => {
  const ref = createRef<HTMLDivElement>();
  render(
    <Section aria-labelledby="example-title">
      <Container ref={ref} id="frame">
        <Heading level={2} id="example-title">
          Example section
        </Heading>
        <Text>Body copy</Text>
      </Container>
    </Section>,
  );
  expect(screen.getByRole("region", { name: "Example section" }).tagName).toBe(
    "SECTION",
  );
  expect(ref.current).toBe(document.getElementById("frame"));
  expect(screen.getByText("Body copy").tagName).toBe("P");
});
it("keeps heading level independent from its visual size", () => {
  const ref = createRef<HTMLHeadingElement>();
  render(
    <Heading level={3} size="title" ref={ref}>
      A subsection
    </Heading>,
  );
  expect(screen.getByRole("heading", { level: 3, name: "A subsection" })).toBe(
    ref.current,
  );
  expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
});
it("defaults action buttons to non-submitting native buttons", () => {
  const submit = vi.fn((event: FormEvent) => event.preventDefault()),
    click = vi.fn();
  render(
    <form onSubmit={submit}>
      <Button onClick={click}>Act</Button>
    </form>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Act" }));
  expect(click).toHaveBeenCalledOnce();
  expect(submit).not.toHaveBeenCalled();
});
it("preserves explicit form submission", () => {
  const submit = vi.fn((event: FormEvent) => event.preventDefault());
  render(
    <form onSubmit={submit}>
      <Button type="submit">Submit example</Button>
    </form>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Submit example" }));
  expect(submit).toHaveBeenCalledOnce();
});
it("blocks repeated activation while busy and permits recovery", () => {
  const click = vi.fn();
  const view = render(
    <Button loading loadingLabel="Saving example..." onClick={click}>
      Save
    </Button>,
  );
  const button = screen.getByRole("button", { name: "Saving example..." });
  expect(button).toBeDisabled();
  expect(button).toHaveAttribute("aria-busy", "true");
  fireEvent.click(button);
  expect(click).not.toHaveBeenCalled();
  view.rerender(<Button onClick={click}>Save</Button>);
  expect(screen.getByRole("button", { name: "Save" })).toBeEnabled();
  fireEvent.click(screen.getByRole("button", { name: "Save" }));
  expect(click).toHaveBeenCalledOnce();
});
it("forwards button refs and preserves native disabled state", () => {
  const ref = createRef<HTMLButtonElement>(),
    click = vi.fn();
  render(
    <Button ref={ref} variant="secondary" disabled onClick={click}>
      Unavailable
    </Button>,
  );
  expect(ref.current).toBe(screen.getByRole("button", { name: "Unavailable" }));
  fireEvent.click(ref.current!);
  expect(click).not.toHaveBeenCalled();
});
it("preserves native input refs, attributes and change events", () => {
  const ref = createRef<HTMLInputElement>(),
    change = vi.fn();
  render(
    <>
      <label htmlFor="address">Email address</label>
      <Input
        ref={ref}
        id="address"
        name="email"
        type="email"
        autoComplete="email"
        onChange={change}
      />
    </>,
  );
  const control = screen.getByRole("textbox", { name: "Email address" });
  expect(control).toBe(ref.current);
  expect(control).toHaveAttribute("type", "email");
  expect(control).toHaveAttribute("autocomplete", "email");
  fireEvent.change(control, { target: { value: "test@example.invalid" } });
  expect(change).toHaveBeenCalledOnce();
  expect(control).toHaveValue("test@example.invalid");
});
it("connects required labels, help and errors without using colour alone", () => {
  render(
    <FormField
      id="email"
      label="Email"
      required
      description="Example help."
      error="Enter a valid address."
    >
      {(control) => <Input {...control} type="email" />}
    </FormField>,
  );
  const control = screen.getByRole("textbox", { name: "Email" });
  expect(control).toBeRequired();
  expect(control).toHaveAttribute("aria-invalid", "true");
  expect(control).toHaveAccessibleDescription(
    "Example help. Error: Enter a valid address.",
  );
  expect(screen.getByRole("alert")).toHaveTextContent(
    "Error: Enter a valid address.",
  );
});
it("removes stale error associations after validation recovery", () => {
  const view = render(
    <FormField id="name" label="Name" description="Help." error="Required.">
      {(control) => <Input {...control} />}
    </FormField>,
  );
  view.rerender(
    <FormField id="name" label="Name" description="Help.">
      {(control) => <Input {...control} />}
    </FormField>,
  );
  const control = screen.getByRole("textbox", { name: "Name" });
  expect(control).not.toHaveAttribute("aria-invalid");
  expect(control).toHaveAttribute("aria-describedby", "name-description");
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});
it("omits unused description IDs and keeps optional fields optional", () => {
  render(
    <FormField id="optional" label="Optional name">
      {(control) => <Input {...control} />}
    </FormField>,
  );
  const control = screen.getByRole("textbox", { name: "Optional name" });
  expect(control).not.toBeRequired();
  expect(control).not.toHaveAttribute("aria-describedby");
});
it("keeps read-only inputs focusable and distinct from disabled inputs", () => {
  render(
    <>
      <Input aria-label="Read only" readOnly defaultValue="Example" />
      <Input aria-label="Disabled" disabled />
    </>,
  );
  expect(screen.getByRole("textbox", { name: "Read only" })).toHaveAttribute(
    "readonly",
  );
  expect(screen.getByRole("textbox", { name: "Read only" })).toBeEnabled();
  expect(screen.getByRole("textbox", { name: "Disabled" })).toBeDisabled();
});

it("supports a deliberate 900-weight heading without changing its level", () => {
  render(
    <Heading level={2} weight="black">
      Display heading
    </Heading>,
  );
  expect(screen.getByRole("heading", { level: 2 })).toHaveClass("font-black");
});
