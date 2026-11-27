import { expect, it } from "vitest";
import { leadershipHierarchy } from "../../src/features/church-life/leadership-hierarchy";
const leader = (id: string, reportsToId?: string) => ({
  id,
  name: id,
  role: "Officer",
  team: "Church",
  reportsToId,
});
it("draws only published reporting relationships and retains independent officers", () => {
  const roots = leadershipHierarchy([
    leader("assistant", "lead"),
    leader("lead"),
    leader("peer"),
    leader("other", "unpublished"),
  ]);
  expect(roots.map((root) => root.leader.id)).toEqual([
    "lead",
    "peer",
    "other",
  ]);
  expect(roots[0].reports[0].leader.id).toBe("assistant");
});
it("keeps circular assignments visible without recursive reporting lines", () => {
  const roots = leadershipHierarchy([leader("a", "b"), leader("b", "a")]);
  expect(roots).toHaveLength(2);
  expect(roots.every((root) => root.reports.length === 0)).toBe(true);
});
