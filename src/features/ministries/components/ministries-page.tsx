import Link from "next/link";
import { Container } from "@/components/layout/container/container";
import { Section } from "@/components/layout/section/section";
import { Heading, Text } from "@/components/ui/typography/typography";
import { ministries } from "../constants/ministries.constants";
export function MinistriesPage() {
  return (
    <Section aria-labelledby="ministries-page-title">
      <Container className="grid gap-12">
        <div className="grid max-w-(--measure) gap-6">
          <Heading level={1} id="ministries-page-title" weight="black">
            Our ministries.
          </Heading>
          <Text size="lead" tone="muted">
            Explore the ministries and music groups of Cape Coast Central SDA.
          </Text>
        </div>
        <div className="grid gap-x-12 md:grid-cols-2">
          {ministries.map((ministry) => (
            <section
              key={ministry.slug}
              id={ministry.slug}
              tabIndex={-1}
              aria-labelledby={ministry.slug + "-title"}
              className="grid scroll-mt-4 content-start gap-3 border-t-(length:--control-border-width) border-border py-8 focus-visible:inset-ring-(length:--focus-width) focus-visible:inset-ring-primary focus-visible:outline-hidden"
            >
              <Heading
                level={2}
                size="subsection"
                id={ministry.slug + "-title"}
              >
                <Link
                  className="inline-flex min-h-12 items-center underline"
                  href={"/ministries/" + ministry.slug}
                >
                  {ministry.name}
                </Link>
              </Heading>
              <Text tone="muted">{ministry.description}</Text>
              {"groups" in ministry && (
                <ul className="m-0 grid gap-2 pl-4">
                  {ministry.groups.map((group) => (
                    <li key={group} className="text-base">
                      <Link
                        className="inline-flex min-h-12 items-center underline"
                        href={
                          "/ministries/" +
                          group.toLowerCase().replaceAll(" ", "-")
                        }
                      >
                        {group}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </Container>
    </Section>
  );
}
