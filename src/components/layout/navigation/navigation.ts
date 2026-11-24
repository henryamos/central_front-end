import { ministries } from "@/features/ministries";
/** Route labels, not editorial content or unverified church settings. */
const links = {
  home: { label: "Home", href: "/" },
  about: { label: "About", href: "/about" },
  beliefs: { label: "Our beliefs", href: "/about/beliefs" },
  leadership: { label: "Leadership", href: "/about/leadership" },
  history: { label: "Our history", href: "/about/history" },
  ministries: { label: "Ministries", href: "/ministries" },
  sermons: { label: "Sermons", href: "/sermons" },
  events: { label: "Events", href: "/events" },
  watch: { label: "Watch online", href: "/watch" },
  give: { label: "Donate", href: "/give" },
  gallery: { label: "Gallery", href: "/gallery" },
  blog: { label: "Blog", href: "/blog" },
  news: { label: "News", href: "/news" },
  faq: { label: "FAQs", href: "/faq" },
  contact: { label: "Contact", href: "/contact" },
  visit: { label: "Plan a Visit", href: "/visit" },
  guest: { label: "Guest check-in", href: "/guest" },
} as const;
export type NavigationItem = { label: string; href: string };
export const primaryNavigation = [
  links.about,
  { ...links.visit, label: "Visit" },
  links.ministries,
  links.sermons,
  links.events,
];
export const resourceNavigation = [
  links.watch,
  links.news,
  links.blog,
  links.gallery,
  links.faq,
  links.contact,
];
export const resourceDescriptions: Record<string, string> = {
  "/watch": "Worship broadcasts",
  "/news": "Updates from our church",
  "/blog": "Articles and reflections",
  "/gallery": "Life in photographs",
  "/faq": "Answers for your visit",
  "/contact": "Our information desk",
};
export const ministryNavigation = ministries.map((ministry) => ({
  label: ministry.name,
  href: "/ministries#" + ministry.slug,
  description: ministry.description,
}));
export const homeNavigation = links.home;
export const givingNavigation = links.give;
export const visitNavigation = links.visit;
export const guestNavigation = links.guest;
export const footerNavigation = [
  {
    label: "Our church",
    links: [
      links.about,
      links.beliefs,
      links.leadership,
      links.history,
      links.ministries,
    ],
  },
  {
    label: "Worship & visit",
    links: [links.visit, links.watch, links.sermons, links.events],
  },
  {
    label: "Resources",
    links: [
      links.news,
      links.blog,
      links.gallery,
      links.faq,
      links.contact,
      links.give,
    ],
  },
];
export function isCurrentSection(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(href + "/"));
}
