import { expect, it } from "vitest";
import { parseEnv } from "@/config/env";
it("defaults mocking off and requires an explicit development opt-in", () => {
  expect(parseEnv({ NODE_ENV: "development" })).toEqual({
    mockingEnabled: false,
  });
  expect(
    parseEnv({ NODE_ENV: "development", NEXT_PUBLIC_API_MOCKING: "enabled" }),
  ).toEqual({ mockingEnabled: true });
  expect(
    parseEnv({ NODE_ENV: "production", NEXT_PUBLIC_API_MOCKING: "disabled" }),
  ).toEqual({ mockingEnabled: false });
});
it.each([
  { NODE_ENV: "production", NEXT_PUBLIC_API_MOCKING: "enabled" },
  { NODE_ENV: "development", NEXT_PUBLIC_API_MOCKING: "true" },
  { NODE_ENV: "unknown", NEXT_PUBLIC_API_MOCKING: "disabled" },
])("rejects invalid configuration without echoing values", (values) => {
  expect(() => parseEnv(values)).toThrow("Invalid frontend environment.");
});
