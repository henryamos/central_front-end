"use client";
import { useId, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  UserRound,
} from "lucide-react";
import type { ChurchLeader } from "./records";
const groups = [
  { id: "pastors", label: "Pastoral team" },
  { id: "elders", label: "Elders" },
  { id: "boards", label: "Boards" },
  { id: "departmental-heads", label: "Departmental heads" },
] as const;
export function LeadershipShowcase({
  leaders,
}: {
  leaders: readonly ChurchLeader[];
}) {
  const uid = useId();
  const [active, setActive] = useState(0),
    [personIndex, setPersonIndex] = useState(0);
  const [selectedBoard, setSelectedBoard] = useState("Church Board");
  const groupOf = (leader: ChurchLeader) =>
    leader.leadershipLevel ??
    (/pastor/i.test(leader.role)
      ? "pastors"
      : /elder/i.test(leader.role)
        ? "elders"
        : /school.*board/i.test(leader.role)
          ? "school-board"
          : /board/i.test(leader.role)
            ? "church-board"
            : "departmental-heads");
  const boardOf = (leader: ChurchLeader) =>
    leader.boardName ??
    (groupOf(leader) === "school-board" ? "School Board" : "Church Board");
  const isBoard = (leader: ChurchLeader) =>
    Boolean(leader.boardName) ||
    ["church-board", "school-board"].includes(groupOf(leader));
  const boards = [
    ...new Set([
      "Church Board",
      "School Board",
      ...leaders.filter(isBoard).map(boardOf),
    ]),
  ];
  const group = groups[active],
    teamLabel = group.id === "boards" ? selectedBoard : group.label,
    people = leaders.filter((leader) =>
      group.id === "boards"
        ? isBoard(leader) && boardOf(leader) === selectedBoard
        : !isBoard(leader) && groupOf(leader) === group.id,
    ),
    person = people[personIndex] ?? people[0];
  function changeGroup(index: number) {
    setActive(index);
    setPersonIndex(0);
  }
  return (
    <div className="leadership-explorer">
      <div
        role="tablist"
        aria-label="Leadership groups"
        className="leadership-role-rail"
      >
        {groups.map((item, index) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active === index}
            aria-controls={uid + "-stage"}
            id={uid + "-" + item.id}
            tabIndex={active === index ? 0 : -1}
            onClick={() => changeGroup(index)}
            onKeyDown={(event) => {
              let next = index;
              if (event.key === "ArrowRight")
                next = (index + 1) % groups.length;
              else if (event.key === "ArrowLeft")
                next = (index + groups.length - 1) % groups.length;
              else if (event.key === "Home") next = 0;
              else if (event.key === "End") next = groups.length - 1;
              else return;
              event.preventDefault();
              changeGroup(next);
              document.getElementById(uid + "-" + groups[next].id)?.focus();
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      <section
        role="tabpanel"
        tabIndex={0}
        id={uid + "-stage"}
        aria-labelledby={uid + "-" + group.id}
        className="leadership-person-stage"
      >
        {group.id === "boards" && (
          <div className="leadership-board-picker">
            <div>
              <h3 className="m-0 text-lg font-semibold">Our boards</h3>
              <p className="m-0 text-sm text-muted-foreground">
                Choose a board to meet its members.
              </p>
            </div>
            <div
              role="group"
              aria-label="Choose a board"
              className="flex flex-wrap gap-2"
            >
              {boards.map((board) => (
                <button
                  key={board}
                  type="button"
                  aria-pressed={selectedBoard === board}
                  className="min-h-12 rounded-sm border border-border-control bg-background px-4 py-2 font-semibold aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-background"
                  onClick={() => {
                    setSelectedBoard(board);
                    setPersonIndex(0);
                  }}
                >
                  {board}
                </button>
              ))}
            </div>
          </div>
        )}
        <div
          key={teamLabel + "-" + (person?.id ?? "pending")}
          className="leadership-person-layout"
        >
          <div
            className="leadership-feature-portrait"
            data-empty={!person?.portrait}
          >
            {person?.portrait ? (
              <Image
                src={person.portrait}
                alt=""
                fill
                sizes="(min-width:768px) 40vw, 100vw"
                className="object-cover object-top"
              />
            ) : (
              <div className="grid justify-items-center gap-3">
                <UserRound
                  aria-hidden="true"
                  className="size-24"
                  strokeWidth={1}
                />
                <span className="text-sm">Portrait awaiting publication</span>
              </div>
            )}
            <span className="leadership-portrait-label">
              {person?.role ?? teamLabel}
            </span>
          </div>
          <div className="leadership-feature-copy">
            <p className="m-0 text-sm font-semibold">{teamLabel}</p>
            <h3>{person?.name ?? "Meet the people who serve."}</h3>
            <p className="m-0 text-muted-foreground">
              {person?.biography
                ?.split(/(?<=[.!?])\s+/)
                .slice(0, 2)
                .join(" ") ??
                "Names, portraits and profiles will appear here when the church publishes this team."}
            </p>
            <Link
              href={
                person
                  ? "/about/leadership/" + encodeURIComponent(person.id)
                  : "/contact"
              }
              className="inline-flex min-h-12 w-fit items-center gap-2 font-semibold underline"
            >
              {person ? "Explore profile" : "Contact the information desk"}
              <ArrowUpRight aria-hidden="true" className="size-5" />
            </Link>
            <div className="leadership-roster">
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
                <span className="font-semibold">Meet the team</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    className="min-h-12 min-w-12 rounded-sm border border-border disabled:opacity-40"
                    disabled={people.length < 2}
                    aria-label="Previous leader"
                    onClick={() =>
                      setPersonIndex(
                        (personIndex + people.length - 1) % people.length,
                      )
                    }
                  >
                    <ChevronLeft
                      aria-hidden="true"
                      className="mx-auto size-4"
                    />
                  </button>
                  <button
                    type="button"
                    className="min-h-12 min-w-12 rounded-sm border border-border disabled:opacity-40"
                    disabled={people.length < 2}
                    aria-label="Next leader"
                    onClick={() =>
                      setPersonIndex((personIndex + 1) % people.length)
                    }
                  >
                    <ChevronRight
                      aria-hidden="true"
                      className="mx-auto size-4"
                    />
                  </button>
                </div>
              </div>
              {people.length ? (
                <div className="flex flex-wrap gap-2">
                  {people.map((member, index) => (
                    <button
                      key={member.id}
                      type="button"
                      aria-pressed={member.id === person?.id}
                      onClick={() => setPersonIndex(index)}
                      className="flex min-h-12 items-center gap-2 rounded-sm border border-border px-3 py-2 text-left aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-background"
                    >
                      {member.portrait && (
                        <Image
                          src={member.portrait}
                          alt=""
                          width={32}
                          height={40}
                          className="h-12 w-8 object-cover"
                        />
                      )}
                      <span>{member.name}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="m-0 text-sm text-muted-foreground">
                  The {teamLabel.toLowerCase()} roster is awaiting publication.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
      <Link
        href="/about/leadership"
        className="inline-flex min-h-12 w-fit items-center gap-2 justify-self-end font-semibold underline"
      >
        Leadership directory
        <ArrowUpRight aria-hidden="true" className="size-4" />
      </Link>
    </div>
  );
}
