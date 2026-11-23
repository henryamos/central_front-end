import { test, expect } from "@playwright/test";
const routes = [
  "/",
  "/about",
  "/about/beliefs",
  "/about/leadership",
  "/about/history",
  "/ministries",
  "/sermons",
  "/events",
  "/visit",
  "/guest",
  "/watch",
  "/give",
  "/gallery",
  "/blog",
  "/news",
  "/faq",
  "/contact",
];
test("public routes have one main landmark and no horizontal overflow", async ({
  page,
}) => {
  for (const route of routes) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await expect(page.getByRole("main")).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      route,
    ).toBe(true);
  }
});
test("skip link supports keyboard navigation", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
});
