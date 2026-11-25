# Shared UI primitives (FND-002)

## Objective and acceptance

As a contributor, I can compose accessible, responsive controls and page sections from one shared implementation. Scope: Container, Section, Heading/Text, Button, Input, FormField, Select, Textarea, Checkbox, Spinner, Alert, Accordion and Dialog. Acceptance covers native semantics/refs, action and submission behaviour, labels/help/errors, 48px targets, shared token usage, keyboard focus, long labels, 200% text enlargement and the Chromium/Firefox/WebKit engines. These are the first primitives, not the complete site layout or a guest-registration feature.

API/data impact: client-only example validation in the development preview; production feature/API contracts remain owned by their feature. The preview uses synthetic values and sends no form data. Production returns 404 for /dev/components. No migration is needed. The custom Select uses @radix-ui/react-select for headless accessibility; all appearance is authored here in Tailwind. Shared primitives are public UI; authorization and privacy remain feature/API responsibilities.

## Implementation pattern

- Keep one named component implementation per owning folder; related Heading and Text share typography.tsx. Import the concrete component file rather than adding empty or circular barrel exports.
- Use typed native React props, native elements and React 19 refs. The consuming feature owns form state, requests, validation and action outcomes. Dialog synchronizes its controlled open prop with the native browser modal.
- Style primitives with token-based Tailwind utilities and cn. tokens.css owns values; globals.css owns base rules and shared layout geometry. No per-component .module.css files or new styling/variant dependency is required for this set.
- Use complete static class strings for variants so Tailwind can discover them. cn knows the custom title-size and leading tokens, preventing text colours from accidentally replacing text size.
- Keep the native default behaviour predictable. Avoid polymorphic asChild factories, hidden form context, cloneElement and duplicated breakpoint/configuration maps.
- Components work in Server Component composition. Put browser handlers, hooks and interactive form state in the consuming Client Component, not a client directive on every primitive. Dialog and Select are Client Components for their browser interaction; the remaining simple primitives keep native composition.
- Each component or variant must satisfy the shared [responsive and browser contract](DESIGN-SYSTEM.md) in its actual feature context. The current input/form-field styling is for white/off-white surfaces; define and test an inverse variant when a real feature needs one.

## APIs and states

| Component  | Import under src/components | Contract                                                                                                                                                                                         |
| ---------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Container  | layout/container/container  | Native div props/ref; owns page gutters through .site-container; className may add layout such as grid/gap, not nested page padding                                                              |
| Section    | layout/section/section      | Native section props/ref; owns responsive vertical spacing; label meaningful sections with aria-labelledby or aria-label                                                                         |
| Heading    | ui/typography/typography    | Required level 1-6 determines semantics; optional size title/section/subsection/small determines appearance; optional weight semibold/bold/extrabold (800)/black (900); native heading props/ref |
| Text       | ui/typography/typography    | Paragraph props/ref; body/lead/small/caption sizes; default/inherited or muted tone; captions are not body text                                                                                  |
| ButtonLink | ui/button/button-link       | Native Next Link props/ref; primary/secondary; shares Button appearance for navigation; no disabled/loading props                                                                                |
| Button     | ui/button/button            | Native button props/ref; primary/secondary; default type=button; loading and disabled block activation; loadingLabel supplies progress text                                                      |
| Input      | ui/input/input              | Native props/ref for text/email/password/tel/url/search; default text; preserves required, disabled, readOnly, name, autoComplete, inputMode, events and ARIA attributes                         |
| FormField  | ui/form-field/form-field    | Explicit unique id, label, optional description/error/required; render callback receives the control's native id/required/ARIA props                                                             |

Heading size is independent of level. Title uses the existing fluid token; section/subsection sizes step through the shared md breakpoint. Paragraph margins and heading margins are reset so layout gap owns spacing once. Body/control text remains at least 16px. Container and Section do not inject each other; compose them explicitly to avoid doubled gutters.

Buttons retain visible text and a visible inset keyboard focus keyline, without an offset outer outline. The primary keyline is white; secondary controls use Denim. Inputs use a single inset border treatment, retaining the danger colour while an invalid field is focused. outline-hidden keeps a system outline available in forced-colours mode. Native disabled and busy states cannot trigger callbacks; a busy button exposes aria-busy. Use a real submit type for form submission and real links for navigation. Meaningful children or an aria-label are required for an accessible name. The shared durations respect reduced motion. Disabled text retains readable contrast rather than reducing the opacity of the entire control.

Input does not invent validation rules. FormField labels the supplied input with htmlFor/id, joins description/error IDs through aria-describedby and sets aria-invalid only for an actual nonempty error. Errors include an explicit Error: prefix and use the semantic danger token, not colour alone. The one danger colour is reserved for validation, with contrast checked on both supported surfaces. The control border width is tokenized. Read-only controls remain focusable; disabled controls are excluded from normal keyboard interaction.

## Composition

Use a full-width section for background bands and one inner page container:

```tsx
<Section aria-labelledby="section-title" className="bg-surface-muted">
  <Container className="grid gap-6">
    <Heading level={2} id="section-title">
      Section heading
    </Heading>
    <Text>Approved content belongs to its feature.</Text>
    <Button type="button">Perform an action</Button>
  </Container>
</Section>
```

Feature-owned forms connect their own schema and state while keeping refs intact:

```tsx
<FormField
  id="profile-email"
  label="Email"
  required
  description="Approved help text."
  error={form.formState.errors.email?.message}
>
  {(control) => (
    <Input
      {...form.register("email")}
      {...control}
      type="email"
      autoComplete="email"
    />
  )}
</FormField>
```

Use stable unique IDs without spaces. The caller must forward all render-callback props and must not overwrite them with stale ARIA state. When React Hook Form/Zod owns inline validation, the form can use noValidate and handleSubmit as the development example does; native required/email semantics remain on the input. Client validation does not replace API validation.

