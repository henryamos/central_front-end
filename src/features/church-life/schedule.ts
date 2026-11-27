export type WorshipGathering = {
  id: string;
  label: string;
  kind: "study" | "worship" | "prayer" | "activity";
  day?: string;
  time?: string;
  speaker?: string;
};
export const defaultServices: readonly WorshipGathering[] = [
  {
    id: "sabbath-school",
    label: "Sabbath School",
    kind: "study",
    day: "Saturday",
    time: "8:00 AM – 10:00 AM",
  },
  {
    id: "worship",
    label: "Worship service",
    kind: "worship",
    day: "Saturday",
    time: "10:00 AM – 1:00 PM",
  },
  {
    id: "midweek-prayer",
    label: "Midweek prayer",
    kind: "prayer",
    day: "Wednesday",
    time: "6:00 PM – 8:00 PM",
  },
  {
    id: "bible-study",
    label: "Bible study",
    kind: "study",
    day: "Sunday",
    time: "6:00 PM – 8:00 PM",
  },
];
