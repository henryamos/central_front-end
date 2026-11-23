"use client";
import { Container } from "@/components/layout/container/container";
import { Section } from "@/components/layout/section/section";
import { Text } from "@/components/ui/typography/typography";
import { useEffect, useState, type ReactNode } from "react";
/** Mounted only in explicitly enabled development mode; gates requests until MSW is ready. */
export function MockProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<"starting" | "ready" | "error">(
    "starting",
  );
  useEffect(() => {
    if (process.env.NODE_ENV !== "development" || typeof window === "undefined")
      return;
    let active = true;
    import("@/mocks/browser")
      .then(({ startMocking }) => startMocking())
      .then(() => {
        if (active) setState("ready");
      })
      .catch(() => {
        if (active) setState("error");
      });
    return () => {
      active = false;
    };
  }, []);
  if (state === "starting")
    return (
      <Section aria-label="Development startup">
        <Container>
          <Text role="status">Starting development mocks...</Text>
        </Container>
      </Section>
    );
  if (state === "error")
    return (
      <Section aria-label="Development startup error">
        <Container>
          <Text role="alert">
            Development mocks could not start. Check the worker setup and
            reload.
          </Text>
        </Container>
      </Section>
    );
  return children;
}
