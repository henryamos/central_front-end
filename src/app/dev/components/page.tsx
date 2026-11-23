import { notFound } from "next/navigation";
import { ComponentPreview } from "./component-preview";
export default function Page() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <ComponentPreview />;
}
