import { BranchConnector } from "@/features/church-life/branch-connector";
import { BranchPreview } from "./branch-preview";
import { Church } from "lucide-react";
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
              <BranchConnector />
              <LeaderProfile branch={branch} />
            </li>
          ))
        ) : (
          <li className="board-branch">
            <BranchConnector />
            <BranchPreview
              category="Leadership"
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
