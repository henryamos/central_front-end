import { LeadershipShowcase } from "./leadership-showcase";
import Link from "next/link";
import { useId } from "react";
import { PastoralBranch } from "./pastoral-branch";
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
  homepage = false,
}: {
  leaders?: readonly ChurchLeader[];
  homepage?: boolean;
}) {
  const navigationId = useId();
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
      id: "boards",
      label: "Boards",
      description:
        "Church and school board profiles will appear here when published.",
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
    (leader.boardName ? "church-board" : leader.leadershipLevel) ??
    (/pastor/i.test(leader.role)
      ? "pastors"
      : /elder/i.test(leader.role)
        ? "elders"
        : /school.*board/i.test(leader.role)
          ? "school-board"
          : /board/i.test(leader.role)
            ? "church-board"
            : /head|director/i.test(leader.role)
              ? "departmental-heads"
              : "other");

  const boardOf = (leader: ChurchLeader) =>
    leader.boardName ??
    (levelOf(leader) === "school-board" ? "School Board" : "Church Board");
  const boards = [
    ...new Set([
      "Church Board",
      "School Board",
      ...leaders
        .filter((leader) =>
          ["church-board", "school-board"].includes(levelOf(leader)),
        )
        .map(boardOf),
    ]),
  ];
  if (homepage) return <LeadershipShowcase leaders={leaders} />;
  return (
    <div className={homepage ? "church-board leadership-home" : "church-board"}>
      {!homepage && <BoardIdentity />}
      {!homepage && (
        <nav aria-label="Leadership groups" className="leadership-group-nav">
          {levels
            .filter((level) => level.id !== "other")
            .map((level) => (
              <Link key={level.id} href={"#" + navigationId + "-" + level.id}>
                {level.label}
              </Link>
            ))}
        </nav>
      )}
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
            const members = leaders.filter((leader) =>
              level.id === "boards"
                ? ["church-board", "school-board"].includes(levelOf(leader))
                : levelOf(leader) === level.id,
            );
            const roots = leadershipHierarchy(members);
            return (
              <li
                className="leadership-level"
                id={navigationId + "-" + level.id}
                key={level.id}
              >
                <h3 className="leadership-level-title">{level.label}</h3>
                <ul
                  className={
                    level.id === "pastors"
                      ? "pastoral-hierarchy"
                      : "board-branches"
                  }
                  aria-label={level.label}
                >
                  {level.id === "pastors" ? (
                    roots.length ? (
                      roots.map((branch) => (
                        <li key={branch.leader.id}>
                          <PastoralBranch branch={branch} />
                        </li>
                      ))
                    ) : (
                      <li>
                        <PastoralBranch />
                      </li>
                    )
                  ) : level.id === "boards" ? (
                    boards.map((label) => {
                      const boardMembers = leadershipHierarchy(
                        members.filter((member) => boardOf(member) === label),
                      );
                      return (
                        <li key={label} className="board-branch">
                          <BranchConnector />
                          <BranchPreview
                            category="Leadership"
                            name={label}
                            description={
                              label +
                              " member profiles will appear here when published."
                            }
                            href="/contact"
                          />
                          {boardMembers.length > 0 && (
                            <ul
                              className="board-children"
                              aria-label={label + " members"}
                            >
                              {boardMembers.map((branch) => (
                                <li key={branch.leader.id}>
                                  <BranchConnector />
                                  <LeaderProfile branch={branch} />
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      );
                    })
                  ) : roots.length ? (
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
                        image={
                          level.id === "elders"
                            ? "/images/General2.jpg"
                            : "/images/New.jpg"
                        }
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
