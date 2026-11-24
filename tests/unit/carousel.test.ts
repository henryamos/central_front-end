import { it, expect } from "vitest";
import { existsSync } from "node:fs";
import { homeSlides } from "@/features/home/constants/home.constants";
it("uses existing unique photographs and replaces the final portrait with Chilion", () => {
  const sources = homeSlides.map((slide) => slide.src);
  expect(sources.every((src) => existsSync("public" + src))).toBe(true);
  expect(new Set(sources).size).toBe(sources.length);
  expect(sources.at(-1)).toBe("/images/Chilion.jpg");
  expect(sources).not.toContain("/images/Member.jpeg");
  for (const name of ["Boys.jpg", "New.jpg", "dance1.jpg", "dance2.jpg"])
    expect(sources).toContain("/images/" + name);
});
