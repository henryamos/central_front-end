import { test, expect } from "@playwright/test";

function contrast(a: number[], b: number[]) {
  const luminance = (rgb: number[]) =>
    rgb
      .map((channel) => {
        const value = channel / 255;
        return value <= 0.04045
          ? value / 12.92
          : ((value + 0.055) / 1.055) ** 2.4;
      })
      .reduce(
        (sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index],
        0,
      );
  const first = luminance(a),
    second = luminance(b);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

test("approved CSS and Tailwind tokens agree and utilities can override base headings", async ({
  page,
}) => {
  await page.goto("/");
  const result = await page.evaluate(async () => {
    await document.fonts.ready;
    const heading = document.createElement("h1");
    heading.className =
      "bg-primary text-background p-4 rounded-md font-semibold text-3xl leading-heading font-sans";
    heading.textContent = "Token check";
    document.body.append(heading);
    const style = getComputedStyle(heading),
      root = getComputedStyle(document.documentElement);
    const button = document.createElement("button");
    button.textContent = "+";
    document.body.append(button);
    const buttonRect = button.getBoundingClientRect();
    const values = {
      background: style.backgroundColor,
      color: style.color,
      padding: style.paddingTop,
      radius: style.borderRadius,
      size: style.fontSize,
      weight: style.fontWeight,
      leading: style.lineHeight,
      font: style.fontFamily,
      localFontLoaded: Array.from(document.fonts).some(
        (face) =>
          /dmsans/i.test(face.family) &&
          !/fallback/i.test(face.family) &&
          face.status === "loaded",
      ),
      unapprovedPalette: root.getPropertyValue("--color-blue-500"),
      unapprovedRadius: root.getPropertyValue("--radius-xl"),
      targetWidth: buttonRect.width,
      targetHeight: buttonRect.height,
    };
    heading.remove();
    button.remove();
    return values;
  });
  expect(result).toMatchObject({
    background: "rgb(47, 85, 127)",
    color: "rgb(255, 255, 255)",
    padding: "16px",
    radius: "8px",
    size: "32px",
    weight: "600",
    localFontLoaded: true,
    unapprovedPalette: "",
    unapprovedRadius: "",
  });
  expect(parseFloat(result.leading)).toBeCloseTo(36.8, 1);
  expect(result.font.toLowerCase()).toContain("dmsans");
  expect(result.targetWidth).toBeGreaterThanOrEqual(48);
  expect(result.targetHeight).toBeGreaterThanOrEqual(48);
});

test("semantic colour pairs meet contrast targets and motion respects preferences", async ({
  page,
}) => {
  await page.goto("/");
  const colours = await page.evaluate(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const context = canvas.getContext("2d")!;
    const probe = document.createElement("span");
    document.body.append(probe);
    const colours: Record<string, number[]> = {};
    for (const token of [
      "primary",
      "background",
      "surface-muted",
      "foreground",
      "muted-foreground",
      "primary-foreground",
      "primary-hover",
      "primary-active",
      "border-control",
      "danger",
    ]) {
      probe.style.color = "var(--color-" + token + ")";
      context.fillStyle = getComputedStyle(probe).color;
      context.fillRect(0, 0, 1, 1);
      colours[token] = Array.from(context.getImageData(0, 0, 1, 1).data).slice(
        0,
        3,
      );
    }
    probe.remove();
    return colours;
  });
  for (const surface of ["background", "surface-muted"]) {
    for (const foreground of [
      "foreground",
      "muted-foreground",
      "primary",
      "danger",
    ]) {
      expect(
        contrast(colours[foreground], colours[surface]),
        foreground + " on " + surface,
      ).toBeGreaterThanOrEqual(4.5);
    }
    expect(
      contrast(colours["border-control"], colours[surface]),
      "control boundary on " + surface,
    ).toBeGreaterThanOrEqual(3);
  }
  for (const state of ["primary", "primary-hover", "primary-active"]) {
    expect(
      contrast(colours["primary-foreground"], colours[state]),
      "white on " + state,
    ).toBeGreaterThanOrEqual(4.5);
  }
  const readDurations = () =>
    page.evaluate(() => {
      const probe = document.createElement("div");
      probe.style.transitionDuration =
        "var(--duration-fast), var(--duration-normal)";
      document.body.append(probe);
      const durations = getComputedStyle(probe)
        .transitionDuration.split(",")
        .map(
          (value) =>
            parseFloat(value) * (value.trim().endsWith("ms") ? 1 : 1000),
        );
      probe.remove();
      return durations;
    });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  expect(await readDurations()).toEqual([150, 250]);
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(await readDurations()).toEqual([0, 0]);
});

