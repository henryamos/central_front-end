import { BoardIdentity } from "@/features/church-life/board-identity";
import { BranchConnector } from "@/features/church-life/branch-connector";
import { BranchPreview } from "./branch-preview";
import { publishedLeaders, type ChurchLeader } from "./records";
import { leadershipHierarchy, type LeaderBranch } from "./leadership-hierarchy";
function LeaderProfile({ branch }: { branch: LeaderBranch }) {
  const { leader, reports } = branch;
  return (
    <>
      <BranchPreview
        category="Leadership"
        image={leader.portrait}
        name={leader.name}
        subtitle={leader.role}
        description={leader.biography?.split(/(?<=[.!?])\s+/)[0] || leader.team}
        href={"/about/leadership/" + encodeURIComponent(leader.id)}
      />
      {reports.length > 0 && (
        <ul aria-label={"Reports to " + leader.name} className="board-children">
          {reports.map((report) => (
            <li key={report.leader.id} className="board-report">
              <BranchConnector />
              <LeaderProfile branch={report} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
export function LeadershipDirectory({
  leaders = publishedLeaders,
}: {
  leaders?: readonly ChurchLeader[];
}) {
  const levels = [
    {
      id: "pastors",
      label: "Pastors",
      description:
        "Pastoral leadership profiles will appear here when published.",
    },
    {
      id: "elders",
      label: "Elders",
      description: "Elder profiles will appear here when published.",
    },
    {
      id: "church-board",
      label: "Church Board",
      description:
        "Church Board member profiles will appear here when published.",
    },
    {
      id: "departmental-heads",
      label: "Departmental heads",
      description:
        "Departmental leadership profiles will appear here when published.",
    },
    {
      id: "other",
      label: "Church officers",
      description: "Leadership profiles will appear here when published.",
    },
  ] as const;
  const levelOf = (leader: ChurchLeader) =>
    leader.leadershipLevel ??
    (/pastor/i.test(leader.role)
      ? "pastors"
      : /elder/i.test(leader.role)
        ? "elders"
        : /board/i.test(leader.role)
          ? "church-board"
          : /head|director/i.test(leader.role)
            ? "departmental-heads"
            : "other");

  return (
    <div className="church-board">
      <BoardIdentity />
      <ol
        className="leadership-levels"
        aria-label="Church leadership structure"
      >
        {levels
          .filter(
            (level) =>
              level.id !== "other" ||
              leaders.some((leader) => levelOf(leader) === "other"),
          )
          .map((level) => {
            const members = leaders.filter(
              (leader) => levelOf(leader) === level.id,
            );
            const roots = leadershipHierarchy(members);
            return (
              <li className="leadership-level" key={level.id}>
                <h3 className="leadership-level-title">{level.label}</h3>
                <ul className="board-branches" aria-label={level.label}>
                  {roots.length ? (
                    roots.map((branch) => (
                      <li className="board-branch" key={branch.leader.id}>
                        <BranchConnector />
                        <LeaderProfile branch={branch} />
                      </li>
                    ))
                  ) : (
                    <li className="board-branch">
                      <BranchConnector />
                      <BranchPreview
                        category="Leadership"
                        name={level.label}
                        description={level.description}
                        href="/contact"
                      />
                    </li>
                  )}
                </ul>
              </li>
            );
          })}
      </ol>
    </div>
  );
}
