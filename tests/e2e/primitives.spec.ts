import { test, expect } from "@playwright/test";
const longAction =
  "An action with a longer label that must wrap on small screens";
test.beforeEach(async ({ page }) => {
  await page.goto("/dev/components");
  await expect(
    page.getByRole("heading", { name: "UI primitives", level: 1 }),
  ).toBeVisible();
});

test("native states, pointer feedback and typography use the approved tokens", async ({
  page,
  browserName,
}) => {
  const primary = page.getByRole("button", {
      name: "Primary action",
      exact: true,
    }),
    secondary = page.getByRole("button", {
      name: "Secondary action",
      exact: true,
    });
  expect(
    await primary.evaluate((element) => {
      const s = getComputedStyle(element),
        r = element.getBoundingClientRect();
      return {
        background: s.backgroundColor,
        color: s.color,
        border: s.borderTopWidth,
        width: r.width,
        height: r.height,
      };
    }),
  ).toMatchObject({
    background: "rgb(47, 85, 127)",
    color: "rgb(255, 255, 255)",
    border: "1px",
  });
  await primary.hover();
  await expect
    .poll(() =>
      primary.evaluate((element) => getComputedStyle(element).backgroundColor),
    )
    .toBe("rgb(44, 78, 115)");
  await page.mouse.down();
  await expect
    .poll(() =>
      primary.evaluate((element) => getComputedStyle(element).backgroundColor),
    )
    .toBe("rgb(41, 70, 102)");
  await page.mouse.up();
  expect(
    await secondary.evaluate(
      (element) => getComputedStyle(element).borderTopColor,
    ),
  ).toBe("rgb(47, 85, 127)");
  await expect(
    page.getByRole("button", { name: "Disabled action" }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Save example", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Saving?", exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Saving?", exact: true }),
  ).toHaveAttribute("aria-busy", "true");
  await expect(
    page.getByRole("button", { name: "Save example", exact: true }),
  ).toBeEnabled();
  await expect(
    page.getByRole("textbox", { name: "Disabled field" }),
  ).toBeDisabled();
  await expect(
    page.getByRole("textbox", { name: "Read-only field" }),
  ).toBeEnabled();
  await expect(
    page.getByRole("textbox", { name: "Read-only field" }),
  ).toHaveAttribute("readonly", "");
  const invalid = page.getByRole("textbox", { name: "Invalid state example" });
  await invalid.focus();
  expect(
    await invalid.evaluate(
      (element) => getComputedStyle(element).borderTopColor,
    ),
  ).toBe("rgb(180, 35, 24)");
  expect(
    await invalid.evaluate((element) => getComputedStyle(element).outlineStyle),
  ).toBe("none");
  expect(
    await invalid.evaluate((element) => getComputedStyle(element).boxShadow),
  ).toContain("inset");
  const heights = await Promise.all(
    ["Disabled field", "Read-only field", "Invalid state example"].map((name) =>
      page
        .getByRole("textbox", { name, exact: true })
        .evaluate((element) => element.getBoundingClientRect().height),
    ),
  );
  expect(Math.max(...heights) - Math.min(...heights)).toBeLessThan(1);
  expect(
    await page
      .getByRole("heading", { name: "UI primitives", exact: true })
      .evaluate((element) => getComputedStyle(element).fontWeight),
  ).toBe("900");
  const title = page.getByRole("heading", { name: "Typography", level: 2 });
  expect(
    await title.evaluate((element) => getComputedStyle(element).color),
  ).toBe("rgb(47, 85, 127)");
  expect(
    await title.evaluate((element) =>
      parseFloat(getComputedStyle(element).fontSize),
    ),
  ).toBeGreaterThanOrEqual(32);
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(
    await primary.evaluate((element) =>
      parseFloat(getComputedStyle(element).transitionDuration),
    ),
  ).toBe(0);
  if (browserName === "chromium") {
    await page.emulateMedia({ forcedColors: "active" });
    await page.keyboard.press("Tab");
    await primary.focus();
    const outline = await primary.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        style: style.outlineStyle,
        width: parseFloat(style.outlineWidth),
        color: style.outlineColor,
      };
    });
    expect(outline.style).not.toBe("none");
    expect(outline.width).toBeGreaterThanOrEqual(2);
    expect(outline.color).not.toBe("rgba(0, 0, 0, 0)");
  }
});

