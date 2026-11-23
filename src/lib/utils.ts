import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";
// Register the actual custom type/leading tokens so text colour never removes text size.
const merge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["title"] }],
      leading: [{ leading: ["body", "ui", "heading"] }],
    },
  },
});
export function cn(...inputs: ClassValue[]) {
  return merge(clsx(inputs));
}
