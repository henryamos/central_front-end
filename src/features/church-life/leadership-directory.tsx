import { UsersRound } from "lucide-react";
import { publishedLeaders } from "./records";
export function LeadershipDirectory() {
  const teams = [...new Set(publishedLeaders.map((leader) => leader.team))];
  if (!teams.length)
    return (
      <p className="m-0 flex items-start gap-3 border-t border-border py-4 text-muted-foreground">
        <UsersRound aria-hidden="true" className="size-5 shrink-0" />
        Leadership profiles will appear here when published.
      </p>
    );
  return (
    <dl className="m-0 grid gap-6">
      {teams.map((team) => (
        <div key={team} className="grid gap-2 border-t border-border pt-4">
          <dt className="text-lg font-semibold">{team}</dt>
          {publishedLeaders
            .filter((leader) => leader.team === team)
            .map((leader) => (
              <dd key={leader.id} className="m-0 grid">
                <strong>{leader.name}</strong>
                <span>{leader.role}</span>
              </dd>
            ))}
        </div>
      ))}
    </dl>
  );
}
