import { test, expect } from "@playwright/test";
test("development requests use the browser worker and local DM Sans", async ({
  page,
}) => {
  const response = page.waitForResponse((response) =>
    response.url().endsWith("/api/v1/_foundation/status"),
  );
  await page.goto("/dev/foundation");
  await expect(
    page.getByRole("heading", { name: "Infrastructure check" }),
  ).toBeVisible();
  await expect(page.getByText("Response source: MSW")).toBeVisible();
  const mockResponse = await response;
  expect(mockResponse.fromServiceWorker()).toBe(true);
  expect(await mockResponse.json()).toEqual({ source: "MSW", status: "ready" });
  const refresh = page.waitForResponse((response) =>
    response.url().endsWith("/api/v1/_foundation/status"),
  );
  await page.getByRole("button", { name: "Refresh request" }).click();
  expect((await refresh).fromServiceWorker()).toBe(true);
  const family = await page.evaluate(async () => {
    await document.fonts.ready;
    return getComputedStyle(document.body).fontFamily;
  });
  expect(family.toLowerCase()).toContain("dmsans");
});
