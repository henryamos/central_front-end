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
  "/bulletins",
  "/ministries/music",
  "/ministries/church-choir",
  "/news",
  "/faq",
  "/contact",
];
test("public routes have one main landmark and no horizontal overflow", async ({
  page,
}) => {
  test.setTimeout(60000);
  for (const route of routes) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await expect(page.getByRole("main")).toHaveCount(1);
    await expect(
      page.locator(".site-container .site-container"),
      "Nested page gutters at " + route,
    ).toHaveCount(0);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
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

test("public church journeys connect schedules, music groups and gallery filters", async ({
  page,
}) => {
  await page.goto("/visit");
  await expect(
    page.getByRole("main").getByText("Sabbath School", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("main")
    .getByRole("link", { name: "Guest check-in" })
    .click();
  await expect(
    page.getByRole("button", { name: "Check in", exact: true }),
  ).toBeDisabled();
  await page.goto("/ministries/music");
  await page
    .getByRole("main")
    .getByRole("link", { name: "Youth Choir" })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Youth Choir",
  );
  await page.goto("/gallery");
  await page.getByRole("button", { name: "Church building" }).click();
  await expect(page.getByRole("main").getByRole("img")).toHaveCount(1);
  await page.goto("/faq");
  await page.getByText("When is midweek prayer?", { exact: true }).click();
  await expect(
    page.getByText(/Midweek prayer meets on Wednesday/),
  ).toBeVisible();
});
