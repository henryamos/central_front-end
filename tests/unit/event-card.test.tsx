// @vitest-environment jsdom
import "../setup";
import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { EventCard } from "@/features/church-life/event-card";
it("shows supplied multi-day event details and links to the record", () => {
  render(
    <EventCard
      event={{
        id: "example",
        title: "Example gathering",
        startDate: "2026-12-01",
        endDate: "2026-12-02",
        publishedOn: "2026-11-28",
        location: "Example venue",
      }}
    />,
  );
  expect(screen.getByText("Example venue")).toBeVisible();
  expect(screen.getByText("1 December 2026 to 2 December 2026")).toBeVisible();
  expect(
    screen.getByRole("link", { name: "Event details for Example gathering" }),
  ).toHaveAttribute("href", "/events/example");
});
