import { notFound } from "next/navigation";
// No detail URLs are published until approved records are available.
export const dynamicParams = false;
export function generateStaticParams(): { slug: string }[] {
  return [];
}
export default function Page() {
  notFound();
}
