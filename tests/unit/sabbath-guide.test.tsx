// @vitest-environment jsdom
import "../setup";
import { render, screen, fireEvent } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { SabbathInvitation } from "@/features/home/components/sabbath-invitation";
vi.mock("@/features/home/hooks/use-carousel-environment", () => ({
  useCarouselEnvironment: () => ({ reducedMotion: true, visible: true }),
}));

it("rotates arbitrary programme pairs manually, wraps, and offers the complete schedule", () => {
  render(
    <SabbathInvitation
      services={Array.from({ length: 5 }, (_, index) => ({
        id: String(index),
        label: `Gathering ${index + 1}`,
        kind: "activity",
        day: "Sunday",
        time: "6:00 PM",
      }))}
    />,
  );
  expect(
    screen.getByText("Gathering 1").closest("[data-weekly-reveal]"),
  ).toHaveAttribute("aria-hidden", "false");
  expect(
    screen.getByText("Gathering 3").closest("[data-weekly-reveal]"),
  ).toHaveAttribute("aria-hidden", "true");
  fireEvent.click(screen.getByRole("button", { name: "Next gatherings" }));
  expect(
    screen.getByText("Gathering 3").closest("[data-weekly-reveal]"),
  ).toHaveAttribute("aria-hidden", "false");
  expect(
    screen.getByText("Gathering 1").closest("[data-weekly-reveal]"),
  ).toHaveAttribute("aria-hidden", "true");
  fireEvent.click(screen.getByRole("button", { name: "Next gatherings" }));
  expect(screen.getByText("Gathering 5")).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: "Next gatherings" }));
  expect(screen.getByText("Gathering 1")).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: "View all gatherings" }));
  for (let index = 1; index <= 5; index++)
    expect(screen.getByText(`Gathering ${index}`)).toBeVisible();
});
it("shows relevant visitor actions and honestly pending details for each attendance mode", () => {
  render(<SabbathInvitation />);
  expect(screen.getByRole("tab", { name: "In person" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  expect(screen.getByRole("link", { name: "Plan a Visit" })).toHaveAttribute(
    "href",
    "/visit",
  );
  expect(
    screen.queryByRole("link", { name: "Watch online" }),
  ).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("tab", { name: "Online" }));
  expect(screen.getByRole("tabpanel", { name: "Online" })).toBeVisible();
  expect(screen.getByRole("link", { name: "Watch online" })).toHaveAttribute(
    "href",
    "/watch",
  );
  expect(screen.getByText("Schedule to be confirmed")).toBeVisible();
  expect(
    screen.queryByRole("link", { name: "Plan a Visit" }),
  ).not.toBeInTheDocument();
});
it("supports arrow, Home and End keys with matching selection, focus and panel labelling", () => {
  render(<SabbathInvitation />);
  const person = screen.getByRole("tab", { name: "In person" }),
    online = screen.getByRole("tab", { name: "Online" });
  person.focus();
  fireEvent.keyDown(person, { key: "ArrowRight" });
  expect(online).toHaveFocus();
  expect(online).toHaveAttribute("aria-selected", "true");
  const panel = screen.getByRole("tabpanel", { name: "Online" });
  expect(online).toHaveAttribute("aria-controls", panel.id);
  fireEvent.keyDown(online, { key: "ArrowRight" });
  expect(person).toHaveFocus();
  fireEvent.keyDown(person, { key: "End" });
  expect(online).toHaveFocus();
  fireEvent.keyDown(online, { key: "Home" });
  expect(person).toHaveFocus();
  fireEvent.keyDown(person, { key: "ArrowLeft" });
  expect(online).toHaveFocus();
});

it("renders supplied service times and speakers without retaining pending-time copy", () => {
  // These values are test fixtures, not the church's published schedule.
  render(
    <SabbathInvitation
      services={[
        {
          id: "study",
          label: "Sabbath School",
          kind: "study",
          day: "Saturday",
          time: "8:30 AM",
        },
        {
          id: "worship",
          label: "Worship service",
          kind: "worship",
          day: "Saturday",
          time: "10:00 AM",
          speaker: "Example speaker",
        },
      ]}
    />,
  );
  expect(screen.getByText("8:30 AM")).toBeVisible();
  expect(screen.getByText("10:00 AM")).toBeVisible();
  expect(screen.getByText("Example speaker")).toBeVisible();
  expect(
    screen.queryByText("Days and times to be confirmed."),
  ).not.toBeInTheDocument();
  expect(screen.queryByText("Time to be confirmed")).not.toBeInTheDocument();
});
it("keeps missing times explicit when only part of the programme is supplied", () => {
  render(
    <SabbathInvitation
      services={[
        {
          id: "study",
          label: "Sabbath School",
          kind: "study",
          day: "Saturday",
          time: "8:30 AM",
        },
        { id: "worship", label: "Worship service", kind: "worship", time: " " },
      ]}
    />,
  );
  expect(screen.getByText("8:30 AM")).toBeVisible();
  expect(screen.getByText("Time to be confirmed")).toBeVisible();
  expect(screen.getByText("Days and times to be confirmed.")).toBeVisible();
});

it("shows the confirmed weekly days and time ranges against the correct gatherings", () => {
  render(<SabbathInvitation />);
  for (const [label, day, time] of [
    ["Sabbath School", "Saturday", "8:00 AM – 10:00 AM"],
    ["Worship service", "Saturday", "10:00 AM – 1:00 PM"],
    ["Midweek prayer", "Wednesday", "6:00 PM – 8:00 PM"],
    ["Bible study", "Sunday", "6:00 PM – 8:00 PM"],
  ]) {
    const row = screen.getByText(label).closest("[data-weekly-reveal]");
    expect(row).toHaveTextContent(day);
    expect(row).toHaveTextContent(time);
  }
  expect(screen.queryByText("Day to be confirmed")).not.toBeInTheDocument();
  expect(screen.queryByText("Time to be confirmed")).not.toBeInTheDocument();
  expect(
    screen.queryByText("Days and times to be confirmed."),
  ).not.toBeInTheDocument();
});
it("accepts additional gathering types with their own day and time", () => {
  render(
    <SabbathInvitation
      services={[
        {
          id: "other-activity",
          label: "Example community activity",
          kind: "activity",
          day: "Sunday",
          time: "3:00 PM",
        },
      ]}
    />,
  );
  expect(screen.getByText("Example community activity")).toBeVisible();
  expect(screen.getByText("Sunday")).toBeVisible();
  expect(screen.getByText("3:00 PM")).toBeVisible();
  expect(
    screen.queryByText("Days and times to be confirmed."),
  ).not.toBeInTheDocument();
});
