import { test, expect } from "@playwright/test";
import { homeSlides } from "../../src/features/home/constants/home.constants";
test.setTimeout(90000);
const carouselSelector = 'section[aria-roledescription="carousel"]';

test("phone layouts keep navigation, hero controls and section actions compact and reachable", async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 375, 390, 430]) {
    await page.setViewportSize({ width, height: width === 320 ? 740 : 844 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const header = page.getByRole("banner");
    await expect(header).toHaveCSS("background-color", "rgb(255, 255, 255)");
    const row = header.locator("[data-header-row]");
    expect((await row.boundingBox())!.height).toBeLessThanOrEqual(80);
    await expect(
      header.getByRole("link", { name: "Cape Coast Central SDA home" }),
    ).toContainText("Central SDA");
    await expect(
      header.getByRole("link", { name: "Donate", exact: true }),
    ).toHaveCount(0);
    const carousel = page.locator(carouselSelector);
    await expect(carousel.locator("[data-hero-shade]")).toHaveCSS(
      "background-image",
      "none",
    );
    await expect(carousel.locator("[data-hero-shade]")).toHaveCSS(
      "background-color",
      "rgba(23, 23, 23, 0.6)",
    );
    await expect(
      carousel.locator('[aria-label="Choose a photograph"]'),
    ).toBeHidden();
    const heroControls = carousel.locator("[data-hero-controls]");
    const visit = await carousel
      .getByRole("link", { name: "Plan a Visit", exact: true })
      .boundingBox();
    const watch = await carousel
      .getByRole("link", { name: "Watch online", exact: true })
      .boundingBox();
    expect(watch!.y).toBeGreaterThanOrEqual(visit!.y + visit!.height + 11);
    expect(watch!.x).toBeCloseTo(visit!.x, 0);
    expect(watch!.width).toBeCloseTo(visit!.width, 0);
    expect((await heroControls.boundingBox())!.height).toBeLessThanOrEqual(49);
    await carousel
      .getByRole("button", { name: "Next photograph", exact: true })
      .click();
    await expect(
      carousel.locator('[aria-roledescription="slide"]'),
    ).toHaveAttribute("aria-label", "Photo 2 of " + homeSlides.length);
    await carousel
      .getByRole("button", { name: "Previous photograph", exact: true })
      .click();
    await expect(
      carousel.locator('[aria-roledescription="slide"]'),
    ).toHaveAttribute("aria-label", "Photo 1 of " + homeSlides.length);
    if (width === 320 || width === 390)
      await page.screenshot({
        path: testInfo.outputPath(`phone-${width}-hero.png`),
      });
    await header.getByRole("button", { name: "Open navigation" }).click();
    await expect(
      page
        .getByRole("dialog", { name: "Menu", exact: true })
        .getByRole("navigation", { name: "Primary navigation", exact: true })
        .getByRole("link", { name: "Donate", exact: true }),
    ).toBeVisible();
    if (width === 320 || width === 390)
      await page.screenshot({
        path: testInfo.outputPath(`phone-${width}-menu.png`),
      });
    await page.keyboard.press("Escape");
    const weekly = page.locator("[data-sabbath-panel]");
    await weekly.scrollIntoViewIfNeeded();
    const inPerson = await weekly
      .getByRole("tab", { name: "In person", exact: true })
      .boundingBox();
    const viewAll = await weekly
      .getByRole("button", { name: "View all gatherings", exact: true })
      .boundingBox();
    expect(Math.abs(inPerson!.y - viewAll!.y)).toBeLessThanOrEqual(1);
    const guest = await weekly
      .getByRole("link", { name: "Guest check-in", exact: true })
      .boundingBox();
    const contact = await weekly
      .getByRole("link", { name: "Contact the information desk", exact: true })
      .boundingBox();
    expect(guest!.y).toBeCloseTo(contact!.y, 0);
    if (width === 320 || width === 390)
      await weekly.screenshot({
        path: testInfo.outputPath(`phone-${width}-weekly.png`),
      });
    const church = page.locator('section[aria-labelledby="church-title"]');
    await church.getByRole("tab", { name: "Leadership", exact: true }).click();
    await expect(
      church.getByRole("link", { name: "Meet our leadership", exact: true }),
    ).toBeVisible();
    if (width === 320 || width === 390)
      await church.screenshot({
        path: testInfo.outputPath(`phone-${width}-church.png`),
      });
    for (const section of [weekly, church]) {
      for (const control of await section
        .locator("a:visible,button:visible")
        .all()) {
        const box = await control.boundingBox();
        expect(box!.width).toBeGreaterThanOrEqual(48);
        expect(box!.height).toBeGreaterThanOrEqual(48);
      }
    }
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
    ).toBe(true);
  }
});

