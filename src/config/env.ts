import { z } from "zod";
const schema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]),
    NEXT_PUBLIC_API_MOCKING: z
      .enum(["enabled", "disabled"])
      .default("disabled"),
  })
  .refine(
    (value) =>
      value.NODE_ENV !== "production" ||
      value.NEXT_PUBLIC_API_MOCKING === "disabled",
    { message: "Mocking is development-only" },
  );
export function parseEnv(values: {
  NODE_ENV?: string;
  NEXT_PUBLIC_API_MOCKING?: string;
}) {
  const result = schema.safeParse(values);
  if (!result.success)
    throw new Error(
      "Invalid frontend environment. Check NODE_ENV and NEXT_PUBLIC_API_MOCKING; production mocking must be disabled.",
    );
  return {
    mockingEnabled:
      result.data.NODE_ENV === "development" &&
      result.data.NEXT_PUBLIC_API_MOCKING === "enabled",
  };
}
export const env = parseEnv({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_API_MOCKING: process.env.NEXT_PUBLIC_API_MOCKING,
});
