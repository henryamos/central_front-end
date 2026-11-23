import { expect, it } from "vitest";
import { cn } from "@/lib/utils";
it("keeps custom title sizing when applying a text colour", () => {
  expect(cn("text-title", "text-primary")).toBe("text-title text-primary");
});
it("resolves intentional type and leading overrides", () => {
  expect(cn("text-title leading-heading", "text-lg leading-ui")).toBe(
    "text-lg leading-ui",
  );
});
it("combines conditional classes without losing base layout", () => {
  expect(cn("grid", false, { "gap-6": true }, "gap-4")).toBe("grid gap-4");
});
