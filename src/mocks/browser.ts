import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";
const worker = setupWorker(...handlers);
let startup: ReturnType<typeof worker.start> | undefined;
export function startMocking() {
  if (process.env.NODE_ENV !== "development")
    throw new Error("Browser mocks require development mode.");
  return (startup ??= worker.start({
    quiet: true,
    onUnhandledFrame: "bypass",
    serviceWorker: { url: "/mockServiceWorker.js" },
  }));
}
