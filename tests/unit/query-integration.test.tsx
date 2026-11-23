// @vitest-environment jsdom
import "../setup";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, expect, it } from "vitest";
import { http, HttpResponse } from "msw/http";
import { delay } from "msw";
import { server } from "@/mocks/server";
import { foundationStatus } from "@/mocks/foundation";
import { QueryProvider } from "@/providers/query-provider";
import { QueryDemo } from "@/app/dev/foundation/query-demo";
beforeAll(() => server.listen({ onUnhandledFrame: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
function Demo() {
  return (
    <QueryProvider>
      <QueryDemo />
    </QueryProvider>
  );
}
it("runs provider -> HTTP client -> MSW, preserves fresh cache, and refreshes", async () => {
  let requests = 0;
  server.use(
    http.get("*/api/v1/_foundation/status", async () => {
      requests++;
      await delay(20);
      return HttpResponse.json(foundationStatus);
    }),
  );
  const view = render(<Demo />);
  expect(screen.getByRole("status")).toHaveTextContent("Loading mock response");
  expect(await screen.findByText("Response source: MSW")).toBeVisible();
  expect(requests).toBe(1);
  view.rerender(<Demo />);
  expect(requests).toBe(1);
  fireEvent.click(screen.getByRole("button", { name: "Refresh request" }));
  await waitFor(() => expect(requests).toBe(2));
  await waitFor(() =>
    expect(
      screen.getByRole("button", { name: "Refresh request" }),
    ).toBeEnabled(),
  );
});
it("shows safe errors without retrying 401, then allows recovery", async () => {
  let requests = 0;
  server.use(
    http.get("*/api/v1/_foundation/status", () => {
      requests++;
      return HttpResponse.json(
        { secret: "private diagnostic" },
        { status: 401 },
      );
    }),
  );
  render(<Demo />);
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "The request could not be completed.",
  );
  expect(requests).toBe(1);
  expect(screen.queryByText("private diagnostic")).not.toBeInTheDocument();
  server.use(
    http.get("*/api/v1/_foundation/status", () =>
      HttpResponse.json(foundationStatus),
    ),
  );
  fireEvent.click(screen.getByRole("button", { name: "Try again" }));
  expect(await screen.findByText("Response source: MSW")).toBeVisible();
});
