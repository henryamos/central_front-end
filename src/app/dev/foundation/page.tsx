import { notFound } from "next/navigation";
import { env } from "@/config/env";
import { QueryDemo } from "./query-demo";
export default function Page() {
  if (process.env.NODE_ENV !== "development" || !env.mockingEnabled) notFound();
  return <QueryDemo />;
}
