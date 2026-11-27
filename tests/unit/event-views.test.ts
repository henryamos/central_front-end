import { expect, test } from "vitest";
import { eventsForView } from "../../src/features/church-life/records";
test("event views distinguish ongoing dates, finished events and publication order", () => {
  const events = [
    {
      id: "a",
      title: "A",
      startDate: "2026-11-20",
      endDate: "2026-11-27",
      publishedOn: "2026-10-01",
    },
    { id: "b", title: "B", startDate: "2026-11-10", publishedOn: "2026-11-20" },
    { id: "c", title: "C", startDate: "2026-12-01", publishedOn: "2026-11-15" },
  ];
  expect(
    eventsForView(events, "Upcoming", "2026-11-27").map((e) => e.id),
  ).toEqual(["a", "c"]);
  expect(
    eventsForView(events, "Latest", "2026-11-27").map((e) => e.id),
  ).toEqual(["b", "c", "a"]);
  expect(eventsForView(events, "Past", "2026-11-27").map((e) => e.id)).toEqual([
    "b",
  ]);
});
