"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, UserRound } from "lucide-react";
import type { LeaderBranch } from "./leadership-hierarchy";

export function PastoralBranch({ branch }: { branch?: LeaderBranch }) {
  const leader = branch?.leader;
  const profile = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = profile.current;
    if (!element || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          element.setAttribute("data-motion", "");
          element.toggleAttribute("data-visible", entry.isIntersecting);
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <div className="pastoral-branch">
      <article ref={profile} className="pastoral-profile">
        <div className="pastoral-portrait">
          {leader?.portrait ? (
            <Image
              src={leader.portrait}
              alt=""
              fill
              sizes="(min-width:768px) 240px, 100vw"
              className="object-cover object-top"
            />
          ) : (
            <UserRound aria-hidden="true" className="size-16" strokeWidth={1} />
          )}
        </div>
        <div className="grid content-center justify-items-start gap-3 p-4 sm:p-6">
          <p className="m-0 text-sm font-semibold">
            {leader?.role ?? "Pastoral leadership"}
          </p>
          <h4 className="m-0 text-2xl font-bold">
            {leader?.name ?? "Meet our pastors"}
          </h4>
          <p className="m-0 text-muted-foreground">
            {leader?.biography?.split(/(?<=[.!?])\s+/)[0] ??
              "Pastoral profiles will be available when the church publishes its roster."}
          </p>
          {leader ? (
            <Link
              href={"/about/leadership/" + encodeURIComponent(leader.id)}
              className="inline-flex min-h-12 items-center gap-2 font-semibold underline"
            >
              Pastor profile{" "}
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          ) : (
            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center gap-2 font-semibold underline"
            >
              Contact the information desk{" "}
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          )}
        </div>
      </article>
      {branch && branch.reports.length > 0 && (
        <ul
          className="pastoral-reports"
          aria-label={"Reports to " + branch.leader.name}
        >
          {branch.reports.map((report) => (
            <li key={report.leader.id}>
              <PastoralBranch branch={report} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