test("keyboard actions, label focus and validation recover without an API write", async ({
  page,
}) => {
  const writes: string[] = [];
  page.on("request", (request) => {
    if (
      request.method() !== "GET" &&
      new URL(request.url()).pathname.startsWith("/api/")
    )
      writes.push(request.url());
  });
  const primary = page.getByRole("button", {
    name: "Primary action",
    exact: true,
  });
  // The app shell's skip link is covered in production; start this control test in keyboard mode.
  await page.keyboard.press("Tab");
  await primary.focus();
  await expect(primary).toBeFocused();
  expect(
    await primary.evaluate((element) => getComputedStyle(element).boxShadow),
  ).toMatch(/inset/);
  expect(
    await primary.evaluate((element) => getComputedStyle(element).boxShadow),
  ).toMatch(/2px/);
  await page.keyboard.press("Space");
  await expect(
    page.getByText("Action count: 1", { exact: true }),
  ).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Secondary action", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(
    page.getByText("Action count: 2", { exact: true }),
  ).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Save example", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: longAction, exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  const name = page.getByRole("textbox", { name: "Display name", exact: true });
  await expect(name).toBeFocused();
  await page.getByRole("button", { name: "Validate example" }).click();
  await expect(name).toBeFocused();
  await expect(name).toHaveAttribute("aria-invalid", "true");
  await expect(name).toHaveAttribute(
    "aria-describedby",
    "preview-name-description preview-name-error",
  );
  await expect(
    page.getByText("Error: Enter at least two characters.", { exact: true }),
  ).toBeVisible();
  await page.locator('label[for="preview-name"]').click();
  await expect(name).toBeFocused();
  await name.fill("Test User");
  await page
    .getByRole("textbox", { name: "Email", exact: true })
    .fill("reader@example.invalid");
  await page.getByRole("button", { name: "Validate example" }).click();
  await expect(
    page.getByText("Local validation passed. No data was sent.", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(name).not.toHaveAttribute("aria-invalid");
  expect(writes).toEqual([]);
});

test("real primitives preserve gutters, targets and wrapping across widths and enlarged text", async ({
  page,
}) => {
  for (const width of [
    320, 375, 639, 640, 767, 768, 1023, 1024, 1279, 1280, 1440, 1920,
  ]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(page.locator(".site-container .site-container")).toHaveCount(
      0,
    );
    const frames = await page
      .locator(".site-container")
      .evaluateAll((elements) =>
        elements.map((element) => {
          const r = element.getBoundingClientRect();
          return {
            left: r.left,
            right: document.documentElement.clientWidth - r.right,
            width: r.width,
            available: document.documentElement.clientWidth,
          };
        }),
      );
    for (const frame of frames) {
      const gutter = width >= 1024 ? 32 : width >= 768 ? 24 : 16,
        expected = Math.min(frame.available - 2 * gutter, 1280);
      expect(frame.width, "content at " + width).toBeCloseTo(expected, 0);
      expect(frame.left, "symmetric edges at " + width).toBeCloseTo(
        frame.right,
        1,
      );
    }
    const controls = await page
      .getByRole("main")
      .locator(
        "button:visible,input:not([type=checkbox]):visible,select:visible:not([aria-hidden=true]),textarea:visible,summary:visible,label:has(input[type=checkbox])",
      )
      .evaluateAll((elements) =>
        elements.map((element) => {
          const r = element.getBoundingClientRect();
          return {
            width: r.width,
            height: r.height,
            size: parseFloat(getComputedStyle(element).fontSize),
          };
        }),
      );
    for (const control of controls) {
      expect(control.width).toBeGreaterThanOrEqual(48);
      expect(control.height).toBeGreaterThanOrEqual(48);
      expect(control.size).toBeGreaterThanOrEqual(16);
    }
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
      "overflow at " + width,
    ).toBe(true);
  }
  await page.setViewportSize({ width: 320, height: 900 });
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
    document.querySelector("h1")!.textContent = "Community".repeat(20);
  });
  await page
    .getByRole("textbox", { name: "Display name", exact: true })
    .fill("Long value ".repeat(30));
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth,
    ),
  ).toBe(true);
});

test("native selection, disclosure and dialog behave with keyboard and narrow layouts", async ({
  page,
}) => {
  const checkbox = page.getByRole("checkbox", {
    name: "Example preference",
    exact: true,
  });
  await page.getByText("Example preference", { exact: true }).click();
  await expect(checkbox).toBeChecked();
  await checkbox.focus();
  await page.keyboard.press("Space");
  await expect(checkbox).not.toBeChecked();
  await expect(
    page.getByRole("checkbox", { name: "Unavailable preference" }),
  ).toBeDisabled();
  const select = page.getByRole("combobox", { name: "Example category" });
  await select.click();
  await page.getByRole("option", { name: "General", exact: true }).click();
  await expect(select).toHaveText("General");
  await select.focus();
  await page.keyboard.press("ArrowDown");
  await expect(
    page.getByRole("option", { name: "Unavailable" }),
  ).toHaveAttribute("aria-disabled", "true");
  await page.keyboard.press("o");
  await page.keyboard.press("Enter");
  await expect(select).toHaveText("Other");
  expect(
    await page
      .getByRole("form", { name: "Selection example" })
      .evaluate((element) =>
        new FormData(element as HTMLFormElement).get("category"),
      ),
  ).toBe("other");
  await select.click();
  await page.keyboard.press("Escape");
  await expect(select).toBeFocused();
  await page
    .getByRole("textbox", { name: "Example message" })
    .fill("Synthetic message");
  const summary = page.locator("summary").first();
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByText("Use Enter or Space to expand this native disclosure."),
  ).toBeVisible();
  await page.keyboard.press("Space");
  await expect(
    page.getByText("Use Enter or Space to expand this native disclosure."),
  ).not.toBeVisible();
  const trigger = page.getByRole("button", { name: "Open example dialog" });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Example dialog" });
  await expect(dialog).toBeVisible();
  const close = dialog.getByRole("button", { name: "Close dialog" });
  await expect(close).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(dialog.getByRole("button", { name: "Done" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(close).toBeFocused();
  const dialogSelect = dialog.getByRole("combobox", {
    name: "Dialog category",
  });
  await dialogSelect.click();
  await page.getByRole("option", { name: "Other", exact: true }).click();
  await expect(dialogSelect).toHaveText("Other");
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await close.click();
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await page.setViewportSize({ width: 320, height: 600 });
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
  });
  await trigger.click();
  await expect(dialog).toBeVisible();
  const geometry = await dialog.evaluate((element) => {
    const r = element.getBoundingClientRect();
    return {
      left: r.left,
      right: r.right,
      available: document.documentElement.clientWidth,
      overflow: element.scrollWidth > element.clientWidth,
    };
  });
  expect(geometry.left).toBeGreaterThanOrEqual(16);
  expect(geometry.right).toBeLessThanOrEqual(geometry.available - 16);
  expect(geometry.overflow).toBe(false);
  await close.click();
  await expect(dialog).not.toBeVisible();
});
