export type ChurchEvent = {
  id: string;
  title: string;
  /** Ghana calendar dates in YYYY-MM-DD format. */
  startDate: string;
  endDate?: string;
  publishedOn: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  registrationUrl?: string;
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
  leadershipLevel?:
    | "pastors"
    | "elders"
    | "church-board"
    | "school-board"
    | "departmental-heads";
  reportsToId?: string;
  biography?: string;
  portrait?: string;
};
export const publishedLeaders: readonly ChurchLeader[] = [];