test("layout honours breakpoint edges, text enlargement and long content", async ({
  page,
}) => {
  await page.goto("/about");
  // Exercise percentage-based layout with a real vertical scrollbar too.
  await page.evaluate(() => {
    const spacer = document.createElement("div");
    spacer.style.minHeight = "200vh";
    document.body.append(spacer);
  });
  const measurements: {
    viewport: number;
    available: number;
    left: number;
    right: number;
    content: number;
  }[] = [];
  for (const width of [
    320, 375, 639, 640, 767, 768, 1023, 1024, 1279, 1280, 1440, 1920,
  ]) {
    await page.setViewportSize({ width, height: 900 });
    const layout = await page
      .getByRole("main")
      .locator(".site-container")
      .first()
      .evaluate((element) => {
        const rect = element.getBoundingClientRect(),
          style = getComputedStyle(element),
          sectionStyle = getComputedStyle(
            element.closest(".section") ?? element,
          );
        return {
          width: rect.width,
          left: rect.left,
          right: document.documentElement.clientWidth - rect.right,
          available: document.documentElement.clientWidth,
          contentLeft: rect.left + parseFloat(style.paddingLeft),
          contentRight:
            document.documentElement.clientWidth -
            rect.right +
            parseFloat(style.paddingRight),
          sectionSpace: parseFloat(sectionStyle.paddingTop),
          overflow:
            document.documentElement.scrollWidth >
            document.documentElement.clientWidth,
        };
      });
    const gutter = width >= 1024 ? 32 : width >= 768 ? 24 : 16,
      sectionSpace = width >= 1024 ? 96 : width >= 768 ? 64 : 48;
    const expectedWidth = Math.min(layout.available - gutter * 2, 1280);
    expect(layout.width, "content width at " + width).toBeCloseTo(
      expectedWidth,
      0,
    );
    expect(layout.left, "centering at " + width).toBeCloseTo(
      (layout.available - expectedWidth) / 2,
      0,
    );
    expect(layout.right, "equal left/right edges at " + width).toBeCloseTo(
      layout.left,
      1,
    );
    expect(
      layout.contentLeft,
      "no doubled left gutter at " + width,
    ).toBeCloseTo(layout.left, 1);
    expect(
      layout.contentRight,
      "no doubled right gutter at " + width,
    ).toBeCloseTo(layout.right, 1);
    measurements.push({
      viewport: width,
      available: layout.available,
      left: layout.left,
      right: layout.right,
      content: layout.width,
    });
    expect(layout.sectionSpace, "section rhythm at " + width).toBe(
      sectionSpace,
    );
    expect(layout.overflow, "horizontal overflow at " + width).toBe(false);
  }
  await test.info().attach("container-measurements", {
    body: JSON.stringify(measurements, null, 2),
    contentType: "application/json",
  });
  await page.setViewportSize({ width: 320, height: 900 });
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
    document.querySelector("h1")!.textContent = "Community".repeat(20);
  });
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth,
    ),
  ).toBe(true);
  expect(
    await page.evaluate(() =>
      parseFloat(getComputedStyle(document.body).fontSize),
    ),
  ).toBe(32);
});
