"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, UserRound } from "lucide-react";
import type { ChurchLeader } from "./records";

const groups = [
  { id: "pastors", label: "Pastoral team" },
  { id: "elders", label: "Elders" },
  { id: "church-board", label: "Church Board" },
  { id: "school-board", label: "School Board" },
  { id: "departmental-heads", label: "Departmental heads" },
] as const;

export function LeadershipShowcase({
  leaders,
}: {
  leaders: readonly ChurchLeader[];
}) {
  const gallery = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!gallery.current || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.setAttribute("data-motion", "");
          entry.target.toggleAttribute("data-visible", entry.isIntersecting);
        }
      },
      { threshold: 0.15 },
    );
    gallery.current
      .querySelectorAll(".leader-portraits>li")
      .forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);
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
  return (
    <div ref={gallery} className="leadership-showcase">
      <nav
        aria-label="Leadership groups"
        className="flex flex-wrap gap-x-6 border-b border-border"
      >
        {groups.map((group) => (
          <Link
            key={group.id}
            href={"#home-leaders-" + group.id}
            className="inline-flex min-h-12 items-center font-semibold hover:underline"
          >
            {group.label}
          </Link>
        ))}
      </nav>
      {groups.map((group) => {
        const people = leaders.filter((leader) => groupOf(leader) === group.id);
        return (
          <section
            key={group.id}
            id={"home-leaders-" + group.id}
            className="leadership-gallery-group"
          >
            <header className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="text-2xl font-bold">{group.label}</h3>
              {!people.length && (
                <p className="m-0 text-sm text-muted-foreground">
                  Profiles awaiting publication
                </p>
              )}
            </header>
            <ul
              className={
                group.id === "pastors"
                  ? "leader-portraits leader-portraits-pastors"
                  : "leader-portraits"
              }
            >
              {people.length ? (
                people.map((person) => (
                  <li key={person.id}>
                    <Link
                      href={
                        "/about/leadership/" + encodeURIComponent(person.id)
                      }
                      className="leader-portrait-link"
                    >
                      <div className="leader-photo">
                        {person.portrait ? (
                          <Image
                            src={person.portrait}
                            alt=""
                            fill
                            sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 90vw"
                            className="object-cover object-top"
                          />
                        ) : (
                          <UserRound
                            aria-hidden="true"
                            className="size-24"
                            strokeWidth={1}
                          />
                        )}
                        <span className="leader-profile-action">
                          <ArrowUpRight aria-hidden="true" className="size-5" />
                          <span className="sr-only">View profile</span>
                        </span>
                      </div>
                      <div className="grid gap-1 py-4">
                        <h4 className="text-xl font-bold">{person.name}</h4>
                        <p className="m-0 text-muted-foreground">
                          {person.role}
                        </p>
                        {person.biography && (
                          <p className="m-0 mt-2 text-sm">
                            {person.biography.split(/(?<=[.!?])\s+/)[0]}
                          </p>
                        )}
                      </div>
                    </Link>
                  </li>
                ))
              ) : (
                <li>
                  <div className="leader-photo leader-photo-pending">
                    <UserRound
                      aria-hidden="true"
                      className="size-24"
                      strokeWidth={1}
                    />
                    <span>Portrait pending</span>
                  </div>
                  <p className="m-0 py-3 text-muted-foreground">
                    {group.label} profiles will appear here.
                  </p>
                </li>
              )}
            </ul>
          </section>
        );
      })}
      <Link
        href="/about/leadership"
        className="inline-flex min-h-12 w-fit items-center gap-2 font-semibold underline"
      >
        Leadership directory{" "}
        <ArrowUpRight aria-hidden="true" className="size-4" />
      </Link>
    </div>
  );
}
