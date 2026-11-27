import { notFound } from "next/navigation";
import { PublicPage, PageLinks } from "@/features/public-site/public-page";
import { publishedSermons } from "@/features/public-site/sermons";
import { CopySummary } from "@/features/public-site/copy-summary";
export const dynamicParams = false;
export const generateStaticParams = () =>
  publishedSermons.map(({ slug }) => ({ slug }));
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sermon = publishedSermons.find((item) => item.slug === slug);
  if (!sermon) notFound();
  return (
    <PublicPage
      title={sermon.title}
      intro={sermon.speaker + " · " + sermon.date}
    >
      {sermon.videoUrl && (
        <a className="w-fit py-3 underline" href={sermon.videoUrl}>
          Watch the recorded sermon
        </a>
      )}
      <section>
        <h2>Sermon summary</h2>
        <p>{sermon.summary}</p>
        <CopySummary summary={sermon.summary} />
      </section>
      {sermon.downloadUrl && (
        <a className="w-fit py-3 underline" href={sermon.downloadUrl} download>
          Download sermon summary
        </a>
      )}
      <PageLinks items={[["All sermons", "/sermons"]]} />
    </PublicPage>
  );
}