test("phone slideshow advances using its visible seven-second counter timeline", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await waitForPhoto(page);
  const carousel = page.locator(carouselSelector);
  const progress = carousel.locator(
    'circle[class*="animate-carousel-progress"]:visible',
  );
  await expect(progress).toHaveCSS("animation-duration", "7s");
  const initial = await carousel
    .locator('[aria-roledescription="slide"]')
    .getAttribute("aria-label");
  await expect(
    carousel.locator('[aria-roledescription="slide"]'),
  ).not.toHaveAttribute("aria-label", initial!, { timeout: 12000 });
});
test("church discovery uses a full background and accessible animated tabs across screen sizes", async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const section = page.locator('section[aria-labelledby="church-title"]');
  await expect(section.locator("h2")).toHaveCount(1);
  await expect(
    section.getByRole("link", { name: "About our church", exact: true }),
  ).toHaveAttribute("href", "/about");
  for (const [tab, label, href] of [
    ["History", "Explore our history", "/about/history"],
    ["Beliefs", "Explore our beliefs", "/about/beliefs"],
    ["Leadership", "Meet our leadership", "/about/leadership"],
  ] as const) {
    const trigger = section.getByRole("tab", { name: tab, exact: true });
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-selected", "true");
    const panel = section.getByRole("tabpanel", { name: tab, exact: true });
    await expect(panel).toBeVisible();
    await expect(panel).toHaveCSS("animation-name", "none");
    await expect(
      panel.getByRole("link", { name: label, exact: true }),
    ).toHaveAttribute("href", href);
    await expect(trigger).toHaveAttribute(
      "aria-controls",
      (await panel.getAttribute("id")) ?? "",
    );
  }
  const historyTab = section.getByRole("tab", { name: "History", exact: true });
  await historyTab.focus();
  await page.keyboard.press("ArrowLeft");
  await expect(
    section.getByRole("tab", { name: "Leadership", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Home");
  await expect(historyTab).toBeFocused();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await section.getByRole("tab", { name: "Beliefs", exact: true }).click();
  await expect(
    section.getByRole("tabpanel", { name: "Beliefs", exact: true }),
  ).toHaveCSS("animation-name", "church-panel-enter");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await historyTab.click();
  const photo = section.locator("[data-church-background] img");
  await section.scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      photo.evaluate((image) => (image as HTMLImageElement).naturalWidth),
    )
    .toBeGreaterThan(0);
  for (const width of [320, 640, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
    ).toBe(true);
    for (const control of await section
      .locator("a:visible,button:visible")
      .all()) {
      const rect = await control.boundingBox();
      expect(rect!.height).toBeGreaterThanOrEqual(48);
      expect(rect!.width).toBeGreaterThanOrEqual(48);
    }
    const image = await photo.boundingBox();
    expect(image!.x).toBeCloseTo(0, 0);
    expect(image!.width).toBe(
      await page.evaluate(() => document.documentElement.clientWidth),
    );
  }
  await section.screenshot({ path: testInfo.outputPath("church-desktop.png") });
  await page.setViewportSize({ width: 320, height: 1000 });
  await section.screenshot({ path: testInfo.outputPath("church-mobile.png") });
  await page.evaluate(() => (document.documentElement.style.fontSize = "200%"));
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth,
    ),
  ).toBe(true);
  await page.evaluate(() => (document.documentElement.style.fontSize = ""));
  const history = section.getByRole("link", {
    name: "Explore our history",
    exact: true,
  });
  await history.focus();
  await expect(history).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/about\/history$/);
});

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
    'circle[class*="animate-carousel-progress"]:visible',
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
    "rgb(255, 255, 255)",
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
  await expect(action.locator("..")).toHaveCSS(
    "transform",
    "matrix(1, 0, 0, 1, 0, 0)",
  );
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

