import { it, expect } from "vitest";
import { isCurrentSection } from "@/components/layout/navigation/navigation";
it("matches route segments without selecting similarly prefixed routes", () => {
  expect(isCurrentSection("/about/history", "/about")).toBe(true);
  expect(isCurrentSection("/aboutness", "/about")).toBe(false);
  expect(isCurrentSection("/ministries", "/")).toBe(false);
  expect(isCurrentSection("/", "/")).toBe(true);
});
