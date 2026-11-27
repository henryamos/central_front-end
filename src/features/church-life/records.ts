export type ChurchEvent = {
  id: string;
  title: string;
  /** Ghana calendar dates in YYYY-MM-DD format. */
  startDate: string;
  endDate?: string;
  publishedOn: string;
  location?: string;
};

export type EventView = "Upcoming" | "Latest" | "Past";

export const publishedEvents: readonly ChurchEvent[] = [];

export function eventsForView(
  events: readonly ChurchEvent[],
  view: EventView,
  today: string,
) {
  if (view === "Latest")
    return [...events].sort((a, b) =>
      b.publishedOn.localeCompare(a.publishedOn),
    );
  const upcoming = view === "Upcoming";
  return events
    .filter((event) => (event.endDate ?? event.startDate) >= today === upcoming)
    .sort((a, b) =>
      upcoming
        ? a.startDate.localeCompare(b.startDate)
        : (b.endDate ?? b.startDate).localeCompare(a.endDate ?? a.startDate),
    );
}

export type ChurchLeader = {
  id: string;
  name: string;
  role: string;
  team: string;
};
export const publishedLeaders: readonly ChurchLeader[] = [];
