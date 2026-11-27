import { BranchPreview } from "./branch-preview";
import { Church } from "lucide-react";
import { publishedLeaders, type ChurchLeader } from "./records";
import { leadershipHierarchy, type LeaderBranch } from "./leadership-hierarchy";
function LeaderProfile({ branch }: { branch: LeaderBranch }) {
  const { leader, reports } = branch;
  return (
    <>
      <BranchPreview
        image={leader.portrait}
        name={leader.name}
        subtitle={leader.role}
        description={leader.biography?.split(/(?<=[.!?])\s+/)[0] || leader.team}
        href={"/about/leadership/" + encodeURIComponent(leader.id)}
      />
      {reports.length > 0 && (
        <ul
          aria-label={"Reports to " + leader.name}
          className="m-0 list-none border-l border-primary pl-3"
        >
          {reports.map((report) => (
            <li
              key={report.leader.id}
              className="relative py-2 before:absolute before:top-6 before:left-0 before:w-3 before:-translate-x-full before:border-t before:border-primary"
            >
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
  const roots = leadershipHierarchy(leaders);
  return (
    <div className="church-board">
      <div className="board-root">
        <Church aria-hidden="true" className="size-5" />
        Cape Coast Central SDA
      </div>
      <ul className="board-branches">
        {roots.length ? (
          roots.map((branch) => (
            <li className="board-branch" key={branch.leader.id}>
              <LeaderProfile branch={branch} />
            </li>
          ))
        ) : (
          <li className="board-branch">
            <BranchPreview
              name="Church officers"
              subtitle="Leadership profiles will appear here when published."
              image="/images/ChurhcBuilding.jpg"
              description="For help reaching an officer, visit the church information desk."
              href="/contact"
            />
          </li>
        )}
      </ul>
    </div>
  );
}
