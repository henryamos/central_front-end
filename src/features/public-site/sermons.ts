export type Sermon = {
  slug: string;
  title: string;
  speaker: string;
  date: string;
  summary: string;
  videoUrl?: string;
  downloadUrl?: string;
};
export const publishedSermons: readonly Sermon[] = [];
export function newestSermons() {
  return [...publishedSermons].sort((a, b) => b.date.localeCompare(a.date));
}
