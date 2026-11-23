import { z } from "zod";
// Synthetic infrastructure contract, not a church/backend endpoint.
export const foundationStatusSchema = z.object({
  source: z.literal("MSW"),
  status: z.literal("ready"),
});
export const foundationStatus: z.infer<typeof foundationStatusSchema> = {
  source: "MSW",
  status: "ready",
};
