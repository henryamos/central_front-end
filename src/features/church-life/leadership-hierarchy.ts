import type { ChurchLeader } from "./records";
export type LeaderBranch = { leader: ChurchLeader; reports: LeaderBranch[] };
export function leadershipHierarchy(
  leaders: readonly ChurchLeader[],
): LeaderBranch[] {
  const branches = new Map(
    leaders.map((leader) => [
      leader.id,
      { leader, reports: [] } as LeaderBranch,
    ]),
  );
  const roots: LeaderBranch[] = [];
  for (const branch of branches.values()) {
    const parent = branches.get(branch.leader.reportsToId ?? "");
    const visited = new Set([branch.leader.id]);
    let ancestor = parent;
    while (ancestor && !visited.has(ancestor.leader.id)) {
      visited.add(ancestor.leader.id);
      ancestor = branches.get(ancestor.leader.reportsToId ?? "");
    }
    if (parent && !ancestor) parent.reports.push(branch);
    else roots.push(branch);
  }
  return roots;
}
