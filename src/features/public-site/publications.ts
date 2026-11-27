export type Publication = {
  slug: string;
  title: string;
  date: string;
  author?: string;
  body: string;
};
export const churchNews: readonly Publication[] = [];
export const churchArticles: readonly Publication[] = [];
export const bulletins: readonly {
  title: string;
  date: string;
  fileUrl: string;
}[] = [];
export const broadcast: { url?: string } = {};
