const churchClock = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Africa/Accra",
  weekday: "long",
  hour: "2-digit",
  hourCycle: "h23",
});

/** Hero display window: Friday from 18:00, plus all Saturday, in Ghana. */
export function getHeroGreeting(
  date: Date,
): "sabbath" | "midweek" | "everyday" {
  const parts = churchClock.formatToParts(date);
  const day = parts.find((part) => part.type === "weekday")?.value;
  const hour = Number(parts.find((part) => part.type === "hour")?.value);
  if (day === "Saturday" || (day === "Friday" && hour >= 18)) return "sabbath";
  return day === "Wednesday" ? "midweek" : "everyday";
}

export const heroMessages = {
  sabbath:
    "Happy Sabbath. May this day bring you rest, peace and renewed hope.",
  midweek:
    "Midweek prayer. Join us on Wednesday, 6:00 PM–8:00 PM, for prayer and fellowship.",
  everyday:
    "Come as you are and find a place to belong. Join us for worship, Bible study and fellowship.",
} as const;
