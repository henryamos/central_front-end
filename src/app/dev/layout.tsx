import type { ReactNode } from "react";
import { env } from "@/config/env";
import { MockProvider } from "@/providers/mock-provider";
export default function DevelopmentLayout({
  children,
}: {
  children: ReactNode;
}) {
  return env.mockingEnabled ? (
    <MockProvider>{children}</MockProvider>
  ) : (
    children
  );
}
