import { test, expect } from "@playwright/test";
import { homeSlides } from "../../src/features/home/constants/home.constants";
test.setTimeout(90000);
const carouselSelector = 'section[aria-roledescription="carousel"]';
async function waitForPhoto(page: import("@playwright/test").Page) {
  const photo = page.locator(
    carouselSelector + ' [aria-roledescription="slide"] img',
  );
  await expect
    .poll(
      () =>
        photo.evaluate(
          (image) =>
            (image as HTMLImageElement).complete &&
            (image as HTMLImageElement).naturalWidth > 0,
        ),
      { timeout: 30000 },
    )
    .toBe(true);
  await expect(photo).toHaveCSS("opacity", "1");
  await expect(
    page.locator(carouselSelector + ' [aria-roledescription="slide"]'),
  ).toHaveAttribute("aria-busy", "false");
}
test("homepage uses real content and selected photographs with stable manual controls", async ({
  page,
  browserName,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const carousel = page.locator(carouselSelector);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    /Cape Coast.*Central SDA/,
  );
  await expect(
    page.getByText("Content is not available yet.", { exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByText("Starting development mocks...", { exact: true }),
  ).toHaveCount(0);
  await expect(
    carousel.getByText("Seventh-day Adventist Church", { exact: true }),
  ).toHaveCount(0);
  await expect(
    carousel.getByRole("button", { name: "Slideshow paused", exact: true }),
  ).toBeDisabled();
  const controls = carousel.getByRole("group", { name: "Choose a photograph" });
  await expect(controls.getByRole("button")).toHaveCount(homeSlides.length);
  const indices =
    browserName === "chromium"
      ? homeSlides.map((_, index) => index)
      : [0, homeSlides.length - 1];
  for (const index of indices) {
    const control = controls.getByRole("button", {
      name: "Show photograph " + (index + 1) + " of " + homeSlides.length,
      exact: true,
    });
    await control.click();
    await expect(control).toHaveAttribute("aria-current", "true");
    await expect(
      carousel.locator('[aria-roledescription="slide"]'),
    ).toHaveAttribute(
      "aria-label",
      "Photo " + (index + 1) + " of " + homeSlides.length,
    );
    await waitForPhoto(page);
  }
  await expect(
    carousel.getByRole("link", { name: "Plan a Visit", exact: true }),
  ).toHaveAttribute("href", "/visit");
  await expect(
    carousel.getByRole("link", { name: "Watch online", exact: true }),
  ).toHaveAttribute("href", "/watch");
});
test("photo rotation and progress share a real seven-second timeline and pause without shaking", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await waitForPhoto(page);
  const carousel = page.locator(carouselSelector),
    rotation = carousel.locator("[data-rotation-control]");
  await rotation.click();
  await expect(rotation).toHaveAttribute("aria-label", "Resume slideshow");
  const first = await carousel
    .locator('[aria-roledescription="slide"]')
    .getAttribute("aria-label");
  const progress = carousel.locator(
    'circle[class*="animate-carousel-progress"]',
  );
  await expect(progress).toHaveCSS("animation-duration", "7s");
  await expect(progress).toHaveCSS("animation-play-state", "paused");
  await page.waitForTimeout(1000);
  await expect(
    carousel.locator('[aria-roledescription="slide"]'),
  ).toHaveAttribute("aria-label", first!);
  await rotation.click();
  await expect(rotation).toHaveAttribute("aria-label", "Pause slideshow");
  await page.mouse.move(0, 0);
  await expect(progress).toHaveCSS("animation-play-state", "running");
  await expect(
    carousel.locator('[aria-roledescription="slide"]'),
  ).not.toHaveAttribute("aria-label", first!, { timeout: 12000 });
  await waitForPhoto(page);
  await rotation.click();
  await expect(rotation).toHaveAttribute("aria-label", "Resume slideshow");
  const stable = await carousel
    .locator('[aria-roledescription="slide"]')
    .getAttribute("aria-label");
  await page.waitForTimeout(1000);
  await expect(
    carousel.locator('[aria-roledescription="slide"]'),
  ).toHaveAttribute("aria-label", stable!);
});
test("homepage colours, controls and typography reflow at narrow widths and enlarged text", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("banner")).toHaveCSS(
    "background-color",
    "rgba(0, 0, 0, 0)",
  );
  await expect(page.getByRole("contentinfo")).toHaveCSS(
    "background-color",
    "rgb(245, 245, 245)",
  );
  for (const width of [320, 375, 768, 1024, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
    ).toBe(true);
    for (const button of await page
      .locator(carouselSelector)
      .getByRole("button")
      .all()) {
      const box = await button.boundingBox();
      expect(Math.round((box?.width ?? 0) * 100) / 100).toBeGreaterThanOrEqual(
        48,
      );
      expect(Math.round((box?.height ?? 0) * 100) / 100).toBeGreaterThanOrEqual(
        48,
      );
    }
  }
  await page.setViewportSize({ width: 320, height: 900 });
  await page.evaluate(() => (document.documentElement.style.fontSize = "200%"));
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth,
    ),
  ).toBe(true);
});

