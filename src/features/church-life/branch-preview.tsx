"use client";
import { useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowDownRight,
  BookOpen,
  Church,
  HeartHandshake,
  Music2,
  Sprout,
  UsersRound,
} from "lucide-react";
const symbols = {
  study: BookOpen,
  church: Church,
  service: HeartHandshake,
  music: Music2,
  youth: Sprout,
  people: UsersRound,
};
export function BranchPreview({
  name,
  description,
  href,
  subtitle,
  image,
  symbol = "people",
}: {
  name: string;
  description: string;
  href: string;
  subtitle?: string;
  image?: string;
  symbol?: keyof typeof symbols;
}) {
  const id = useId(),
    trigger = useRef<HTMLButtonElement>(null);
  const [mode, setMode] = useState<"closed" | "hover" | "pinned">("closed");
  const expanded = mode !== "closed",
    Icon = symbols[symbol];
  return (
    <div
      className="branch-preview"
      data-expanded={expanded}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse")
          setMode((current) => (current === "closed" ? "hover" : current));
      }}
      onPointerLeave={(event) => {
        if (!event.currentTarget.contains(document.activeElement))
          setMode((current) => (current === "hover" ? "closed" : current));
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setMode("closed");
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && expanded) {
          setMode("closed");
          trigger.current?.focus();
          event.stopPropagation();
        }
      }}
    >
      <button
        type="button"
        className="profile-trigger"
        ref={trigger}
        aria-label={name}
        aria-expanded={expanded}
        aria-controls={id}
        onClick={() =>
          setMode((current) => (current === "pinned" ? "closed" : "pinned"))
        }
      >
        <span className="profile-art" aria-hidden="true">
          {image ? (
            <Image
              fill
              src={image}
              alt=""
              sizes="(min-width:768px) 36vw, 85vw"
              className="object-cover object-[center_35%]"
            />
          ) : (
            <Icon className="size-12" strokeWidth={1.25} />
          )}
        </span>
        <span className="profile-heading">
          <span>
            <strong>{name}</strong>
            {subtitle && <span className="block text-sm">{subtitle}</span>}
          </span>
          <ArrowDownRight aria-hidden="true" className="size-5 shrink-0" />
        </span>
      </button>
      <div id={id} className="profile-summary" aria-hidden={!expanded}>
        <p>{description}</p>
        <Link
          href={href}
          aria-label={"View details for " + name}
          tabIndex={expanded ? 0 : -1}
        >
          View details <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </div>
  );
}
