// @vitest-environment jsdom
import "../setup";
import { render, screen, fireEvent } from "@testing-library/react";
import { expect, it } from "vitest";
import { SabbathInvitation } from "@/features/home/components/sabbath-invitation";
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

it("uses the confirmed Wednesday for midweek prayer and leaves other missing details pending", () => {
  render(<SabbathInvitation />);
  expect(screen.getByText("Midweek prayer")).toBeVisible();
  expect(screen.getByText("Bible study")).toBeVisible();
  expect(screen.getAllByText("Saturday")).toHaveLength(2);
  expect(screen.getByText("Wednesday")).toBeVisible();
  expect(screen.getAllByText("Day to be confirmed")).toHaveLength(1);
  expect(screen.getAllByText("Time to be confirmed")).toHaveLength(4);
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
