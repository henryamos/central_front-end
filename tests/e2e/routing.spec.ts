import { test, expect } from "@playwright/test";

test("unknown records and routes return 404", async ({ request }) => {
  for (const route of [
    "/unknown",
    "/dev/foundation",
    "/api/v1/_foundation/status",
    "/sermons/missing",
    "/ministries/missing",
    "/events/missing",
  ]) {
    expect((await request.get(route)).status(), route).toBe(404);
  }
});
test("scaffold is excluded from crawling", async ({ request }) => {
  const response = await request.get("/robots.txt");
  expect(response.status()).toBe(200);
  expect(await response.text()).toContain("Disallow: /");
});
