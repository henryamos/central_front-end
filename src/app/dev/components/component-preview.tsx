"use client";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Container } from "@/components/layout/container/container";
import { Section } from "@/components/layout/section/section";
import { Heading, Text } from "@/components/ui/typography/typography";
import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";
import { FormField } from "@/components/ui/form-field/form-field";
import { Spinner } from "@/components/ui/spinner/spinner";
import { Alert } from "@/components/ui/alert/alert";
import { Dialog } from "@/components/ui/dialog/dialog";
import { Accordion } from "@/components/ui/accordion/accordion";
import { Checkbox } from "@/components/ui/checkbox/checkbox";
import { Select } from "@/components/ui/select/select";
import { Textarea } from "@/components/ui/textarea/textarea";
const schema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, "Enter at least two characters.")
    .max(80, "Use 80 characters or fewer."),
  email: z.email("Enter a valid email address."),
});
type PreviewValues = z.infer<typeof schema>;
export function ComponentPreview() {
  const dialogTriggerRef = useRef<HTMLButtonElement>(null);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (!saving) return;
    const timer = setTimeout(() => setSaving(false), 1500);
    return () => clearTimeout(timer);
  }, [saving]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actions, setActions] = useState(0),
    [validated, setValidated] = useState(false);
  const form = useForm<PreviewValues>({
    resolver: zodResolver(schema),
    defaultValues: { displayName: "", email: "" },
  });
  const increment = () => setActions((value) => value + 1);
  return (
    <>
      <Section className="py-8 md:py-12" aria-labelledby="preview-title">
        <Container className="grid gap-6">
          <Heading level={1} id="preview-title" weight="black">
            UI primitives
          </Heading>
          <Text size="lead">
            Development-only reference for the shared layout, typography and
            controls.
          </Text>
        </Container>
      </Section>
      <Section
        className="bg-surface-muted py-8 md:py-12"
        aria-labelledby="typography-title"
      >
        <Container className="grid gap-6">
          <Heading
            level={2}
            id="typography-title"
            size="title"
            className="text-primary"
          >
            Typography
          </Heading>
          <Heading level={3}>A shared heading scale</Heading>
          <Text>Body text uses DM Sans and the shared reading measure.</Text>
          <Text size="small" tone="muted">
            Supporting text remains readable on the secondary surface.
          </Text>
        </Container>
      </Section>
      <Section className="py-8 md:py-12" aria-labelledby="buttons-title">
        <Container className="grid gap-6">
          <Heading level={2} id="buttons-title">
            Buttons
          </Heading>
          <div className="flex flex-wrap items-start gap-3">
            <Button onClick={increment}>Primary action</Button>
            <Button variant="secondary" onClick={increment}>
              Secondary action
            </Button>
            <Button disabled onClick={increment}>
              Disabled action
            </Button>
            <Button
              loading={saving}
              loadingLabel="Saving?"
              onClick={() => setSaving(true)}
            >
              Save example
            </Button>
            <Button variant="secondary" onClick={increment}>
              An action with a longer label that must wrap on small screens
            </Button>
          </div>
          <Text size="small" role="status">
            Action count: {actions}
          </Text>
        </Container>
      </Section>
      <Section
        className="bg-surface-muted py-8 md:py-12"
        aria-labelledby="fields-title"
      >
        <Container className="grid gap-6">
          <Heading level={2} id="fields-title">
            Fields and validation
          </Heading>
          <form
            noValidate
            aria-labelledby="fields-title"
            className="grid max-w-(--form-max) gap-6"
            onChange={() => setValidated(false)}
            onSubmit={form.handleSubmit(() => setValidated(true))}
          >
            <FormField
              id="preview-name"
              label="Display name"
              description="Use at least two characters."
              required
              error={form.formState.errors.displayName?.message}
            >
              {(control) => (
                <Input
                  {...form.register("displayName")}
                  {...control}
                  autoComplete="off"
                />
              )}
            </FormField>
            <FormField
              id="preview-email"
              label="Email"
              description="Use a synthetic address for this preview."
              required
              error={form.formState.errors.email?.message}
            >
              {(control) => (
                <Input
                  {...form.register("email")}
                  {...control}
                  type="email"
                  autoComplete="off"
                />
              )}
            </FormField>
            <div>
              <Button type="submit">Validate example</Button>
            </div>
            {validated && (
              <Text role="status">
                Local validation passed. No data was sent.
              </Text>
            )}
          </form>
          <div className="grid gap-6 md:grid-cols-3">
            <FormField id="preview-disabled" label="Disabled field">
              {(control) => (
                <Input {...control} defaultValue="Disabled example" disabled />
              )}
            </FormField>
            <FormField id="preview-readonly" label="Read-only field">
              {(control) => (
                <Input {...control} defaultValue="Read-only example" readOnly />
              )}
            </FormField>
            <FormField
              id="preview-invalid"
              label="Invalid state example"
              error="Example error feedback."
            >
              {(control) => (
                <Input {...control} defaultValue="Invalid example" />
              )}
            </FormField>
          </div>
        </Container>
      </Section>
      <Section className="py-8 md:py-12" aria-labelledby="additional-title">
        <Container className="grid gap-6">
          <Heading level={2} id="additional-title">
            Feedback and selection
          </Heading>
          <div className="grid items-start gap-8 lg:grid-cols-2">
            <form
              aria-label="Selection example"
              className="grid w-full max-w-(--form-max) gap-6"
              onSubmit={(event) => event.preventDefault()}
            >
              <Heading level={3}>Selections and messages</Heading>
              <FormField id="preview-select" label="Example category" required>
                {(control) => (
                  <Select
                    {...control}
                    name="category"
                    placeholder="Choose a category"
                    options={[
                      { value: "general", label: "General" },
                      { value: "other", label: "Other" },
                      {
                        value: "unavailable",
                        label: "Unavailable",
                        disabled: true,
                      },
                    ]}
                  />
                )}
              </FormField>
              <FormField id="preview-message" label="Example message">
                {(control) => (
                  <Textarea {...control} placeholder="Synthetic example only" />
                )}
              </FormField>
              <div className="grid gap-1">
                <Checkbox label="Example preference" name="preference" />
                <Checkbox label="Unavailable preference" disabled />
              </div>
            </form>
            <div className="grid w-full max-w-(--form-max) gap-6">
              <Heading level={3}>Feedback and disclosure</Heading>
              <Spinner label="Loading example" />
              <Alert title="For your information">
                Example information. Nothing has been submitted.
              </Alert>
              <Alert tone="error" title="Review your selection">
                Example error: please review your selection.
              </Alert>
              <div>
                <Accordion summary="How does the accordion work?">
                  Use Enter or Space to expand this native disclosure.
                </Accordion>
                <Accordion summary="Can more than one item stay open?">
                  Yes. Each item keeps its own native open state.
                </Accordion>
              </div>
              <div>
                <Button
                  ref={dialogTriggerRef}
                  onClick={() => setDialogOpen(true)}
                >
                  Open example dialog
                </Button>
              </div>
            </div>
          </div>
          <Dialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            title="Example dialog"
            returnFocusRef={dialogTriggerRef}
            description="Use synthetic details to preview the form."
            footer={
              <>
                <Button
                  variant="secondary"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={() => setDialogOpen(false)}>Done</Button>
              </>
            }
          >
            <div className="grid gap-4">
              <FormField id="dialog-message" label="Dialog message">
                {(control) => <Input {...control} />}
              </FormField>
              <FormField id="dialog-category" label="Dialog category">
                {(control) => (
                  <Select
                    {...control}
                    options={[
                      { value: "general", label: "General" },
                      { value: "other", label: "Other" },
                    ]}
                  />
                )}
              </FormField>
            </div>
          </Dialog>
        </Container>
      </Section>
    </>
  );
}
