// @vitest-environment jsdom
import "../setup";
import { act, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { HeroGreeting } from "@/features/home/components/hero-greeting";
import { getHeroGreeting } from "@/features/home/lib/hero-greeting";

it.each([
  ["2026-11-27T17:59:59Z", "everyday"],
  ["2026-11-27T18:00:00Z", "sabbath"],
  ["2026-11-27T23:59:59Z", "sabbath"],
  ["2026-11-28T00:00:00Z", "sabbath"],
  ["2026-11-28T23:59:59Z", "sabbath"],
  ["2026-11-29T00:00:00Z", "everyday"],
  ["2026-11-27T20:30:00-04:00", "sabbath"],
  ["2026-11-29T01:00:00+02:00", "sabbath"],
  ["2026-11-25T00:00:00Z", "midweek"],
  ["2026-11-25T23:59:59Z", "midweek"],
  ["2026-11-26T00:00:00Z", "everyday"],
])("selects the Ghana church day for %s", (date, expected) => {
  expect(getHeroGreeting(new Date(date))).toBe(expected);
});

it("updates an open page across Saturday boundaries and cleans up its timer", () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-11-27T17:59:59Z"));
  const view = render(<HeroGreeting />);
  try {
    expect(screen.queryByText(/^Happy Sabbath/)).not.toBeInTheDocument();
    act(() => vi.advanceTimersByTime(60_000));
    expect(screen.getByText(/^Happy Sabbath/)).toBeVisible();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Welcome to Cape Coast Central SDA Church",
      }),
    ).toBeVisible();
    expect(screen.queryByText(/^Come as you are/)).not.toBeInTheDocument();
    act(() => {
      vi.setSystemTime(new Date("2026-11-29T00:00:00Z"));
      vi.advanceTimersByTime(60_000);
    });
    expect(screen.queryByText(/^Happy Sabbath/)).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Welcome to Cape Coast Central SDA Church",
      }),
    ).toBeVisible();
    act(() => {
      vi.setSystemTime(new Date("2026-12-02T12:00:00Z"));
      window.dispatchEvent(new Event("focus"));
    });
    expect(screen.getByText(/^Midweek prayer/)).toBeVisible();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Welcome to Cape Coast Central SDA Church",
      }),
    ).toBeVisible();
    view.unmount();
    expect(vi.getTimerCount()).toBe(0);
  } finally {
    view.unmount();
    vi.useRealTimers();
  }
});
