import { Input } from "@/components/ui/input/input";
import { Button } from "@/components/ui/button/button";
import { Heading, Text } from "@/components/ui/typography/typography";
export function VisitorForm({ planned = false }: { planned?: boolean }) {
  return (
    <section className="grid max-w-(--measure) gap-4">
      <Heading level={2}>
        {planned ? "Plan your Sabbath visit" : "Your visit"}
      </Heading>
      <Text>
        {planned ? "Online visit planning" : "Online guest check-in"} is
        currently unavailable. Please speak with the information desk when you
        arrive.
      </Text>
      <fieldset disabled className="m-0 grid gap-4 border-0 p-0">
        <legend className="sr-only">Visitor details</legend>
        {planned && (
          <label className="grid gap-2">
            Planned visit date
            <input
              type="date"
              className="min-h-12 rounded-sm border border-border px-3"
            />
          </label>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          {(
            [
              ["Full name", "text"],
              ["Phone number", "tel"],
              ["Email (optional)", "email"],
              ["Area of residence (optional)", "text"],
            ] as const
          ).map(([label, type]) => (
            <label key={label} className="grid gap-2">
              {label}
              <Input type={type} />
            </label>
          ))}
        </div>
        <label className="grid gap-2">
          Have you visited before?
          <select className="min-h-12 border border-border px-3">
            <option>Choose an option</option>
            <option>First visit</option>
            <option>Returning visitor</option>
          </select>
        </label>
        <label>
          <input type="checkbox" /> I am interested in Bible study.
        </label>
        <label>
          <input type="checkbox" /> The church may contact me about my visit.
        </label>
        <Button disabled className="justify-self-start">
          {planned ? "Request a visit" : "Check in"}
        </Button>
      </fieldset>
    </section>
  );
}
