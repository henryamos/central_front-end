// @vitest-environment jsdom
import "../setup";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { expect, it } from "vitest";
import { LeadershipDirectory } from "@/features/church-life/leadership-directory";
it("opens the subordinate's preview and links to that officer's detail page", () => {
  render(
    <LeadershipDirectory
      leaders={[
        { id: "one", name: "First officer", role: "Lead", team: "Example" },
        {
          id: "two",
          name: "Second officer",
          role: "Assistant",
          team: "Example",
          biography: "Short introduction. Longer biography.",
          reportsToId: "one",
        },
      ]}
    />,
  );
  const reports = within(
    screen.getByRole("list", { name: "Reports to First officer" }),
  );
  const officer = reports.getByRole("button", { name: /Second officer/ });
  fireEvent.click(officer);
  expect(reports.getByText("Short introduction.")).toBeVisible();
  expect(
    reports.getByRole("link", { name: "View details for Second officer" }),
  ).toHaveAttribute("href", "/about/leadership/two");
  fireEvent.keyDown(officer, { key: "Escape" });
  expect(officer).toHaveAttribute("aria-expanded", "false");
});
