import { defaultServices } from "@/features/church-life/schedule";
import { Heading } from "@/components/ui/typography/typography";
export function WeeklySchedule() {
  return (
    <section className="grid gap-4">
      <Heading level={2}>Weekly gatherings</Heading>
      <dl className="m-0 grid gap-x-8 md:grid-cols-2">
        {defaultServices.map((item) => (
          <div key={item.id} className="grid gap-1 border-t border-border py-4">
            <dt className="font-semibold">{item.label}</dt>
            <dd className="m-0 text-muted-foreground">
              {item.day} · {item.time}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
