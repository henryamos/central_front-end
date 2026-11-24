import { ministries } from "@/features/ministries";
/** User-supplied photographs; no identities, dates or leadership roles inferred from filenames. */
export const homeSlides = [
  {
    src: "/images/General.jpg",
    alt: "A choir and musicians performing together on stage.",
    position: "center",
  },
  {
    src: "/images/ELderEmmanuel.jpg",
    alt: "A speaker holding a microphone at the front of a gathering.",
    position: "center 30%",
  },
  {
    src: "/images/Childern1.jpg",
    alt: "Two young singers standing at a microphone.",
    position: "center 30%",
  },
  {
    src: "/images/General2.jpg",
    alt: "Choir members singing from their music books.",
    position: "center",
  },
  {
    src: "/images/Boys.jpg",
    alt: "Young choir members gathered at microphones.",
    position: "center 40%",
  },
  {
    src: "/images/New.jpg",
    alt: "Choir members singing with raised hands.",
    position: "center 40%",
  },
  {
    src: "/images/dance1.jpg",
    alt: "People singing and standing together in a church hall.",
    position: "center 40%",
  },
  {
    src: "/images/dance2.jpg",
    alt: "People gathered together beside windows in a church hall.",
    position: "center 40%",
  },
  {
    src: "/images/Chilion.jpg",
    alt: "A young singer wearing glasses during a choir performance.",
    position: "center 35%",
  },
] as const;
export const homeMinistries = ministries.map((ministry) => ministry.name);
