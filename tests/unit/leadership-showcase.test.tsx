// @vitest-environment jsdom
import "../setup";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { expect, it } from "vitest";
import { LeadershipShowcase } from "@/features/church-life/leadership-showcase";
it("groups boards under one tab, supports additional boards and resets the member", () => {
  render(
    <LeadershipShowcase
      leaders={[
        {
          id: "church",
          name: "Church officer",
          role: "Chair",
          team: "Board",
          leadershipLevel: "church-board",
        },
        {
          id: "school",
          name: "School officer",
          role: "Secretary",
          team: "School",
          leadershipLevel: "school-board",
        },
        {
          id: "school2",
          name: "Second officer",
          role: "Member",
          team: "School",
          leadershipLevel: "school-board",
        },
        {
          id: "extra",
          name: "Additional officer",
          role: "Chair",
          team: "Board",
          boardName: "Education Board",
        },
      ]}
    />,
  );
  expect(screen.getAllByRole("tab").map((t) => t.textContent)).toEqual([
    "Pastoral team",
    "Elders",
    "Boards",
    "Departmental heads",
  ]);
  fireEvent.click(screen.getByRole("tab", { name: "Boards" }));
  expect(screen.getByRole("heading", { name: "Church officer" })).toBeVisible();
  const picker = within(screen.getByRole("group", { name: "Choose a board" }));
  fireEvent.click(picker.getByRole("button", { name: "School Board" }));
  fireEvent.click(screen.getByRole("button", { name: "Next leader" }));
  expect(screen.getByRole("heading", { name: "Second officer" })).toBeVisible();
  fireEvent.click(picker.getByRole("button", { name: "Education Board" }));
  expect(
    screen.getByRole("heading", { name: "Additional officer" }),
  ).toBeVisible();
  expect(screen.getByRole("link", { name: /Explore profile/ })).toHaveAttribute(
    "href",
    "/about/leadership/extra",
  );
  fireEvent.click(picker.getByRole("button", { name: "School Board" }));
  expect(screen.getByRole("heading", { name: "School officer" })).toBeVisible();
});
it("keeps board selection available before any profiles are published", () => {
  render(<LeadershipShowcase leaders={[]} />);
  fireEvent.click(screen.getByRole("tab", { name: "Boards" }));
  fireEvent.click(screen.getByRole("button", { name: "School Board" }));
  expect(screen.getByText(/The school board roster/)).toBeVisible();
});
