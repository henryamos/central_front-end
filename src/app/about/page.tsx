import Link from "next/link";
import { ArrowUpRight, BookOpen, History, UsersRound } from "lucide-react";
import { PhotoHeader } from "@/features/public-site/photo-header";
import { Container } from "@/components/layout/container/container";
import { Section } from "@/components/layout/section/section";
import { Heading } from "@/components/ui/typography/typography";
import { ButtonLink } from "@/components/ui/button/button-link";
export const metadata = { title: "Our church" };
const chapters = [
  {
    title: "Our history",
    text: "The story of the congregation in Cape Coast.",
    href: "/about/history",
    icon: History,
  },
  {
    title: "Our beliefs",
    text: "The faith that shapes our worship and daily life.",
    href: "/about/beliefs",
    icon: BookOpen,
  },
  {
    title: "Church leadership",
    text: "The people who lead and serve the church.",
    href: "/about/leadership",
    icon: UsersRound,
  },
];
export default function Page() {
  return (
    <>
      <PhotoHeader
        title="Our church"
        description="We gather in Cape Coast for Sabbath worship, Bible study and prayer."
        image="/images/ChurhcBuilding.jpg"
      >
        <ButtonLink href="/visit" variant="secondary">
          Join us this Sabbath
        </ButtonLink>
      </PhotoHeader>
      <Section>
        <Container className="grid gap-6">
          <Heading level={2}>Discover Cape Coast Central</Heading>
          <div className="grid border-t border-primary">
            {chapters.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group grid items-baseline gap-4 border-b border-border py-6 hover:bg-surface-muted sm:grid-cols-[auto_minmax(0,1fr)]"
              >
                <item.icon aria-hidden="true" className="size-6" />
                <div className="grid items-baseline gap-2 md:grid-cols-2">
                  <h3 className="flex items-center gap-3 text-xl font-bold group-hover:underline">
                    {item.title}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-4 shrink-0"
                    />
                  </h3>
                  <p className="m-0 text-muted-foreground">{item.text}</p>
                </div>
              </Link>
            ))}
          </div>
          <Link
            href="/ministries"
            className="inline-flex min-h-12 w-fit items-center gap-2 font-semibold underline"
          >
            Explore our ministries
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        </Container>
      </Section>
    </>
  );
}