## Preview and verification

Run pnpm dev and open /dev/components for the component reference. It is available in development whether API mocking is enabled or disabled. It demonstrates real local button actions, primary/secondary and busy/disabled states, semantic type sizes, read-only/disabled/error inputs, and React Hook Form/Zod error-to-success recovery. No data is submitted from this preview. /dev/foundation remains the separate transport/mock example.

Preview forms use the shared 32rem form maximum rather than stretching across the page. These maxima are layout tokens, not extra spacing scales. Preview sections use smaller token-based padding than editorial page sections. Select has a custom trigger and option popup; Checkbox uses a custom surface/check icon with native appearance restored in forced colours. Accordion uses a restrained divider, a compact rotating chevron and a neutral open surface.

The one development Playwright configuration is now playwright.dev.config.ts, run with pnpm test:e2e:dev. It covers the mock request plus component behaviour in all three engines on port 3000. Locally the suite reuses an existing dev server, which must have NEXT_PUBLIC_API_MOCKING=enabled for the mock request check; otherwise it starts one with that flag. CI starts a fresh server. Production regression checks use port 3200 so they can run alongside the normal app on port 3000. CI runs both suites. This replaces the narrower test:e2e:mocks command without maintaining duplicate configurations.

Unit tests cover semantic layout, refs, heading level, default/explicit submission, disabled/busy behaviour, input events and labels/descriptions/errors, recovery and class merging. Browser tests cover actual CSS colour/border/hover/active states, keyboard order and visible focus, label focus, React Hook Form ref integration, error recovery, reduced motion, all shared breakpoint edges, 48px targets, and long content at 200% text size. Production tests confirm both development references return 404.

Existing placeholder, loading, missing-page, recovery and mock-demo surfaces consume these primitives, so they are verified in real route composition. New features should reuse the same implementations instead of copying markup or classes. Header/navigation/footer are documented in [PUBLIC-SHELL.md](PUBLIC-SHELL.md); actual page designs still require approved editorial content and review.

References: [React refs](https://react.dev/reference/react/forwardRef), [form instructions](https://www.w3.org/WAI/tutorials/forms/instructions/) and [error identification](https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA21).

## Selection, feedback and overlays

- Select accepts options ({value, label, disabled}), placeholder, controlled value/onValueChange or defaultValue, name/required/disabled and native trigger props/ref (HTMLButtonElement). Values must be unique nonempty strings. Radix handles typeahead, keyboard navigation, focus, disabled options and native form value integration. The trigger and portal popup are custom Tailwind, with a checkmark for selection, a solid Denim highlighted row, and a muted disabled state. Use React Hook Form Controller: pass field.value, field.onChange as onValueChange, field.onBlur, field.name and field.ref; do not spread register onto a button trigger. FormField supplies its label/error wiring. Popups inside Dialog portal into that dialog to respect the top layer. Textarea keeps native props/ref and resize. Both consume the shared field surface.
- Checkbox accepts native input props/ref plus a required label. Its wrapping label supplies a 48px target, preserves native checked/defaultChecked/name/value/required/disabled semantics, and wraps long labels. For a group use a feature-owned fieldset/legend. Connect group help/errors through explicit IDs and aria-describedby/aria-invalid; do not wrap Checkbox in another label or FormField.
- Spinner exposes visible progress text through role=status. decorative hides it from assistive technology when a parent already supplies the label (as in Button). Reduced motion stops rotation. An explicit loadingLabel reserves space for both labels; ordinary buttons size to their content. Loading buttons show a spinner, retain their variant colour, expose aria-busy and block repeat activation; the feature decides when loading ends. The preview's Save example simulates a short local operation and writes no data.
- Alert defaults to informational role=status; tone=error uses role=alert, semantic danger text and a different icon. Include meaningful text; use assertive errors only for new, urgent feedback. Success copy may use the neutral informational surface without inventing a decorative colour.
- Accordion is one custom-styled native details/summary item; compose siblings. summary is required and must contain text, without nested interactive controls. Independent items may remain open together, preserving native keyboard and open/onToggle/ref behaviour without an accordion state provider. Do not set controlled open unless the feature also handles onToggle.
- Dialog is the single modal component: ui/dialog/dialog.tsx exports Dialog. Do not create a parallel Modal implementation or alias. It requires open, onOpenChange and a title; closeLabel labels the icon close button. Optional description is connected with aria-describedby; footer accepts feature-owned actions aligned at the trailing edge. The smaller heading, 48px icon target and compact content spacing preserve hierarchy without oversized controls. Pass returnFocusRef pointing at the trigger for consistent focus return after pointer activation in Safari, and keep that trigger mounted. It uses showModal/close, inert background and native focus return (or an explicit returnFocusRef), with explicit Tab/Shift+Tab boundary cycling. Escape and the visible close button request onOpenChange(false); the feature must update open. Backdrop clicks do not dismiss, avoiding accidental form loss. The title labels the dialog; provide aria-describedby only for a short meaningful description. Keep ordinary forms inside it; reserve native method=dialog for intentional native closing. Do not unmount the trigger while open. Dialog owns its native ref and lifecycle; it does not expose a competing open attribute or imperative ref API.

The default Dialog stays bounded by the shared 30rem maximum and page gutters. Its optional fullscreen variant supports the mobile navigation: it fills the dynamic viewport, keeps its heading/close button outside the scrolling body, locks/restores background overflow and slides in using the shared duration token. Reduced motion disables that entrance. Native summaries are included in its focus boundary handling so menu accordions remain reachable. No parallel modal, overlay provider or animation library is added. Verify long content and forms in context. Native behaviour follows the [MDN dialog reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog) and [details reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details).
