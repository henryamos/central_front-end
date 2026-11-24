import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";
// Register the actual custom type/leading tokens so text colour never removes text size.
const merge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["title", "display", "hero-lead"] }],
      tracking: [{ tracking: ["normal", "tight", "display"] }],
      leading: [{ leading: ["body", "ui", "heading", "display"] }],
    },
  },
});
export function cn(...inputs: ClassValue[]) {
  return merge(clsx(inputs));
}
