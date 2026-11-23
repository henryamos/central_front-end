import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { apiGet } from "@/lib/api/client";
import { ApiError } from "@/lib/api/api-error";
const schema = z.object({ items: z.array(z.string()) });
afterEach(() => vi.unstubAllGlobals());
describe("API reads", () => {
  it("rejects invalid or normalized escaping paths before fetching", async () => {
    const mock = vi.fn();
    vi.stubGlobal("fetch", mock);
    for (const path of [
      "https://example.com/api/v1/x",
      "//example.com/api/v1/x",
      "/api/v1/../private",
      "/api/v1/%2e%2e/private",
      "/api/v1/\\private",
      "/api/v1/x#fragment",
    ]) {
      await expect(apiGet(path, schema)).rejects.toThrow("relative /api/v1/");
    }
    expect(mock).not.toHaveBeenCalled();
  });
  it("validates JSON, uses same-origin cookies, avoids caching, and links cancellation", async () => {
    const data = { items: ["record"] };
    const mock = vi.fn().mockResolvedValue(Response.json(data));
    vi.stubGlobal("fetch", mock);
    const controller = new AbortController();
    await expect(
      apiGet("/api/v1/sermons", schema, { signal: controller.signal }),
    ).resolves.toEqual(data);
    expect(mock).toHaveBeenCalledWith(
      "/api/v1/sermons",
      expect.objectContaining({
        credentials: "same-origin",
        cache: "no-store",
        headers: { Accept: "application/json" },
      }),
    );
    const sentSignal = mock.mock.calls[0][1].signal as AbortSignal;
    controller.abort();
    expect(sentSignal.aborted).toBe(true);
  });
  it("retains HTTP status without exposing response bodies", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(new Response("private diagnostic", { status: 403 })),
    );
    const error = await apiGet("/api/v1/sermons", schema).catch(
      (error: unknown) => error,
    );
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 403, code: "HTTP_ERROR" });
    expect(String(error)).not.toContain("private diagnostic");
  });
  it.each([
    new Response("not JSON"),
    Response.json({ secret: "private diagnostic" }),
  ])("normalizes invalid JSON and schema failures", async (response) => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response));
    await expect(apiGet("/api/v1/sermons", schema)).rejects.toMatchObject({
      code: "INVALID_RESPONSE",
    });
  });
  it("sanitizes network errors", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new TypeError("private diagnostic")),
    );
    await expect(apiGet("/api/v1/sermons", schema)).rejects.toMatchObject({
      code: "NETWORK_ERROR",
      message: "Unable to connect. Please try again.",
    });
  });
  it("preserves explicit caller cancellation", async () => {
    const controller = new AbortController();
    controller.abort();
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(controller.signal.reason));
    await expect(
      apiGet("/api/v1/sermons", schema, { signal: controller.signal }),
    ).rejects.toBe(controller.signal.reason);
  });
  it("bounds requests with a timeout", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        (_path: string, options: RequestInit) =>
          new Promise((_resolve, reject) =>
            options.signal?.addEventListener(
              "abort",
              () => reject(options.signal?.reason),
              { once: true },
            ),
          ),
      ),
    );
    await expect(
      apiGet("/api/v1/sermons", schema, { timeoutMs: 10 }),
    ).rejects.toMatchObject({ code: "TIMEOUT" });
  });
  it("supports an explicitly empty response contract", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 204 })),
    );
    await expect(
      apiGet("/api/v1/empty", z.undefined()),
    ).resolves.toBeUndefined();
  });
});
