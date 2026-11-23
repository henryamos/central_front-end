export const sermonKeys = {
  all: ["sermons"] as const,
  lists: () => [...sermonKeys.all, "list"] as const,
  detail: (slug: string) => [...sermonKeys.all, "detail", slug] as const,
};
