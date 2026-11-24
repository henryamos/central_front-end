import { test, expect } from "@playwright/test";
test.setTimeout(60000);
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
    for (const element of await page
      .getByRole("banner")
      .locator("a:visible,button:visible,summary:visible")
      .all()) {
      const box = await element.boundingBox();
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
test("mobile navigation closes on Escape, route changes, outside actions and desktop resize", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const open = page.getByRole("button", { name: "Open navigation" });
  await open.focus();
  await page.keyboard.press("Enter");
  const close = page.getByRole("button", { name: "Close navigation" });
  await expect(close).toHaveAttribute("aria-expanded", "true");
  const nav = page.getByRole("navigation", {
    name: "Primary navigation",
    exact: true,
  });
  await expect(
    nav.getByRole("link", { name: "Plan a Visit", exact: true }),
  ).toBeInViewport();
  await page.keyboard.press("Escape");
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
  await page.mouse.click(360, 800);
  await expect(open).toHaveAttribute("aria-expanded", "false");
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
