"use client";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button/button";
import { homeSlides } from "@/features/home/constants/home.constants";
const albums = ["All photographs", "Worship", "Church building"] as const;
const building = {
  src: "/images/ChurhcBuilding.jpg",
  alt: "Inside Cape Coast Central SDA Church.",
  position: "center",
};
export function PhotoGallery() {
  const [album, setAlbum] =
    useState<(typeof albums)[number]>("All photographs");
  const photos =
    album === "Church building"
      ? [building]
      : album === "Worship"
        ? homeSlides
        : [building, ...homeSlides];
  return (
    <div className="grid gap-6">
      <div
        role="group"
        aria-label="Filter photographs"
        className="flex flex-wrap gap-2"
      >
        {albums.map((label) => (
          <Button
            key={label}
            variant={album === label ? "primary" : "secondary"}
            aria-pressed={album === label}
            onClick={() => setAlbum(label)}
          >
            {label}
          </Button>
        ))}
      </div>
      <ul className="m-0 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo) => (
          <li key={photo.src}>
            <figure className="m-0 grid gap-2">
              <Image
                src={photo.src}
                width={640}
                height={480}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                style={{ objectPosition: photo.position }}
                className="aspect-[4/3] w-full object-cover"
                alt={photo.alt}
              />
            </figure>
          </li>
        ))}
      </ul>
    </div>
  );
}
