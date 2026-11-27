import { notFound } from "next/navigation";
import Image from "next/image";
import { PublicPage, PageLinks } from "@/features/public-site/public-page";
import { publishedLeaders } from "@/features/church-life/records";
export const dynamicParams = false;
export const generateStaticParams = () =>
  publishedLeaders.map(({ id }) => ({ id }));
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const leader = publishedLeaders.find((item) => item.id === id);
  if (!leader) notFound();
  return (
    <PublicPage title={leader.name} intro={leader.role}>
      <article className="flex flex-wrap items-start gap-6">
        {leader.portrait && (
          <Image
            alt=""
            src={leader.portrait}
            width={240}
            height={300}
            className="h-auto max-w-full rounded-sm"
          />
        )}
        <div className="grid gap-3">
          <h2>{leader.team}</h2>
          {leader.biography && (
            <p className="m-0 whitespace-pre-line">{leader.biography}</p>
          )}
        </div>
      </article>
      <PageLinks
        items={[
          ["Leadership directory", "/about/leadership"],
          ["Information desk", "/contact"],
        ]}
      />
    </PublicPage>
  );
}