test("hero phrase changes without shifting actions and header protects following sections", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const header = page.getByRole("banner");
  await expect(header).toHaveCSS("position", "sticky");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    /Central SDA$/,
  );
  const phrases = page.locator(".hero-phrase");
  await expect(phrases).toHaveCount(3);
  const action = page
    .locator('section[aria-roledescription="carousel"]')
    .getByRole("link", { name: "Plan a Visit", exact: true });
  await page.evaluate(() => document.fonts.ready);
  const before = await action.boundingBox();
  await page.waitForTimeout(4500);
  await expect(phrases.nth(1)).toHaveCSS("opacity", "1");
  expect((await action.boundingBox())?.y).toBeCloseTo(before!.y, 1);
  await page.locator("#sabbath-title").evaluate((e) => e.scrollIntoView());
  await expect(header).toBeInViewport();
  await expect(header).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await expect(header).toHaveCSS("backdrop-filter", "none");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(phrases.first()).toHaveCSS("animation-name", "none");
  await expect(phrases.nth(1)).toHaveCSS("visibility", "hidden");
});

test("Sabbath invitation preserves hierarchy, reachable actions and responsive gutters", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const section = page.locator('section[aria-labelledby="sabbath-title"]');
  await expect(
    section.getByRole("tab", { name: "In person", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  for (const [name, href] of [
    ["Plan a Visit", "/visit"],
    ["Contact the information desk", "/contact"],
    ["Guest check-in", "/guest"],
  ]) {
    await expect(
      section.getByRole("link", { name, exact: true }),
    ).toHaveAttribute("href", href);
  }
  await expect(section.locator("img")).toHaveAttribute(
    "alt",
    "People gathered together beside windows in a church hall.",
  );
  const overlap = await section.evaluate((e) => {
    const hero = document.querySelector(
      'section[aria-roledescription="carousel"]',
    )!;
    return hero.getBoundingClientRect().bottom - e.getBoundingClientRect().top;
  });
  expect(overlap).toBeGreaterThan(0);
  await section.getByRole("tab", { name: "Online", exact: true }).click();
  await expect(
    section.getByRole("link", { name: "Watch online", exact: true }),
  ).toHaveAttribute("href", "/watch");
  await section.getByRole("tab", { name: "In person", exact: true }).click();
  for (const width of [320, 375, 639, 640, 767, 768, 1023, 1024, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
    ).toBe(true);
    const frame = await section.locator(".site-container").evaluate((e) => {
      const r = e.getBoundingClientRect();
      return {
        left: r.left,
        right: document.documentElement.clientWidth - r.right,
      };
    });
    expect(frame.left).toBeCloseTo(frame.right, 1);
    for (const link of await section.getByRole("link").all()) {
      const rect = await link.boundingBox();
      expect(Math.round(rect!.height * 100) / 100).toBeGreaterThanOrEqual(48);
      expect(Math.round(rect!.width * 100) / 100).toBeGreaterThanOrEqual(48);
    }
  }
  await page.setViewportSize({ width: 320, height: 900 });
  await page.evaluate(() => (document.documentElement.style.fontSize = "200%"));
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth,
    ),
  ).toBe(true);
  await page.evaluate(() => (document.documentElement.style.fontSize = ""));
  const contact = section.getByRole("link", {
    name: "Contact the information desk",
    exact: true,
  });
  await contact.focus();
  await expect(contact).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/contact$/, { timeout: 20000 });
});