test("weekly programme rotates incoming activities, pauses for reading and exposes the complete schedule", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 400 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const panel = page.locator("[data-sabbath-panel]");
  // Shorten only the reading interval so interaction checks do not need long sleeps.
  await panel.evaluate((element) =>
    (element as HTMLElement).style.setProperty(
      "--duration-weekly-reading",
      "1200ms",
    ),
  );
  await panel.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  await expect(panel.getByText("Midweek prayer", { exact: true })).toBeVisible({
    timeout: 10000,
  });
  await panel
    .locator('[data-weekly-reveal][aria-hidden="false"]')
    .first()
    .hover();
  await page.waitForTimeout(1600);
  await expect(
    panel.getByText("Midweek prayer", { exact: true }),
  ).toBeVisible();
  await panel.getByRole("button", { name: "Next gatherings" }).click();
  const flip = await panel
    .locator('[data-weekly-reveal][aria-hidden="false"] [data-weekly-roll]')
    .evaluateAll((items) =>
      items
        .flatMap((item) => item.getAnimations())
        .map((animation) => {
          const effect = animation.effect as KeyframeEffect;
          const timing = effect.getTiming();
          animation.pause();
          animation.currentTime = (timing.delay ?? 0) + 350;
          return {
            duration: Number(timing.duration),
            delay: timing.delay ?? 0,
            from: String(effect.getKeyframes()[0].transform),
          };
        }),
    );
  expect(flip).toHaveLength(4);
  expect(flip[0].duration).toBe(700);
  expect(flip[0].from).toContain("rotateX(-75deg)");
  expect(flip.every((item) => item.delay === 0)).toBe(true);
  await panel.screenshot({
    path: testInfo.outputPath("weekly-flip-midpoint.png"),
  });
  await panel
    .locator("[data-weekly-roll]")
    .evaluateAll((items) =>
      items
        .flatMap((item) => item.getAnimations())
        .forEach((animation) => animation.cancel()),
    );
  await expect(
    panel.getByText("Sabbath School", { exact: true }),
  ).toBeVisible();
  await expect(
    panel.getByRole("button", { name: "Resume weekly rotation" }),
  ).toBeVisible();
  await panel
    .getByRole("button", { name: "View all gatherings", exact: true })
    .click();
  await expect(
    panel.getByText("Sabbath School", { exact: true }),
  ).toBeVisible();
  await expect(
    panel.getByText("Midweek prayer", { exact: true }),
  ).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await panel
    .getByRole("button", { name: "Rotate gatherings", exact: true })
    .click();
  await expect(
    panel.getByRole("button", { name: "Resume weekly rotation" }),
  ).toBeDisabled();
  expect(
    await panel
      .locator("[data-weekly-roll]")
      .evaluateAll(
        (items) => items.flatMap((item) => item.getAnimations()).length,
      ),
  ).toBe(0);
});

test("Sabbath invitation preserves hierarchy, reachable actions and responsive gutters", async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const section = page.locator('section[aria-labelledby="sabbath-title"]');
  await section.scrollIntoViewIfNeeded();
  expect(
    await section.evaluate(
      (element) => element.getAnimations({ subtree: true }).length,
    ),
  ).toBe(0);
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
  await expect(section.locator("img")).toHaveCount(0);
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
  await page.setViewportSize({ width: 1440, height: 1000 });
  await section
    .locator("[data-sabbath-panel]")
    .screenshot({ path: testInfo.outputPath("weekly-desktop.png") });
  await page.setViewportSize({ width: 320, height: 900 });
  await section
    .locator("[data-sabbath-panel]")
    .screenshot({ path: testInfo.outputPath("weekly-mobile.png") });
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
