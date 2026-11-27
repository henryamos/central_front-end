import { test, expect } from "@playwright/test";
test.setTimeout(60000);
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() =>
    sessionStorage.setItem("church-music-choice", "dismissed"),
  );
});
test("official branding follows the header surface and stays available on inner pages", async ({
  page,
}) => {
  // Multiple viewport changes and route visits need headroom on slower runners.
  test.setTimeout(180000);
  await page.goto("/");
  const svg = await page.request.get("/icons/CCC%20SDA%20logo.svg");
  expect(svg.ok()).toBe(true);
  expect(await svg.text()).not.toMatch(
    /<text\b|<image\b|font-family|xlink:href/,
  );
  const header = page.getByRole("banner");
  const denim = header.locator(".brand-logo-default");
  const white = header.locator(".brand-logo-inverse");
  const identity = header.getByRole("link", {
    name: "Cape Coast Central SDA home",
  });
  await expect(identity).toHaveText("");
  await expect(white).toBeVisible();
  await expect(denim).toBeHidden();
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(identity).toBeVisible();
    const displayed = width < 640 ? denim : white;
    await expect(displayed).toBeVisible();
    await expect(width < 640 ? white : denim).toBeHidden();
    await expect
      .poll(() =>
        displayed.evaluate((image) => (image as HTMLImageElement).naturalWidth),
      )
      .toBeGreaterThan(0);
    const image = await displayed.boundingBox();
    expect(image!.width / image!.height).toBeCloseTo(937.91 / 172.99, 1);
  }
  await page.getByRole("contentinfo").scrollIntoViewIfNeeded();
  await expect(denim).toBeVisible();
  await expect(white).toBeHidden();
  const footerLogo = page.getByRole("contentinfo").getByRole("img", {
    name: "Cape Coast Central Seventh-day Adventist Church",
    exact: true,
  });
  await expect(footerLogo).toBeVisible();
  await expect
    .poll(() =>
      footerLogo.evaluate((image) => (image as HTMLImageElement).naturalWidth),
    )
    .toBeGreaterThan(0);
  await page.goto("/about");
  await expect(denim).toBeVisible();
  await expect(white).toBeHidden();
  await identity.click();
  await expect(page).toHaveURL(/\/$/, { timeout: 20000 });
  await expect(white).toBeVisible();
});
test("public shell preserves shared gutters, touch targets and text reflow", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("banner")).toHaveCount(1);
  await expect(page.getByRole("main")).toHaveCount(1);
  await expect(page.getByRole("contentinfo")).toHaveCount(1);
  for (const width of [
    320, 375, 639, 640, 767, 768, 1023, 1024, 1279, 1280, 1440, 1920,
  ]) {
    await page.setViewportSize({ width, height: 900 });
    const frames = await page
      .locator(".site-container:visible")
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
      expect(frame.left).toBeCloseTo(frame.right, 1);
      expect(frame.width).toBeCloseTo(
        Math.min(
          frame.available - 2 * (width >= 1024 ? 32 : width >= 768 ? 24 : 16),
          1280,
        ),
        0,
      );
    }
    for (const box of await page
      .getByRole("banner")
      .locator("a:visible,button:visible,summary:visible")
      .evaluateAll((elements) =>
        elements.map((element) => {
          const rect = element.getBoundingClientRect();
          return { width: rect.width, height: rect.height };
        }),
      )) {
      expect(Math.round((box?.height ?? 0) * 100) / 100).toBeGreaterThanOrEqual(
        48,
      );
      expect(Math.round((box?.width ?? 0) * 100) / 100).toBeGreaterThanOrEqual(
        48,
      );
    }
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
    ).toBe(true);
  }
  for (const width of [320, 768, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(
      () => (document.documentElement.style.fontSize = "200%"),
    );
    const trigger = page.getByRole("button", { name: "Open navigation" });
    if (await trigger.isVisible()) await trigger.click();
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
    ).toBe(true);
    const close = page.getByRole("button", { name: "Close navigation" });
    if (await close.isVisible()) await close.click();
    await page.evaluate(() => (document.documentElement.style.fontSize = ""));
  }
  await expect(page.locator(".site-container .site-container")).toHaveCount(0);
});
test("mobile overlay covers content, locks scrolling and closes on Escape, routes and desktop resize", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const open = page.getByRole("button", { name: "Open navigation" });
  await open.focus();
  await page.keyboard.press("Enter");
  const close = page.getByRole("button", { name: "Close navigation" });
  const dialog = page.getByRole("dialog", { name: "Menu", exact: true });
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveCSS("animation-name", "navigation-enter");
  await expect(dialog).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
  await expect(
    page.locator("[data-header-row] button[aria-controls]"),
  ).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  const menuBox = await dialog.boundingBox();
  expect(menuBox!.x).toBeCloseTo(0, 0);
  expect(menuBox!.y).toBeCloseTo(0, 0);
  expect(menuBox!.width).toBe(375);
  expect(menuBox!.height).toBe(812);
  await expect(close).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  expect(
    await dialog.evaluate((element) =>
      element.contains(document.activeElement),
    ),
  ).toBe(true);
  await page.keyboard.press("Tab");
  await expect(close).toBeFocused();
  const nav = page.getByRole("navigation", {
    name: "Primary navigation",
    exact: true,
  });
  await expect(
    nav.getByRole("link", { name: "Plan a Visit", exact: true }),
  ).toBeInViewport();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  await expect(open).toBeFocused();
  await expect(open).toHaveAttribute("aria-expanded", "false");
  await open.click();
  await nav.locator("summary").filter({ hasText: "Ministries" }).click();
  await nav.getByRole("link", { name: "All ministries", exact: true }).click();
  await expect(page).toHaveURL(/\/ministries$/, { timeout: 20000 });
  await expect(open).toHaveAttribute("aria-expanded", "false");
  await open.click();
  await nav.locator("summary").filter({ hasText: "Ministries" }).click();
  await expect(
    nav.getByRole("link", { name: "All ministries", exact: true }),
  ).toHaveAttribute("href", "/ministries");
  await page.keyboard.press("Escape");
  await expect(open).toHaveAttribute("aria-expanded", "false");
  await page
    .locator("main")
    .evaluate((element) => element.scrollIntoView({ block: "end" }));
  const before = await page.evaluate(() => window.scrollY);
  const triggerBox = await open.boundingBox();
  await page.mouse.click(
    triggerBox!.x + triggerBox!.width / 2,
    triggerBox!.y + triggerBox!.height / 2,
  );
  await expect(dialog).toBeVisible();
  await expect(page.locator("body")).toHaveCSS("position", "fixed");
  await expect(page.locator("body")).toHaveCSS("top", `-${before}px`);
  const lockedScroll = await page.evaluate(() => window.scrollY);
  await page.mouse.move(180, 600);
  await page.mouse.wheel(0, 500);
  expect(await page.evaluate(() => window.scrollY)).toBe(lockedScroll);
  await close.click();
  await expect(open).toBeFocused();
  expect(await page.evaluate(() => window.scrollY)).toBe(before);
  await open.click();
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(
    page.getByRole("banner").locator("button[aria-controls]"),
  ).toHaveAttribute("aria-expanded", "false");
  await page.setViewportSize({ width: 375, height: 812 });
  await expect(open).toHaveAttribute("aria-expanded", "false");
});
test("desktop resources uses keyboard, dismisses cleanly and action links have pointer feedback", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const header = page.getByRole("banner"),
    details = header
      .locator("details[data-navigation-disclosure]")
      .filter({ hasText: "Explore resources" }),
    summary = details.locator("summary");
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(details).toHaveAttribute("open", "");
  await page.keyboard.press("ArrowDown");
  await expect(
    header.getByRole("link", { name: "Watch online", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(summary).toBeFocused();
  await expect(details).not.toHaveAttribute("open");
  await summary.click();
  await page.getByRole("main").getByRole("heading", { level: 1 }).click();
  await expect(details).not.toHaveAttribute("open");
  await summary.click();
  await header.getByRole("link", { name: "FAQs", exact: true }).click();
  await expect(page).toHaveURL(/\/faq$/, { timeout: 20000 });
  await expect(details).not.toHaveAttribute("open");
  const visit = header.getByRole("link", { name: "Donate", exact: true });
  await visit.hover();
  await expect
    .poll(() => visit.evaluate((e) => getComputedStyle(e).backgroundColor))
    .toBe("rgb(44, 78, 115)");
  await visit.click();
  await expect(page).toHaveURL(/\/give$/);
  await page
    .getByRole("contentinfo")
    .getByRole("link", { name: "Guest check-in", exact: true })
    .click();
  await expect(page).toHaveURL(/\/guest$/);
});
